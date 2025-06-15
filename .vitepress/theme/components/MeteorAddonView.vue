<template>
  <div class="fixed inset-0 overflow-hidden font-['courier']">
    <!-- Background overlay -->
    <div class="absolute inset-0 bg-cover bg-no-repeat bg-center" style="background-image: url('/data/assets/meteoraddonbg.png')"></div>
    
    <!-- Draggable GUI Container -->
    <div
      ref="guiRef"
      class="absolute w-fit select-none"
      :style="{ left: position.x + 'px', top: position.y + 'px' }"
    >
      <!-- Header -->
      <div
        ref="headerRef"
        class="flex justify-between items-center bg-purple-600 px-2 py-1.5 font-bold text-white text-xl cursor-move"
        @mousedown="startDrag"
      >
        <span>{{ repoName }}</span>
        <button
          class="bg-transparent opacity-50 hover:opacity-75 ml-2 border-none text-white transition-transform duration-500 cursor-pointer"
          :class="{ '-rotate-90': isCollapsed }"
          @click="toggleCollapse"
        >
          <svg class="fill-current w-6 h-6" viewBox="0 0 24 24">
            <path d="M7 10l5 5 5-5z"/>
          </svg>
        </button>
      </div>

      <!-- Modules Container -->
      <div
        class="bg-black bg-opacity-80 overflow-auto transition-all duration-500 ease-out"
        :class="{ 'max-h-0': isCollapsed }"
        :style="{ maxHeight: isCollapsed ? '0px' : maxHeight + 'px' }"
      >
        <div
          v-for="module in modules"
          :key="module.name"
          class="bg-[length:200%_100%] bg-gradient-to-l from-transparent via-transparent to-gray-600 bg-right hover:bg-left px-2 py-1.5 text-white text-lg transition-all duration-500 ease-out cursor-pointer"
          :class="{
            'bg-gray-600 border-l-4 border-purple-600 !bg-none': module.active
          }"
          @click="toggleModule(module)"
        >
          {{ module.displayName }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'

// Get URL parameters with new structure
const getUrlParams = () => {
  const urlParams = new URLSearchParams(window.location.search)
  const keys = [...urlParams.keys()]
  
  if (keys.length > 0) {
    // Parse the new format: ?AntiCope/meteor-rejects/tree/master/src/main/java/anticope/rejects/modules
    const fullPath = keys[0]
    const parts = fullPath.split('/')
    
    if (parts.length >= 4 && parts[2] === 'tree') {
      const user = parts[0]
      const repo = parts[1]
      const branch = parts[3] // 'master' or other branch
      const path = parts.slice(4).join('/') // everything after branch
      
      return { user, repo, path }
    }
  }
  
  // Fallback to old format or defaults
  return {
    user: urlParams.get('user') || 'MeteorDevelopment',
    repo: urlParams.get('repo') || 'meteor-client', 
    path: urlParams.get('path') || 'src/main/java/meteordevelopment/meteorclient/systems/modules/combat'
  }
}

const urlParams = getUrlParams()

// Reactive data
const guiRef = ref(null)
const headerRef = ref(null)
const modules = ref([])
const isCollapsed = ref(false)
const position = ref({ x: 0, y: 0 })
const isDragging = ref(false)
const dragOffset = ref({ x: 0, y: 0 })
const maxHeight = ref(400)

// Computed
const repoName = computed(() => urlParams.repo)

// Methods
const fetchModules = async () => {
  try {
    const response = await fetch(`https://api.github.com/repos/${urlParams.user}/${urlParams.repo}/contents/${urlParams.path}`)
    const data = await response.json()
    
    modules.value = data.map(item => ({
      name: item.name,
      displayName: item.name.replace('.java', ''),
      active: false
    }))
  } catch (error) {
    console.error('Error fetching modules:', error)
    // Fallback data for demo
    modules.value = [
      { name: 'ExampleModule.java', displayName: 'ExampleModule', active: false },
      { name: 'AnotherModule.java', displayName: 'AnotherModule', active: false },
      { name: 'TestModule.java', displayName: 'TestModule', active: false }
    ]
  }
}

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

const toggleModule = (module) => {
  module.active = !module.active
}

const centerGui = () => {
  if (guiRef.value) {
    const rect = guiRef.value.getBoundingClientRect()
    position.value = {
      x: (window.innerWidth / 2) - (rect.width / 2),
      y: 10 // 10px from top
    }
  }
}

const updateMaxHeight = () => {
  maxHeight.value = window.innerHeight - 100
}

// Drag functionality
const startDrag = (event) => {
  isDragging.value = true
  const rect = guiRef.value.getBoundingClientRect()
  dragOffset.value = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  }
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

const onDrag = (event) => {
  if (!isDragging.value) return
  
  position.value = {
    x: event.clientX - dragOffset.value.x,
    y: event.clientY - dragOffset.value.y
  }
}

const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

// Lifecycle
onMounted(async () => {
  await fetchModules()
  await nextTick()
  centerGui()
  updateMaxHeight()
  window.addEventListener('resize', () => {
    updateMaxHeight()
    centerGui()
  })
})
</script>