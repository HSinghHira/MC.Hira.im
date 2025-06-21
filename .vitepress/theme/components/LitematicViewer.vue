
<script setup lang="ts">
import { onMounted, ref, nextTick, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { BlockState } from 'deepslate'

const loading = ref(true)
const error = ref('')
const container = ref<HTMLElement | null>(null)
const debugInfo = ref("")
const showWireframe = ref(false)

// Local URLs for mcmeta data
const BLOCK_DEF_URL = "/all/data.min.json"
const MODELS_URL = "/all/models.min.json"

// Data stores for mcmeta assets
const blockDefinitions = ref<any>({})
const models = ref<any>({})
const textureCache = ref<Map<string, THREE.Texture>>(new Map())
const materialCache = ref<Map<string, THREE.MeshLambertMaterial>>(new Map())
const geometryCache = ref<Map<string, THREE.BufferGeometry>>(new Map())

// Custom NBT parser
class NBTParser {
  private data: Uint8Array
  private pos: number = 0

  constructor(data: Uint8Array) {
    this.data = data
  }

  readByte(): number {
    if (this.pos >= this.data.length) throw new Error('Unexpected end of data')
    return this.data[this.pos++]
  }

  readShort(): number {
    if (this.pos + 1 >= this.data.length) throw new Error('Unexpected end of data')
    const value = (this.data[this.pos] << 8) | this.data[this.pos + 1]
    this.pos += 2
    return value
  }

  readInt(): number {
    if (this.pos + 3 >= this.data.length) throw new Error('Unexpected end of data')
    const value = (this.data[this.pos] << 24) | (this.data[this.pos + 1] << 16) | 
                  (this.data[this.pos + 2] << 8) | this.data[this.pos + 3]
    this.pos += 4
    return value
  }

  readLong(): bigint {
    const high = this.readInt()
    const low = this.readInt()
    return (BigInt(high) << 32n) | BigInt(low >>> 0)
  }

  readFloat(): number {
    const buffer = new ArrayBuffer(4)
    const view = new DataView(buffer)
    for (let i = 0; i < 4; i++) {
      view.setUint8(i, this.data[this.pos++])
    }
    return view.getFloat32(0, false)
  }

  readDouble(): number {
    const buffer = new ArrayBuffer(8)
    const view = new DataView(buffer)
    for (let i = 0; i < 8; i++) {
      view.setUint8(i, this.data[this.pos++])
    }
    return view.getFloat64(0, false)
  }

  readString(): string {
    const length = this.readShort()
    if (this.pos + length > this.data.length) throw new Error('String length exceeds data bounds')
    const bytes = this.data.slice(this.pos, this.pos + length)
    this.pos += length
    return new TextDecoder('utf-8').decode(bytes)
  }

  readByteArray(): Uint8Array {
    const length = this.readInt()
    if (this.pos + length > this.data.length) throw new Error('Array length exceeds data bounds')
    const array = this.data.slice(this.pos, this.pos + length)
    this.pos += length
    return array
  }

  readIntArray(): Int32Array {
    const length = this.readInt()
    const array = new Int32Array(length)
    for (let i = 0; i < length; i++) {
      array[i] = this.readInt()
    }
    return array
  }

  readLongArray(): BigInt64Array {
    const length = this.readInt()
    const array = new BigInt64Array(length)
    for (let i = 0; i < length; i++) {
      array[i] = this.readLong()
    }
    return array
  }

  parseTag(): any {
    if (this.pos >= this.data.length) return null
    const type = this.readByte()
    if (type === 0) return null
    const name = this.readString()
    const value = this.parseValue(type)
    return { name, value, type }
  }

  parseValue(type: number): any {
    try {
      switch (type) {
        case 1: return this.readByte()
        case 2: return this.readShort()
        case 3: return this.readInt()
        case 4: return this.readLong()
        case 5: return this.readFloat()
        case 6: return this.readDouble()
        case 7: return this.readByteArray()
        case 8: return this.readString()
        case 9:
          const listType = this.readByte()
          const listLength = this.readInt()
          const list: any[] = []
          for (let i = 0; i < listLength; i++) {
            list.push(this.parseValue(listType))
          }
          return list
        case 10:
          const compound: any = {}
          while (this.pos < this.data.length) {
            const tag = this.parseTag()
            if (!tag) break
            compound[tag.name] = tag.value
          }
          return compound
        case 11: return this.readIntArray()
        case 12: return this.readLongArray()
        default:
          console.warn(`Unknown NBT tag type: ${type}, skipping`)
          return null
      }
    } catch (error) {
      console.warn(`Error parsing NBT type ${type}:`, error)
      return null
    }
  }

  parse(): any {
    const rootTag = this.parseTag()
    return rootTag?.value || {}
  }
}

async function fetchMcmetaData() {
  try {
    debugInfo.value += "\nFetching mcmeta data..."
    const [blockDefRes, modelsRes] = await Promise.all([
      fetch(BLOCK_DEF_URL).then(res => {
        if (!res.ok) throw new Error(`Failed to fetch block definitions: ${res.status}`)
        return res.json()
      }),
      fetch(MODELS_URL).then(res => {
        if (!res.ok) throw new Error(`Failed to fetch models: ${res.status}`)
        return res.json()
      })
    ])
    blockDefinitions.value = blockDefRes
    models.value = modelsRes
    debugInfo.value += `\nMcmeta data loaded: ${Object.keys(blockDefRes).length} block definitions, ${Object.keys(modelsRes).length} models`
    debugInfo.value += `\nBlock definition keys: ${JSON.stringify(Object.keys(blockDefRes).slice(0, 10))}...`
  } catch (err: any) {
    debugInfo.value += `\nError fetching mcmeta data: ${err.message}`
    console.error('Mcmeta fetch error:', err)
    error.value = 'Failed to load block data. Using fallback rendering.'
  }
}

async function loadTexture(textureName: string): Promise<THREE.Texture> {
  if (textureCache.value.has(textureName)) {
    return textureCache.value.get(textureName)!
  }

  return new Promise((resolve, reject) => {
    const textureLoader = new THREE.TextureLoader()
    const texturePath = `/textures/block/${textureName}.png`
    textureLoader.load(
      texturePath,
      (texture) => {
        texture.magFilter = THREE.NearestFilter
        texture.minFilter = THREE.NearestFilter
        texture.generateMipmaps = false
        textureCache.value.set(textureName, texture)
        debugInfo.value += `\nTexture loaded: ${texturePath}`
        resolve(texture)
      },
      undefined,
      (err) => {
        debugInfo.value += `\nFailed to load texture: ${texturePath}`
        console.warn(`Texture load error: ${texturePath}`, err)
        const fallbackTexture = new THREE.TextureLoader().load('/textures/block/stone.png')
        textureCache.value.set(textureName, fallbackTexture)
        resolve(fallbackTexture)
      }
    )
  })
}

async function getBlockMaterial(blockState: BlockState): Promise<THREE.MeshLambertMaterial> {
  const blockName = blockState.getName().path.replace('minecraft:', '')
  const properties = blockState.getProperties()
  const cacheKey = blockName + JSON.stringify(properties)

  if (materialCache.value.has(cacheKey)) {
    return materialCache.value.get(cacheKey)!
  }

  let textureName = blockName
  let isTransparent = false

  switch (blockName) {
    case 'grass_block':
      textureName = 'grass_block_top'
      break
    case 'powered_rail':
      textureName = properties.powered === 'true' ? 'powered_rail_on' : 'powered_rail'
      break
    case 'rail':
      textureName = 'rail'
      break
    case 'dispenser':
      textureName = 'dispenser_front'
      break
    case 'glass':
      textureName = 'glass'
      isTransparent = true
      break
    case 'ladder':
      textureName = 'ladder'
      isTransparent = true
      break
    case 'oak_button':
      textureName = 'oak_planks'
      isTransparent = true
      break
    case 'oak_fence':
      textureName = 'oak_planks'
      break
    case 'white_bed':
      textureName = 'white_wool'
      isTransparent = true
      break
    case 'white_carpet':
      textureName = 'white_wool'
      isTransparent = true
      break
    case 'oak_trapdoor':
      textureName = 'oak_trapdoor'
      isTransparent = true
      break
    default:
      textureName = blockName
  }

  const blockDef = blockDefinitions.value[blockName] || blockDefinitions.value[`minecraft:${blockName}`]
  if (blockDef && blockDef.default && blockDef.default.model) {
    const modelId = blockDef.default.model
    const model = models.value[modelId]
    if (model && model.textures && model.textures.all) {
      textureName = model.textures.all.replace('minecraft:block/', '')
    }
  }

  const texture = await loadTexture(textureName)
  const material = new THREE.MeshLambertMaterial({
    map: texture,
    side: THREE.DoubleSide,
    transparent: isTransparent,
    alphaTest: isTransparent ? 0.5 : undefined,
    wireframe: showWireframe.value
  })

  materialCache.value.set(cacheKey, material)
  debugInfo.value += `\nMaterial created for ${blockName}: texture=${textureName}, transparent=${isTransparent}, wireframe=${showWireframe.value}`
  return material
}

function getBlockGeometry(blockState: BlockState): THREE.BufferGeometry {
  const blockName = blockState.getName().path.replace('minecraft:', '')
  const properties = blockState.getProperties()
  const cacheKey = blockName + JSON.stringify(properties)

  if (geometryCache.value.has(cacheKey)) {
    return geometryCache.value.get(cacheKey)!
  }

  let geometry: THREE.BufferGeometry
  const blockDef = blockDefinitions.value[blockName] || blockDefinitions.value[`minecraft:${blockName}`]
  let modelId = blockDef?.default?.model || blockDef?.states?.[0]?.model

  if (blockDef && blockDef.states) {
    const stateKey = Object.entries(properties)
      .map(([key, value]) => `${key}=${value}`)
      .sort()
      .join(',')
    const state = blockDef.states.find((s: any) => {
      const stateProps = Object.entries(s.properties || {})
        .map(([k, v]) => `${k}=${v}`)
        .sort()
        .join(',')
      return stateProps === stateKey
    }) || blockDef.default
    if (state) modelId = state.model
  }

  const model = modelId ? models.value[modelId] : null

  switch (blockName) {
    case 'ladder': {
      const facing = properties.facing || 'north'
      geometry = new THREE.PlaneGeometry(1, 1)
      let rotationY = 0
      let offsetX = 0, offsetZ = 0
      let uvArray = new Float32Array([
        0, 1, 0, 0, 1, 0, 1, 1 // 90° CCW (test vertical rungs)
      ])
      let planeNormal = ''
      let uvRotation = '90° CCW'

      switch (facing) {
        case 'north':
          rotationY = Math.PI
          offsetZ = -0.5
          planeNormal = 'positive Z'
          uvArray = new Float32Array([
            1, 0, 0, 0, 0, 1, 1, 1 // 180°
          ])
          uvRotation = '180°'
          break
        case 'south':
          rotationY = 0
          offsetZ = 0.5
          planeNormal = 'negative Z'
          uvArray = new Float32Array([
            0, 0, 1, 0, 1, 1, 0, 1 // 0°
          ])
          uvRotation = '0°'
          break
        case 'west':
          rotationY = Math.PI / 2
          offsetX = 0.5
          planeNormal = 'positive X'
          break
        case 'east':
          rotationY = -Math.PI / 2
          offsetX = -0.5
          planeNormal = 'negative X'
          uvArray = new Float32Array([
            0, 0, 1, 0, 1, 1, 0, 1 // 0°
          ])
          uvRotation = '0°'
          break
      }

      geometry.rotateY(rotationY)
      geometry.translate(offsetX, 0, offsetZ)
      geometry.setAttribute('uv', new THREE.BufferAttribute(uvArray, 2))
      geometry.attributes.uv.needsUpdate = true
      debugInfo.value += `\nGeometry for ladder: facing=${facing}, offset=(${offsetX}, 0, ${offsetZ}), rotationY=${rotationY}, UVs=[${uvArray.join(', ')}], planeNormal=${planeNormal}, uvRotation=${uvRotation}, assuming ladder.png rungs vertical`
      break
    }
    case 'rail':
    case 'powered_rail': {
      const shape = properties.shape || 'north_south'
      geometry = new THREE.PlaneGeometry(1, 1)
      geometry.rotateX(-Math.PI / 2)
      let rotationZ = 0
      let rotationX = 0
      let offsetY = 0.01
      let uvArray = new Float32Array([
        0, 1, 0, 0, 1, 0, 1, 1 // 90° CCW
      ])
      let slopeDir = 'none'
      let uvRotation = '90° CCW'

      switch (shape) {
        case 'north_south':
          rotationZ = 0
          break
        case 'east_west':
          rotationZ = Math.PI / 2
          uvArray = new Float32Array([
            0, 0, 1, 0, 1, 1, 0, 1 // 0°
          ])
          uvRotation = '0°'
          break
        case 'ascending_north':
          rotationX = Math.PI / 12
          offsetY = 0.25
          slopeDir = 'up toward north'
          break
        case 'ascending_south':
          rotationX = -Math.PI / 12
          offsetY = 0.25
          slopeDir = 'up toward south'
          break
        case 'ascending_east':
          rotationZ = Math.PI / 2
          rotationX = Math.PI / 12
          offsetY = 0.25
          slopeDir = 'up toward east'
          uvArray = new Float32Array([
            0, 0, 1, 0, 1, 1, 0, 1 // 0°
          ])
          uvRotation = '0°'
          break
        case 'ascending_west':
          rotationZ = Math.PI / 2
          rotationX = -Math.PI / 12
          offsetY = 0.25
          slopeDir = 'up toward west'
          uvArray = new Float32Array([
            0, 0, 1, 0, 1, 1, 0, 1 // 0°
          ])
          uvRotation = '0°'
          break
      }

      geometry.rotateZ(rotationZ)
      geometry.rotateX(rotationX)
      geometry.translate(0, offsetY, 0)
      geometry.setAttribute('uv', new THREE.BufferAttribute(uvArray, 2))
      geometry.attributes.uv.needsUpdate = true
      debugInfo.value += `\nGeometry for ${blockName}: shape=${shape}, rotationZ=${rotationZ}, rotationX=${rotationX}, offsetY=${offsetY}, UVs=[${uvArray.join(', ')}], size=(1, 1), slopeDir=${slopeDir}, uvRotation=${uvRotation}, assuming rail.png ties vertical`
      break
    }
    case 'oak_button': {
      const facing = properties.facing || 'north'
      const face = properties.face || 'wall'
      geometry = new THREE.BoxGeometry(0.375, 0.125, 0.375)
      let offsetX = 0, offsetY = 0, offsetZ = 0
      let rotationY = 0
      if (face === 'floor') {
        offsetY = -0.4375
      } else if (face === 'ceiling') {
        offsetY = 0.4375
      } else {
        switch (facing) {
          case 'north':
            rotationY = Math.PI
            offsetZ = -0.4375
            break
          case 'south':
            rotationY = 0
            offsetZ = 0.4375
            break
          case 'west':
            rotationY = Math.PI / 2
            offsetX = -0.4375
            break
          case 'east':
            rotationY = -Math.PI / 2
            offsetX = 0.4375
            break
        }
      }
      geometry.rotateY(rotationY)
      geometry.translate(offsetX, offsetY, offsetZ)
      debugInfo.value += `\nGeometry for oak_button: face=${face}, facing=${facing}, offset=(${offsetX}, ${offsetY}, ${offsetZ}), size=(0.375, 0.125, 0.375)`
      break
    }
    case 'oak_trapdoor': {
      const half = properties.half || 'bottom'
      const facing = properties.facing || 'north'
      geometry = new THREE.BoxGeometry(1, 0.1875, 1)
      let offsetY = half === 'bottom' ? -0.40625 : 0.40625
      let rotationX = 0, rotationY = 0
      if (properties.open === 'true') {
        switch (facing) {
          case 'north':
            rotationX = -Math.PI / 2
            offsetY = 0.40625
            break
          case 'south':
            rotationX = Math.PI / 2
            offsetY = 0.40625
            break
          case 'west':
            rotationX = Math.PI / 2
            rotationY = Math.PI / 2
            offsetY = 0.40625
            break
          case 'east':
            rotationX = -Math.PI / 2
            rotationY = Math.PI / 2
            offsetY = 0.40625
            break
        }
      }
      geometry.rotateX(rotationX)
      geometry.rotateY(rotationY)
      geometry.translate(0, offsetY, 0)
      debugInfo.value += `\nGeometry for oak_trapdoor: half=${half}, facing=${facing}, open=${properties.open}, offsetY=${offsetY}, size=(1, 0.1875, 1)`
      break
    }
    case 'white_carpet': {
      geometry = new THREE.BoxGeometry(1, 0.0625, 1)
      geometry.translate(0, -0.46875, 0)
      debugInfo.value += `\nGeometry for white_carpet: size=(1, 0.0625, 1), offset=(0, -0.46875, 0)`
      break
    }
    case 'white_bed': {
      geometry = new THREE.BoxGeometry(1, 0.5625, 1)
      geometry.translate(0, -0.21875, 0)
      debugInfo.value += `\nGeometry for white_bed: size=(1, 0.5625, 1), offset=(0, -0.21875, 0)`
      break
    }
    default: {
      if (model && model.elements && model.elements.length > 0) {
        const element = model.elements[0]
        const from = element.from || [0, 0, 0]
        const to = element.to || [16, 16, 16]
        const sizeX = (to[0] - from[0]) / 16
        const sizeY = (to[1] - from[1]) / 16
        const sizeZ = (to[2] - from[2]) / 16
        geometry = new THREE.BoxGeometry(sizeX, sizeY, sizeZ)
        geometry.translate(
          (from[0] / 16) + (sizeX / 2) - 0.5,
          (from[1] / 16) + (sizeY / 2) - 0.5,
          (from[2] / 16) + (sizeZ / 2) - 0.5
        )
        debugInfo.value += `\nGeometry for ${blockName}: model-based, size=(${sizeX}, ${sizeY}, ${sizeZ})`
      } else {
        geometry = new THREE.BoxGeometry(1, 1, 1)
        debugInfo.value += `\nGeometry for ${blockName}: default box, size=(1, 1, 1)`
      }
    }
  }

  geometryCache.value.set(cacheKey, geometry)
  return geometry
}

async function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    try {
      loading.value = true
      error.value = ''
      debugInfo.value = 'Loading file from upload...'
      const file = input.files[0]
      const compressed = await file.arrayBuffer()
      debugInfo.value = `File loaded: ${compressed.byteLength} bytes`
      await processFile(new Uint8Array(compressed))
    } catch (err: any) {
      loading.value = false
      error.value = 'Error loading Litematic: ' + (err?.message || 'Unknown error')
      debugInfo.value += `\nError: ${err?.message || 'Unknown error'}`
      console.error('Full error:', err)
    }
  }
}

async function processFile(compressed: Uint8Array) {
  const pako = await import('pako')
  let decompressed: Uint8Array
  try {
    decompressed = pako.inflate(compressed)
    debugInfo.value += `\nDecompressed: ${decompressed.length} bytes`
  } catch (decompressError) {
    throw new Error(`Decompression failed: ${decompressError}`)
  }

  if (decompressed[0] !== 0x0a) {
    throw new Error('Invalid NBT file: does not start with compound tag (0x0a)')
  }

  let nbtData
  try {
    const parser = new NBTParser(decompressed)
    nbtData = parser.parse()
    debugInfo.value += `\nNBT parsing successful: ${JSON.stringify(Object.keys(nbtData), null, 2)}`
  } catch (parseError) {
    throw new Error(`Failed to parse NBT data: ${parseError}`)
  }

  await processNbtData(nbtData)
}

async function processNbtData(nbtData: any) {
  const regions = nbtData.Regions || nbtData.regions
  if (!regions) {
    throw new Error('Invalid litematic structure: missing Regions')
  }

  const regionKey = Object.keys(regions)[0]
  if (!regionKey) {
    throw new Error('No regions found in litematic')
  }

  const region = regions[regionKey]
  const size = region.Size || region.size
  const palette = region.BlockStatePalette || region.Palette || region.palette
  const blockStates = region.BlockStates || region.blockStates

  if (!size || !palette || !blockStates) {
    throw new Error(`Invalid region structure: missing ${!size ? 'Size' : ''} ${!palette ? 'Palette' : ''} ${!blockStates ? 'BlockStates' : ''}`)
  }

  const sizeArray = [size.x, size.y, size.z].map((v: any) => Math.abs(Number(v)))
  if (sizeArray.some((v: number) => isNaN(v) || v === 0)) {
    debugInfo.value += `\nWarning: Invalid size values [${sizeArray.join(', ')}], falling back to single block`
    const blockPalette = [new BlockState('minecraft:stone', {})]
    const decodedStates = [0]
    await waitForContainer()
    await initThree(sizeArray, blockPalette, decodedStates)
    return
  }
  debugInfo.value += `\nSize: [${sizeArray.join(', ')}], Palette entries: ${palette.length}`

  const blockPalette = palette.map((entry: any, index: number) => {
    try {
      const name = entry.Name || entry.name || 'minecraft:stone'
      const properties = entry.Properties || {}
      debugInfo.value += `\nBlock palette entry ${index}: ${name}, properties: ${JSON.stringify(properties)}`
      return new BlockState(name, properties)
    } catch (err) {
      console.warn(`Invalid block in palette at index ${index}:`, err)
      return new BlockState('minecraft:stone', {})
    }
  })

  const bitsPerEntry = Math.max(2, Math.ceil(Math.log2(palette.length)))
  const totalBlocks = sizeArray[0] * sizeArray[1] * sizeArray[2]
  const decodedStates = decodeBitPackedLongArray(blockStates, bitsPerEntry, totalBlocks)

  await waitForContainer()
  await initThree(sizeArray, blockPalette, decodedStates)
}

async function waitForContainer() {
  let attempts = 0
  const maxAttempts = 20
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  while (!container.value && attempts < maxAttempts) {
    await nextTick()
    await delay(50)
    attempts++
    debugInfo.value += `\nWaiting for container, attempt ${attempts}`
  }

  if (!container.value) {
    throw new Error('Cannot initialize Three.js: container element unavailable')
  }
  debugInfo.value += `\nContainer found, proceeding with rendering`
}

onMounted(async () => {
  try {
    await fetchMcmetaData()
    await waitForContainer()
    debugInfo.value += '\nContainer found, proceeding with file load'

    const urlParams = new URLSearchParams(window.location.search)
    let fileURL = urlParams.get('file') || urlParams.get('url')
    
    if (!fileURL) {
      debugInfo.value += '\nNo file URL provided. Please upload a file.'
      loading.value = false
      return
    }

    if (fileURL.startsWith('/')) {
      fileURL = window.location.origin + fileURL
    }

    const res = await fetch(fileURL)
    if (!res.ok) {
      throw new Error(`Failed to fetch file: ${res.status} ${res.statusText}`)
    }

    const compressed = await res.arrayBuffer()
    debugInfo.value += `\nFile loaded: ${compressed.byteLength} bytes`
    await processFile(new Uint8Array(compressed))
  } catch (err: any) {
    loading.value = false
    error.value = 'Error loading Litematic: ' + (err?.message || 'Unknown error')
    debugInfo.value += `\nError: ${err?.message || 'Unknown error'}`
    console.error('Full error:', err)
  }
})

onBeforeUnmount(() => {
  if (container.value) {
    container.value.innerHTML = ''
  }
})

function decodeBitPackedLongArray(longArray: bigint[], bitsPerEntry: number, arraySize: number): number[] {
  const result: number[] = new Array(arraySize).fill(0)
  const mask = (1n << BigInt(bitsPerEntry)) - 1n
  let globalBitIndex = 0

  for (let i = 0; i < arraySize; i++) {
    const longIndex = Math.floor(globalBitIndex / 64)
    const localBitIndex = globalBitIndex % 64
    if (longIndex >= longArray.length) break

    let value: bigint
    if (localBitIndex + bitsPerEntry <= 64) {
      value = (longArray[longIndex] >> BigInt(localBitIndex)) & mask
    } else {
      const bitsFromFirstLong = 64 - localBitIndex
      const bitsFromSecondLong = bitsPerEntry - bitsFromFirstLong
      const firstPart = (longArray[longIndex] >> BigInt(localBitIndex)) & ((1n << BigInt(bitsFromFirstLong)) - 1n)
      const secondPart = longIndex + 1 < longArray.length 
        ? (longArray[longIndex + 1] & ((1n << BigInt(bitsFromSecondLong)) - 1n))
        : 0n
      value = firstPart | (secondPart << BigInt(bitsFromFirstLong))
    }

    result[i] = Number(value)
    globalBitIndex += bitsPerEntry
  }
  return result
}

async function initThree(sizeArray: number[], palette: BlockState[], blockStates: number[]) {
  if (!container.value) {
    debugInfo.value += `\nError: Container missing in initThree`
    throw new Error('Cannot initialize Three.js: container unavailable')
  }

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(60, container.value.clientWidth / container.value.clientHeight, 0.1, 1000)
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
  renderer.setClearColor(0x87ceeb, 1)
  container.value.innerHTML = ''
  container.value.appendChild(renderer.domElement)

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
  scene.add(ambientLight)
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.7)
  dirLight.position.set(10, 20, 10)
  scene.add(dirLight)

  const axesHelper = new THREE.AxesHelper(5)
  scene.add(axesHelper)
  debugInfo.value += `\nAdded axis helper: X=red, Y=green, Z=blue`

  const onResize = () => {
    if (container.value) {
      camera.aspect = container.value.clientWidth / container.value.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.value.clientWidth, container.value.clientHeight)
    }
  }
  window.addEventListener('resize', onResize)

  let blocksAdded = 0

  for (let y = 0; y < sizeArray[1]; y++) {
    for (let z = 0; z < sizeArray[2]; z++) {
      for (let x = 0; x < sizeArray[0]; x++) {
        const index = y * sizeArray[2] * sizeArray[0] + z * sizeArray[0] + x
        if (index >= blockStates.length) continue

        const paletteIndex = blockStates[index]
        if (paletteIndex >= palette.length || paletteIndex < 0) {
          debugInfo.value += `\nWarning: Invalid palette index ${paletteIndex} at position (${x}, ${y}, ${z})`
          continue
        }

        const blockState = palette[paletteIndex]
        const blockName = blockState.getName().path
        if (blockName.includes('air')) continue

        const geometry = getBlockGeometry(blockState)
        const material = await getBlockMaterial(blockState)
        const cube = new THREE.Mesh(geometry, material)
        cube.position.set(x - sizeArray[0] / 2, y, z - sizeArray[2] / 2)
        scene.add(cube)
        blocksAdded++

        if (blockName.includes('ladder') || blockName.includes('rail')) {
          const debugCube = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 0.1, 0.1),
            new THREE.MeshBasicMaterial({ color: blockName.includes('ladder') ? 0xff0000 : 0x0000ff })
          )
          debugCube.position.set(x - sizeArray[0] / 2, y, z - sizeArray[2] / 2)
          scene.add(debugCube)
          debugInfo.value += `\nAdded debug cube for ${blockName} at (${x}, ${y}, ${z}), color=${blockName.includes('ladder') ? 'red' : 'blue'}`
        }

        if (blocksAdded >= 50000) {
          debugInfo.value += `\nWarning: Reached block limit of 50000`
          break
        }
      }
      if (blocksAdded >= 50000) break
    }
    if (blocksAdded >= 50000) break
  }

  debugInfo.value += `\nRendered ${blocksAdded} blocks`
  if (blocksAdded === 0) {
    const fallbackCube = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshLambertMaterial({ color: 0xff0000 })
    )
    scene.add(fallbackCube)
    debugInfo.value += `\nAdded fallback red cube`
  }

  const maxDim = Math.max(...sizeArray, 10)
  camera.position.set(maxDim * 1.5, maxDim, maxDim * 1.5)
  camera.lookAt(0, sizeArray[1] / 2, 0)

  let mouseDown = false
  let mouseX = 0
  let mouseY = 0
  let cameraDistance = maxDim * 2
  let cameraAngleX = Math.PI / 4
  let cameraAngleY = Math.PI / 6

  const updateCamera = () => {
    const centerY = sizeArray[1] / 2
    camera.position.x = Math.cos(cameraAngleX) * Math.cos(cameraAngleY) * cameraDistance
    camera.position.z = Math.sin(cameraAngleX) * Math.cos(cameraAngleY) * cameraDistance
    camera.position.y = centerY + Math.sin(cameraAngleY) * cameraDistance
    camera.lookAt(0, centerY, 0)
  }

  renderer.domElement.addEventListener('mousedown', (e) => {
    mouseDown = true
    mouseX = e.clientX
    mouseY = e.clientY
  })

  renderer.domElement.addEventListener('mouseup', () => {
    mouseDown = false
  })

  renderer.domElement.addEventListener('mousemove', (e) => {
    if (mouseDown) {
      const deltaX = e.clientX - mouseX
      const deltaY = e.clientY - mouseY
      cameraAngleX += deltaX * 0.005
      cameraAngleY = Math.max(-Math.PI/2 + 0.1, Math.min(Math.PI/2 - 0.1, cameraAngleY + deltaY * 0.005))
      updateCamera()
      mouseX = e.clientX
      mouseY = e.clientY
    }
  })

  renderer.domElement.addEventListener('wheel', (e) => {
    e.preventDefault()
    cameraDistance *= (1 + e.deltaY * 0.001)
    cameraDistance = Math.max(5, Math.min(500, cameraDistance))
    updateCamera()
  })

  window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'w') {
      showWireframe.value = !showWireframe.value
      materialCache.value.forEach((material) => {
        material.wireframe = showWireframe.value
        material.needsUpdate = true
      })
      debugInfo.value += `\nWireframe toggled: ${showWireframe.value}`
    }
  })

  updateCamera()

  const animate = () => {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
  }
  animate()

  onBeforeUnmount(() => {
    window.removeEventListener('resize', onResize)
    renderer.dispose()
  })
}

function getBlockColor(blockName: string): number {
  const baseName = blockName.split('[')[0].toLowerCase()
  const colorMap: Record<string, number> = {
    'stone': 0x808080,
    'grass_block': 0x7CFC00,
    'dirt': 0x8B4513,
    'sand': 0xF5F5DC,
    'glass': 0xB0E0E6
  }
  return colorMap[baseName] || 0x808080
}
</script>

<template>
  <div class="p-4">
    <h1 class="mb-4 font-bold text-2xl">Litematic Viewer</h1>
    <div class="mb-4">
      <input type="file" accept=".litematic" @change="handleFileUpload" />
    </div>
    <div v-if="error" class="bg-red-100 p-4 rounded-lg text-red-600">
      Error: {{ error }}
    </div>
    <div class="space-y-2">
      <div ref="container" class="border rounded-lg overflow-hidden" style="width: 800px; height: 600px">
        <!-- Three.js canvas -->
      </div>
      <div class="text-gray-500 dark:text-gray-300 text-sm">
        <p>- Click and drag to rotate.</p>
        <p>- Use mouse wheel to zoom.</p>
        <p>- Press 'W' to toggle wireframe for debugging.</p>
        <p>- Axis helper: X=red, Y=green, Z=blue.</p>
        <p>- Debug cubes: Red for ladders, blue for rails.</p>
        <p>- Displays blocks from litematic with Minecraft textures.</p>
      </div>
      <details class="text-gray-500 dark:text-gray text-xs">
        <summary>Debug Info</summary>
        <pre class="bg-gray-100 dark:bg-gray-800 mt-2 p-4 rounded whitespace-pre-wrap">{{ debugInfo }}</pre>
      </details>
    </div>
  </div>
</template>

<style scoped>
canvas {
  max-width: 100%;
  cursor: grab;
}
canvas:active {
  cursor: grabbing;
}
</style>