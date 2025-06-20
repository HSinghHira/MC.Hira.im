
<script setup lang="ts">
import { onMounted, ref, nextTick } from 'vue'
import * as THREE from 'three'
import { BlockState } from 'deepslate'

const loading = ref(true)
const error = ref('')
const container = ref<HTMLElement | null>(null)
const debugInfo = ref('')

// Custom NBT parser with full tag support
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
    
    if (type === 0) return null // TAG_End
    
    const name = this.readString()
    const value = this.parseValue(type)
    
    return { name, value, type }
  }

  parseValue(type: number): any {
    try {
      switch (type) {
        case 1: return this.readByte() // TAG_Byte
        case 2: return this.readShort() // TAG_Short
        case 3: return this.readInt() // TAG_Int
        case 4: return this.readLong() // TAG_Long
        case 5: return this.readFloat() // TAG_Float
        case 6: return this.readDouble() // TAG_Double
        case 7: return this.readByteArray() // TAG_Byte_Array
        case 8: return this.readString() // TAG_String
        case 9: // TAG_List
          const listType = this.readByte()
          const listLength = this.readInt()
          const list: any[] = []
          for (let i = 0; i < listLength; i++) {
            list.push(this.parseValue(listType))
          }
          return list
        case 10: // TAG_Compound
          const compound: any = {}
          while (this.pos < this.data.length) {
            const tag = this.parseTag()
            if (!tag) break
            compound[tag.name] = tag.value
          }
          return compound
        case 11: return this.readIntArray() // TAG_Int_Array
        case 12: return this.readLongArray() // TAG_Long_Array
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
    debugInfo.value += `\nFirst 10 bytes: ${Array.from(decompressed.slice(0, 10)).map(b => b.toString(16).padStart(2, '0')).join(' ')}`
  } catch (decompressError) {
    throw new Error(`Decompression failed: ${decompressError}`)
  }

  if (decompressed[0] !== 0x0a) {
    debugInfo.value += `\nInvalid NBT header: expected 0x0a, got 0x${decompressed[0].toString(16)}`
    throw new Error('Invalid NBT file: does not start with compound tag (0x0a)')
  }

  let nbtData
  try {
    const parser = new NBTParser(decompressed)
    nbtData = parser.parse()
    debugInfo.value += `\nNBT parsing successful: ${JSON.stringify(Object.keys(nbtData), null, 2)}`
    console.log('Parsed NBT data:', nbtData)
  } catch (parseError) {
    debugInfo.value += `\nNBT parsing failed: ${parseError}`
    throw new Error(`Failed to parse NBT data: ${parseError}`)
  }

  await processNbtData(nbtData)
}

async function processNbtData(nbtData: any) {
  const regions = nbtData.Regions || nbtData.regions
  if (!regions) {
    debugInfo.value += `\nNBT keys: ${Object.keys(nbtData).join(', ')}`
    throw new Error('Invalid litematic structure: missing Regions')
  }

  const regionKey = Object.keys(regions)[0]
  if (!regionKey) {
    throw new Error('No regions found in litematic')
  }

  const region = regions[regionKey]
  debugInfo.value += `\nRegion keys: ${Object.keys(region).join(', ')}`
  
  const size = region.Size || region.size
  const palette = region.BlockStatePalette || region.Palette || region.palette
  const blockStates = region.BlockStates || region.blockStates

  if (!size || !palette || !blockStates) {
    throw new Error(`Invalid region structure: missing ${!size ? 'Size' : ''} ${!palette ? 'Palette' : ''} ${!blockStates ? 'BlockStates' : ''}`)
  }

  debugInfo.value += `\nRaw Size object: ${JSON.stringify(size)}`
  const sizeArray = [size.x, size.y, size.z].map((v: any) => Math.abs(Number(v)))
  if (sizeArray.some((v: number) => isNaN(v) || v === 0)) {
    debugInfo.value += `\nWarning: Invalid size values [${sizeArray.join(', ')}], falling back to single block`
    const blockPalette = [new BlockState('minecraft:stone', {})]
    const decodedStates = [0]
    await waitForContainer()
    initThree([1, 1, 1], blockPalette, decodedStates)
    return
  }
  debugInfo.value += `\nSize (absolute): [${sizeArray.join(', ')}]`
  debugInfo.value += `\nPalette entries: ${palette.length}`

  const blockPalette = palette.map((entry: any, index: number) => {
    try {
      const name = entry.Name || entry.name || 'minecraft:stone'
      const properties = entry.Properties || {}
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
  initThree(sizeArray, blockPalette, decodedStates)
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
    debugInfo.value += `\nContainer ref: ${container.value ? 'Found' : 'Null'}`
    const containerExists = document.querySelector('.border.rounded-lg.overflow-hidden')
    debugInfo.value += `\nContainer element in DOM: ${!!containerExists}`
  }

  if (!container.value) {
    const containerExists = document.querySelector('.border.rounded-lg.overflow-hidden')
    debugInfo.value += `\nFinal check - Container element in DOM: ${!!containerExists}`
    throw new Error('Cannot initialize Three.js: container element is not available after retries')
  }
  debugInfo.value += `\nContainer found, proceeding with rendering`
}

onMounted(async () => {
  try {
    await waitForContainer()
    debugInfo.value = 'Container found, proceeding with file load'

    const urlParams = new URLSearchParams(window.location.search)
    let fileURL = urlParams.get('file') || urlParams.get('url')
    
    if (!fileURL) {
      debugInfo.value = 'No file URL provided. Please upload a file.'
      loading.value = false
      return
    }

    if (fileURL.startsWith('/')) {
      fileURL = window.location.origin + fileURL
    }

    console.log('Fetching file:', fileURL)
    debugInfo.value = 'Fetching file...'

    const res = await fetch(fileURL)
    if (!res.ok) {
      throw new Error(`Failed to fetch file: ${res.status} ${res.statusText}`)
    }

    const compressed = await res.arrayBuffer()
    debugInfo.value = `File loaded: ${compressed.byteLength} bytes`

    await processFile(new Uint8Array(compressed))
  } catch (err: any) {
    loading.value = false
    error.value = 'Error loading Litematic: ' + (err?.message || 'Unknown error')
    debugInfo.value += `\nError: ${err?.message || 'Unknown error'}`
    console.error('Full error:', err)
  }
})

function decodeBitPackedLongArray(
  longArray: bigint[], 
  bitsPerEntry: number, 
  arraySize: number
): number[] {
  const result: number[] = new Array(arraySize).fill(0)
  const entriesPerLong = Math.floor(64 / bitsPerEntry)
  const mask = (1n << BigInt(bitsPerEntry)) - 1n
  
  let globalBitIndex = 0
  
  for (let i = 0; i < arraySize; i++) {
    const longIndex = Math.floor(globalBitIndex / 64)
    const localBitIndex = globalBitIndex % 64
    
    if (longIndex >= longArray.length) {
      console.warn(`Out-of-bounds longArray access at index ${longIndex}`)
      break
    }
    
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

function initThree(sizeArray: number[], palette: BlockState[], blockStates: number[]) {
  if (!container.value) {
    debugInfo.value += `\nError: Container is null in initThree`
    throw new Error('Cannot initialize Three.js: container element is still unavailable')
  }
  debugInfo.value += `\nContainer found in initThree, initializing Three.js`

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(800, 600)
  renderer.setClearColor(0x87CEEB)
  container.value.appendChild(renderer.domElement)

  // Add lighting
  const ambientLight = new THREE.AmbientLight(0x404040, 0.6)
  scene.add(ambientLight)
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(10, 10, 5)
  scene.add(directionalLight)

  // Texture loader and cache
  const textureLoader = new THREE.TextureLoader()
  textureLoader.setCrossOrigin('anonymous')
  const textureCache = new Map<string, THREE.Texture>()

  // Create geometry
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  let blocksAdded = 0

  // Render blocks
  for (let y = 0; y < sizeArray[1]; y++) {
    for (let z = 0; z < sizeArray[2]; z++) {
      for (let x = 0; x < sizeArray[0]; x++) {
        const index = y * sizeArray[2] * sizeArray[0] + z * sizeArray[0] + x
        if (index >= blockStates.length) {
          console.warn(`Invalid block state index ${index}`)
          continue
        }

        const paletteIndex = blockStates[index]
        if (paletteIndex >= palette.length || paletteIndex < 0) {
          console.warn(`Invalid palette index ${paletteIndex} at (${x}, ${y}, ${z})`)
          continue
        }

        const blockState = palette[paletteIndex]
        const blockName = blockState.getName().path

        // Skip air blocks
        if (blockName.includes('air')) continue

        // Load textures for the block
        const textures = getBlockTextures(blockName)
        const materials = textures.map((texturePath, index) => {
          if (!texturePath) {
            return new THREE.MeshLambertMaterial({ color: getBlockColor(blockName) })
          }
          let texture = textureCache.get(texturePath)
          if (!texture) {
            try {
              texture = textureLoader.load(`/textures/block/${texturePath}`)
              texture.magFilter = THREE.NearestFilter
              texture.minFilter = THREE.NearestFilter
              textureCache.set(texturePath, texture)
              debugInfo.value += `\nLoaded texture for ${blockName}: ${texturePath}`
            } catch (err) {
              console.warn(`Failed to load texture for ${blockName}: ${texturePath}, using fallback color`)
              return new THREE.MeshLambertMaterial({ color: getBlockColor(blockName) })
            }
          }
          return new THREE.MeshLambertMaterial({ map: texture })
        })

        const cube = new THREE.Mesh(geometry, materials.length === 1 ? materials[0] : materials)
        cube.position.set(
          x - sizeArray[0] / 2,
          y,
          z - sizeArray[2] / 2
        )

        scene.add(cube)
        blocksAdded++

        if (blocksAdded >= 50000) {
          console.log('Reached block limit, stopping render')
          break
        }
      }
      if (blocksAdded >= 50000) break
    }
    if (blocksAdded >= 50000) break
  }

  console.log(`Rendered ${blocksAdded} blocks`)
  debugInfo.value += `\nRendered ${blocksAdded} blocks`

  // Fallback if no blocks rendered
  if (blocksAdded === 0) {
    const fallbackMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 })
    const fallbackCube = new THREE.Mesh(geometry, fallbackMaterial)
    scene.add(fallbackCube)
    blocksAdded = 1
    console.log('Added fallback red cube')
    debugInfo.value += '\nAdded fallback red cube'
  }

  // Position camera
  const maxDim = Math.max(...sizeArray, 20)
  camera.position.set(maxDim * 1.5, maxDim, maxDim * 1.5)
  camera.lookAt(0, sizeArray[1] / 2, 0)

  // Add mouse controls
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

  updateCamera()

  // Animation loop
  const animate = () => {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
  }
  
  animate()
}

function getBlockTextures(blockName: string): (string | null)[] {
  const baseName = blockName.split('[')[0].toLowerCase()
  const multiTextureMap: Record<string, (string | null)[]> = {
    'grass_block': [
      'grass_block_side.png', // right
      'grass_block_side.png', // left
      'grass_block_top.png',  // top
      'dirt.png',            // bottom
      'grass_block_side.png', // front
      'grass_block_side.png'  // back
    ],
    'furnace': [
      'furnace_side.png',
      'furnace_side.png',
      'furnace_top.png',
      'furnace_top.png',
      'furnace_front.png',
      'furnace_side.png'
    ],
    'oak_log': [
      'oak_log.png',
      'oak_log.png',
      'oak_log_top.png',
      'oak_log_top.png',
      'oak_log.png',
      'oak_log.png'
    ],
    // Add more blocks with multiple textures as needed
  }

  if (multiTextureMap[baseName]) {
    return multiTextureMap[baseName]
  }

  // Fallback to single texture for all faces
  const singleTexture = getBlockTexturePath(blockName)
  return Array(6).fill(singleTexture)
}

function getBlockTexturePath(blockName: string): string {
  const baseName = blockName.split('[')[0].toLowerCase()
  const textureMap: Record<string, string> = {
    // Stone and variants
    'stone': 'stone.png',
    'granite': 'granite.png',
    'polished_granite': 'polished_granite.png',
    'diorite': 'diorite.png',
    'polished_diorite': 'polished_diorite.png',
    'andesite': 'andesite.png',
    'polished_andesite': 'polished_andesite.png',
    'deepslate': 'deepslate.png',
    'cobbled_deepslate': 'cobbled_deepslate.png',
    'polished_deepslate': 'polished_deepslate.png',
    'deepslate_tiles': 'deepslate_tiles.png',
    'deepslate_bricks': 'deepslate_bricks.png',
    'cracked_deepslate_bricks': 'cracked_deepslate_bricks.png',
    'cracked_deepslate_tiles': 'cracked_deepslate_tiles.png',
    'tuff': 'tuff.png',
    'calcite': 'calcite.png',

    // Dirt and grass
    'dirt': 'dirt.png',
    'coarse_dirt': 'coarse_dirt.png',
    'podzol': 'podzol_side.png',
    'rooted_dirt': 'rooted_dirt.png',
    'grass_block': 'grass_block_side.png',
    'mycelium': 'mycelium_side.png',
    'mud': 'mud.png',

    // Sand and gravel
    'sand': 'sand.png',
    'red_sand': 'red_sand.png',
    'gravel': 'gravel.png',
    'sandstone': 'sandstone.png',
    'red_sandstone': 'red_sandstone.png',
    'smooth_sandstone': 'smooth_sandstone.png',
    'smooth_red_sandstone': 'smooth_red_sandstone.png',
    'chiseled_sandstone': 'chiseled_sandstone.png',
    'chiseled_red_sandstone': 'chiseled_red_sandstone.png',

    // Wood and planks
    'oak_planks': 'oak_planks.png',
    'spruce_planks': 'spruce_planks.png',
    'birch_planks': 'birch_planks.png',
    'jungle_planks': 'jungle_planks.png',
    'acacia_planks': 'acacia_planks.png',
    'dark_oak_planks': 'dark_oak_planks.png',
    'mangrove_planks': 'mangrove_planks.png',
    'cherry_planks': 'cherry_planks.png',
    'bamboo_planks': 'bamboo_planks.png',
    'crimson_planks': 'crimson_planks.png',
    'warped_planks': 'warped_planks.png',
    'planks': 'oak_planks.png', // Generic fallback
    'oak_log': 'oak_log.png',
    'spruce_log': 'spruce_log.png',
    'birch_log': 'birch_log.png',
    'jungle_log': 'jungle_log.png',
    'acacia_log': 'acacia_log.png',
    'dark_oak_log': 'dark_oak_log.png',
    'mangrove_log': 'mangrove_log.png',
    'cherry_log': 'cherry_log.png',
    'bamboo_block': 'bamboo_block.png',
    'crimson_stem': 'crimson_stem.png',
    'warped_stem': 'warped_stem.png',
    'log': 'oak_log.png', // Generic fallback
    'oak_wood': 'oak_log.png',
    'spruce_wood': 'spruce_log.png',
    'birch_wood': 'birch_log.png',
    'jungle_wood': 'jungle_log.png',
    'acacia_wood': 'acacia_log.png',
    'dark_oak_wood': 'dark_oak_log.png',
    'mangrove_wood': 'mangrove_log.png',
    'cherry_wood': 'cherry_log.png',
    'bamboo_mosaic': 'bamboo_mosaic.png',
    'crimson_hyphae': 'crimson_stem.png',
    'warped_hyphae': 'warped_stem.png',
    'stripped_oak_log': 'stripped_oak_log.png',
    'stripped_spruce_log': 'stripped_spruce_log.png',
    'stripped_birch_log': 'stripped_birch_log.png',
    'stripped_jungle_log': 'stripped_jungle_log.png',
    'stripped_acacia_log': 'stripped_acacia_log.png',
    'stripped_dark_oak_log': 'stripped_dark_oak_log.png',
    'stripped_mangrove_log': 'stripped_mangrove_log.png',
    'stripped_cherry_log': 'stripped_cherry_log.png',
    'stripped_bamboo_block': 'stripped_bamboo_block.png',
    'stripped_crimson_stem': 'stripped_crimson_stem.png',
    'stripped_warped_stem': 'stripped_warped_stem.png',

    // Leaves
    'oak_leaves': 'oak_leaves.png',
    'spruce_leaves': 'spruce_leaves.png',
    'birch_leaves': 'birch_leaves.png',
    'jungle_leaves': 'jungle_leaves.png',
    'acacia_leaves': 'acacia_leaves.png',
    'dark_oak_leaves': 'dark_oak_leaves.png',
    'mangrove_leaves': 'mangrove_leaves.png',
    'cherry_leaves': 'cherry_leaves.png',
    'azalea_leaves': 'azalea_leaves.png',
    'flowering_azalea_leaves': 'flowering_azalea_leaves.png',
    'leaves': 'oak_leaves.png', // Generic fallback

    // Ores and raw blocks
    'coal_ore': 'coal_ore.png',
    'iron_ore': 'iron_ore.png',
    'copper_ore': 'copper_ore.png',
    'gold_ore': 'gold_ore.png',
    'redstone_ore': 'redstone_ore.png',
    'emerald_ore': 'emerald_ore.png',
    'lapis_ore': 'lapis_ore.png',
    'diamond_ore': 'diamond_ore.png',
    'deepslate_coal_ore': 'deepslate_coal_ore.png',
    'deepslate_iron_ore': 'deepslate_iron_ore.png',
    'deepslate_copper_ore': 'deepslate_copper_ore.png',
    'deepslate_gold_ore': 'deepslate_gold_ore.png',
    'deepslate_redstone_ore': 'deepslate_redstone_ore.png',
    'deepslate_emerald_ore': 'deepslate_emerald_ore.png',
    'deepslate_lapis_ore': 'deepslate_lapis_ore.png',
    'deepslate_diamond_ore': 'deepslate_diamond_ore.png',
    'nether_quartz_ore': 'nether_quartz_ore.png',
    'nether_gold_ore': 'nether_gold_ore.png',
    'iron_block': 'iron_block.png',
    'raw_iron_block': 'raw_iron_block.png',
    'copper_block': 'copper_block.png',
    'raw_copper_block': 'raw_copper_block.png',
    'gold_block': 'gold_block.png',
    'raw_gold_block': 'raw_gold_block.png',
    'emerald_block': 'emerald_block.png',
    'lapis_block': 'lapis_block.png',
    'diamond_block': 'diamond_block.png',
    'netherite_block': 'netherite_block.png',

    // Wool
    'white_wool': 'white_wool.png',
    'orange_wool': 'orange_wool.png',
    'magenta_wool': 'magenta_wool.png',
    'light_blue_wool': 'light_blue_wool.png',
    'yellow_wool': 'yellow_wool.png',
    'lime_wool': 'lime_wool.png',
    'pink_wool': 'pink_wool.png',
    'gray_wool': 'gray_wool.png',
    'light_gray_wool': 'light_gray_wool.png',
    'cyan_wool': 'cyan_wool.png',
    'purple_wool': 'purple_wool.png',
    'blue_wool': 'blue_wool.png',
    'brown_wool': 'brown_wool.png',
    'green_wool': 'green_wool.png',
    'red_wool': 'red_wool.png',
    'black_wool': 'black_wool.png',
    'wool': 'white_wool.png', // Generic fallback

    // Concrete
    'white_concrete': 'white_concrete.png',
    'orange_concrete': 'orange_concrete.png',
    'magenta_concrete': 'magenta_concrete.png',
    'light_blue_concrete': 'light_blue_concrete.png',
    'yellow_concrete': 'yellow_concrete.png',
    'lime_concrete': 'lime_concrete.png',
    'pink_concrete': 'pink_concrete.png',
    'gray_concrete': 'gray_concrete.png',
    'light_gray_concrete': 'light_gray_concrete.png',
    'cyan_concrete': 'cyan_concrete.png',
    'purple_concrete': 'purple_concrete.png',
    'blue_concrete': 'blue_concrete.png',
    'brown_concrete': 'brown_concrete.png',
    'green_concrete': 'green_concrete.png',
    'red_concrete': 'red_concrete.png',
    'black_concrete': 'black_concrete.png',
    'concrete': 'white_concrete.png', // Generic fallback

    // Terracotta
    'terracotta': 'terracotta.png',
    'white_terracotta': 'white_terracotta.png',
    'orange_terracotta': 'orange_terracotta.png',
    'magenta_terracotta': 'magenta_terracotta.png',
    'light_blue_terracotta': 'light_blue_terracotta.png',
    'yellow_terracotta': 'yellow_terracotta.png',
    'lime_terracotta': 'lime_terracotta.png',
    'pink_terracotta': 'pink_terracotta.png',
    'gray_terracotta': 'gray_terracotta.png',
    'light_gray_terracotta': 'light_gray_terracotta.png',
    'cyan_terracotta': 'cyan_terracotta.png',
    'purple_terracotta': 'purple_terracotta.png',
    'blue_terracotta': 'blue_terracotta.png',
    'brown_terracotta': 'brown_terracotta.png',
    'green_terracotta': 'green_terracotta.png',
    'red_terracotta': 'red_terracotta.png',
    'black_terracotta': 'black_terracotta.png',

    // Glass
    'glass': 'glass.png',
    'tinted_glass': 'tinted_glass.png',
    'white_stained_glass': 'white_stained_glass.png',
    'orange_stained_glass': 'orange_stained_glass.png',
    'magenta_stained_glass': 'magenta_stained_glass.png',
    'light_blue_stained_glass': 'light_blue_stained_glass.png',
    'yellow_stained_glass': 'yellow_stained_glass.png',
    'lime_stained_glass': 'lime_stained_glass.png',
    'pink_stained_glass': 'pink_stained_glass.png',
    'gray_stained_glass': 'gray_stained_glass.png',
    'light_gray_stained_glass': 'light_gray_stained_glass.png',
    'cyan_stained_glass': 'cyan_stained_glass.png',
    'purple_stained_glass': 'purple_stained_glass.png',
    'blue_stained_glass': 'blue_stained_glass.png',
    'brown_stained_glass': 'brown_stained_glass.png',
    'green_stained_glass': 'green_stained_glass.png',
    'red_stained_glass': 'red_stained_glass.png',
    'black_stained_glass': 'black_stained_glass.png',

    // Stone bricks and variants
    'cobblestone': 'cobblestone.png',
    'mossy_cobblestone': 'mossy_cobblestone.png',
    'stone_bricks': 'stone_bricks.png',
    'mossy_stone_bricks': 'mossy_stone_bricks.png',
    'cracked_stone_bricks': 'cracked_stone_bricks.png',
    'chiseled_stone_bricks': 'chiseled_stone_bricks.png',

    // Nether blocks
    'netherrack': 'netherrack.png',
    'nether_bricks': 'nether_bricks.png',
    'red_nether_bricks': 'red_nether_bricks.png',
    'chiseled_nether_bricks': 'chiseled_nether_bricks.png',
    'cracked_nether_bricks': 'cracked_nether_bricks.png',
    'basalt': 'basalt.png',
    'smooth_basalt': 'smooth_basalt.png',
    'polished_basalt': 'polished_basalt.png',
    'blackstone': 'blackstone.png',
    'polished_blackstone': 'polished_blackstone.png',
    'polished_blackstone_bricks': 'polished_blackstone_bricks.png',
    'cracked_polished_blackstone_bricks': 'cracked_polished_blackstone_bricks.png',
    'chiseled_polished_blackstone': 'chiseled_polished_blackstone.png',
    'gilded_blackstone': 'gilded_blackstone.png',

    // End blocks
    'end_stone': 'end_stone.png',
    'end_stone_bricks': 'end_stone_bricks.png',
    'purpur_block': 'purpur_block.png',
    'purpur_pillar': 'purpur_pillar.png',

    // Ice and snow
    'ice': 'ice.png',
    'packed_ice': 'packed_ice.png',
    'blue_ice': 'blue_ice.png',
    'snow_block': 'snow_block.png',
    'snow': 'snow.png',

    // Liquids
    'water': 'water_still.png',
    'lava': 'lava_still.png',

    // Other natural blocks
    'clay': 'clay.png',
    'dripstone_block': 'dripstone_block.png',
    'pointed_dripstone': 'pointed_dripstone.png', // Simplified, may need model
    'amethyst_block': 'amethyst_block.png',
    'budding_amethyst': 'budding_amethyst.png',
    'sculk': 'sculk.png',
    'reinforced_deepslate': 'reinforced_deepslate.png',

    // Building blocks
    'bricks': 'bricks.png',
    'quartz_block': 'quartz_block_side.png',
    'smooth_quartz': 'smooth_quartz.png',
    'quartz_bricks': 'quartz_bricks.png',
    'chiseled_quartz_block': 'chiseled_quartz_block.png',
    'quartz_pillar': 'quartz_pillar.png',
    'prismarine': 'prismarine.png',
    'prismarine_bricks': 'prismarine_bricks.png',
    'dark_prismarine': 'dark_prismarine.png',
    'sea_lantern': 'sea_lantern.png',
    'glowstone': 'glowstone.png',
    'obsidian': 'obsidian.png',
    'bedrock': 'bedrock.png',

    // Redstone components (simplified textures)
    'redstone_block': 'redstone_block.png',
    'dispenser': 'dispenser_front.png',
    'dropper': 'dropper_front.png',
    'piston': 'piston_side.png',
    'sticky_piston': 'piston_side.png', // Uses same side texture
    'observer': 'observer_front.png',
    'repeater': 'repeater.png',
    'comparator': 'comparator.png',

    // Miscellaneous
    'furnace': 'furnace_front.png',
    'crafting_table': 'crafting_table_front.png',
    'bookshelf': 'bookshelf.png',
    'enchanting_table': 'enchanting_table_side.png',
    'anvil': 'anvil.png',
    'barrel': 'barrel_side.png',
    'blast_furnace': 'blast_furnace_front.png',
    'smoker': 'smoker_front.png',
    'cartography_table': 'cartography_table_side.png',
    'fletching_table': 'fletching_table_side.png',
    'grindstone': 'grindstone_side.png',
    'lectern': 'lectern_side.png',
    'smithing_table': 'smithing_table_side.png',
    'stonecutter': 'stonecutter_side.png',
    'beehive': 'beehive_side.png',
    'bee_nest': 'bee_nest_side.png',
    'composter': 'composter_side.png',
    'cauldron': 'cauldron_side.png'
  }

  return textureMap[baseName] || `${baseName}.png`
}

function getBlockColor(blockName: string): number {
  const baseName = blockName.split('[')[0].toLowerCase()
  const colorMap: Record<string, number> = {
    'air': 0x000000,
    'stone': 0x808080,
    'granite': 0xA0695F,
    'polished_granite': 0xB8725C,
    'diorite': 0xE6E6FA,
    'polished_diorite': 0xF0F0FF,
    'andesite': 0x8C8C8C,
    'polished_andesite': 0x969696,
    'deepslate': 0x646464,
    'cobbled_deepslate': 0x5A5A5A,
    'dirt': 0x8B4513,
    'coarse_dirt': 0x7A3F12,
    'podzol': 0x8B7355,
    'rooted_dirt': 0x9B5523,
    'grass_block': 0x7CFC00,
    'grass': 0x7CFC00,
    'mycelium': 0x8B7355,
    'oak': 0xDEB887,
    'spruce': 0x8B4513,
    'birch': 0xF5DEB3,
    'jungle': 0xCD853F,
    'acacia': 0xFF7F00,
    'dark_oak': 0x654321,
    'mangrove': 0x8B5A2B,
    'cherry': 0xFFB6C1,
    'bamboo': 0x90EE90,
    'crimson': 0x8B008B,
    'warped': 0x4B0082,
    'planks': 0xDEB887,
    'log': 0x8B4513,
    'wood': 0x8B4513,
    'stripped': 0xD2B48C,
    'leaves': 0x228B22,
    'cobblestone': 0x696969,
    'mossy_cobblestone': 0x5F7F5F,
    'stone_bricks': 0x7F7F7F,
    'mossy_stone_bricks': 0x6F8F6F,
    'cracked_stone_bricks': 0x6F6F6F,
    'chiseled_stone_bricks': 0x757575,
    'water': 0x0000FF,
    'lava': 0xFF4500,
    'sand': 0xFAF0E6,
    'red_sand': 0xDC143C,
    'gravel': 0x808080,
    'iron': 0xC0C0C0,
    'gold': 0xFFD700,
    'diamond': 0x00FFFF,
    'emerald': 0x00FF00,
    'netherite': 0x654321,
    'redstone': 0xFF0000,
    'coal': 0x2F2F2F,
    'copper': 0xB87333,
    'wool': 0xFFFFFF,
    'white_wool': 0xFFFFFF,
    'orange_wool': 0xFF7F00,
    'magenta_wool': 0xFF00FF,
    'light_blue_wool': 0xADD8E6,
    'yellow_wool': 0xFFFF00,
    'lime_wool': 0x00FF00,
    'pink_wool': 0xFFC0CB,
    'gray_wool': 0x808080,
    'light_gray_wool': 0xD3D3D3,
    'cyan_wool': 0x00FFFF,
    'purple_wool': 0x800080,
    'blue_wool': 0x0000FF,
    'brown_wool': 0x8B4513,
    'green_wool': 0x008000,
    'red_wool': 0xFF0000,
    'black_wool': 0x000000,
    'concrete': 0xD3D3D3,
    'terracotta': 0xD2691E,
    'glass': 0x87CEEB,
    'tinted_glass': 0x4F4F4F,
    'glowstone': 0xFFFF99,
    'obsidian': 0x1C1C1C,
    'netherrack': 0x8B0000,
    'quartz': 0xFFFFF0,
    'prismarine': 0x40E0D0,
    'dark_prismarine': 0x2F4F4F,
    'prismarine_bricks': 0x5F9F9F,
    'sea_lantern': 0xB0E0E6,
    'bricks': 0xB22222,
    'nether_bricks': 0x800000,
    'red_nether_bricks': 0xA0001F,
    'end_stone': 0xFFF8DC,
    'end_stone_bricks': 0xF0E68C,
    'purpur': 0x9966CC,
    'ice': 0xB0E0E6,
    'packed_ice': 0x9FD5FF,
    'blue_ice': 0x74C2FF,
    'snow': 0xFFFAFA,
    'snow_block': 0xFFFAFA,
    'clay': 0xB0C4DE,
    'bedrock': 0x2F2F2F,
    'blackstone': 0x2F2F2F,
    'polished_blackstone': 0x3F3F3F,
    'blackstone_bricks': 0x353535,
    'cracked_blackstone_bricks': 0x2F2F2F,
    'chiseled_blackstone': 0x4F4F4F,
    'gilded_blackstone': 0x4F4F2F,
    'basalt': 0x5F5F5F,
    'polished_basalt': 0x6F6F6F,
    'tuff': 0x7F7F7F,
    'calcite': 0xF5F5F5,
    'dripstone': 0x8B7D6B,
    'pointed_dripstone': 0x8B7D6B,
    'amethyst': 0x9966CC,
    'budding_amethyst': 0x8A5FCC,
    'sculk': 0x1A1A2E,
    'reinforced_deepslate': 0x2F2F2F,
  }

  if (colorMap[baseName]) {
    return colorMap[baseName]
  }

  for (const [key, color] of Object.entries(colorMap)) {
    if (baseName.includes(key)) {
      return color
    }
  }

  let hash = 0
  for (let i = 0; i < baseName.length; i++) {
    hash = baseName.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  const hue = Math.abs(hash) % 360
  const saturation = 50 + (Math.abs(hash >> 8) % 50)
  const lightness = 40 + (Math.abs(hash >> 16) % 40)
  
  return hslToHex(hue, saturation, lightness)
}

function hslToHex(h: number, s: number, l: number): number {
  s /= 100
  l /= 100
  
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs((h / 60) - 1))
  const m = (1 << 0) - 1
  
  let r = 0, g = 0, b = 0
  
  if (0 <= h && h < 60) {
    r = c; g = x; b = 0
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c
  } else if (300 <= h && h < 360) {
    r = c; g = x; b = 0
  }
  
  r = Math.round((r + m) * 255)
  g = Math.round((g + m) * 255)
  b = Math.round((b + m) * 255)
  
  return (r << 16) | (g << 8) | b
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
      <div ref="container" class="border rounded-lg overflow-hidden">
        <!-- Three.js will be inserted here -->
      </div>
      <div class="text-gray-500 dark:text-gray-300 text-sm">
        <p>- Click and drag to rotate.</p>
        <p>- Use mouse wheel to zoom.</p>
        <p>- This shows blocks from the litematic file with Minecraft textures.</p>
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
  cursor: pointer;
}
</style>