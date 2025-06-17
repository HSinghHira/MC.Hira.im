<template>
  <div class="fixed inset-0 overflow-hidden font-['courier']">
    
    <div class="absolute inset-0 bg-cover bg-no-repeat bg-center" style="background-image: url('/data/assets/meteoraddonbg.png')"></div>
    
    
    <div
      v-for="(category, index) in categories"
      :key="category.name"
      ref="guiRefs"
      class="absolute w-fit min-w-[200px] select-none"
      :style="{ 
        left: category.position.x + 'px', 
        top: category.position.y + 'px',
        zIndex: category.zIndex
      }"
      @mousedown="bringToFront(category)"
    >
      
      <div
        class="flex justify-between items-center bg-purple-600 px-2 py-1.5 font-bold text-white text-lg cursor-move"
        @mousedown="startDrag($event, category)"
      >
        <span>{{ category.displayName }}</span>
        <button
          class="bg-transparent opacity-50 hover:opacity-75 ml-2 border-none text-white transition-transform duration-500 cursor-pointer"
          :class="{ '-rotate-90': category.collapsed }"
          @click="toggleCollapse(category)"
        >
          <svg class="fill-current w-5 h-5" viewBox="0 0 24 24">
            <path d="M7 10l5 5 5-5z"/>
          </svg>
        </button>
      </div>

      
      <div
        class="bg-black bg-opacity-80 overflow-auto transition-all duration-500 ease-out"
        :class="{ 'max-h-0': category.collapsed }"
        :style="{ maxHeight: category.collapsed ? '0px' : maxHeight + 'px' }"
      >
        <div
          v-for="module in category.modules"
          :key="module.name"
          class="bg-[length:200%_100%] bg-gradient-to-l from-transparent via-transparent to-gray-600 bg-right hover:bg-left px-2 py-1.5 text-white text-base transition-all duration-500 ease-out cursor-pointer"
          :class="{
            'bg-gray-600 border-l-4 border-purple-600 !bg-none': module.active
          }"
          @click="toggleModule(module)"
        >
          {{ module.displayName }}
        </div>
        
        
        <div v-if="category.modules.length === 0" class="px-2 py-1.5 text-gray-400 text-sm italic">
          No modules found
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
    
    const fullPath = keys[0]
    const parts = fullPath.split('/')
    
    if (parts.length >= 4 && parts[2] === 'tree') {
      const user = parts[0]
      const repo = parts[1]
      const branch = parts[3] // 'master' or other branch
      const path = parts.slice(4).join('/') // everything after branch
      
      return { user, repo, path, branch }
    }
  }
  
  // Fallback to old format or defaults
  return {
    user: urlParams.get('user') || 'MeteorDevelopment',
    repo: urlParams.get('repo') || 'meteor-client', 
    path: urlParams.get('path') || 'src/main/java/meteordevelopment/meteorclient/systems/modules/combat',
    branch: 'master'
  }
}

const urlParams = getUrlParams()

// Reactive data
const guiRefs = ref([])
const categories = ref([])
const isDragging = ref(false)
const dragOffset = ref({ x: 0, y: 0 })
const dragTarget = ref(null)
const maxHeight = ref(400)
const maxZIndex = ref(1000)

// Computed
const repoName = computed(() => urlParams.repo)

// Methods
const extractCategories = async () => {
  try {
    // Try to find the main addon class file
    const possibleMainFiles = [
      `${urlParams.repo}.java`,
      `${urlParams.repo.charAt(0).toUpperCase() + urlParams.repo.slice(1)}.java`,
      'Addon.java',
      // For Trouser-Streak specifically
      'Trouser.java'
    ]
    
    let mainFileContent = null
    let categoryVariableMap = new Map() // Map variable names to category info
    
    // Get the addon root directory
    const addonRoot = urlParams.path.split('/').slice(0, -1).join('/')
    
    for (const fileName of possibleMainFiles) {
      try {
        const response = await fetch(`https://api.github.com/repos/${urlParams.user}/${urlParams.repo}/contents/${addonRoot}/${fileName}`)
        if (response.ok) {
          const data = await response.json()
          mainFileContent = atob(data.content)
          break
        }
      } catch (e) {
        // Continue to next file
      }
    }
    
    const extractedCategories = []
    
    if (mainFileContent) {
      // Extract category definitions and create variable mapping
      // Pattern: public static final Category variableName = new Category("DisplayName", ...)
      const categoryRegex = /public\s+static\s+final\s+Category\s+(\w+)\s*=\s*new\s+Category\s*\(\s*"([^"]+)"/g
      let match
      
      while ((match = categoryRegex.exec(mainFileContent)) !== null) {
        const variableName = match[1] // e.g., "Main"
        const displayName = match[2] // e.g., "TrouserStreak"
        
        categoryVariableMap.set(variableName, displayName)
        
        extractedCategories.push({
          name: variableName,
          displayName: displayName,
          modules: [],
          collapsed: false,
          position: { x: 50, y: 50 },
          zIndex: 1000
        })
      }
    }
    
    // If no categories found, create default ones
    if (extractedCategories.length === 0) {
      extractedCategories.push({
        name: 'Main',
        displayName: 'Main',
        modules: [],
        collapsed: false,
        position: { x: 50, y: 50 },
        zIndex: 1000
      })
    }
    
    return { categories: extractedCategories, categoryMap: categoryVariableMap }
  } catch (error) {
    console.error('Error extracting categories:', error)
    // Return default categories
    return {
      categories: [{
        name: 'Main',
        displayName: 'Main',
        modules: [],
        collapsed: false,
        position: { x: 50, y: 50 },
        zIndex: 1000
      }],
      categoryMap: new Map([['Main', 'Main']])
    }
  }
}

const determineModuleCategory = (moduleContent, categoryMap, moduleName) => {
  try {
    console.log(`\n=== Analyzing ${moduleName} ===`)
    console.log('Available categories:', [...categoryMap.keys()])
    
    const constructorPatterns = [
      // Pattern 1: super(ClassName.CategoryVar, ...)
      /super\s*\(\s*\w+\.(\w+)\s*,/g,
      // Pattern 2: super(CategoryVar, ...)
      /super\s*\(\s*(\w+)\s*,/g,
      // Pattern 3: More flexible super pattern
      /super\s*\(\s*([^,\s]+)\s*,/g
    ]
    
    for (let i = 0; i < constructorPatterns.length; i++) {
      const pattern = constructorPatterns[i]
      const matches = [...moduleContent.matchAll(pattern)]
      
      console.log(`Pattern ${i + 1} matches:`, matches.map(m => m[1]))
      
      for (const match of matches) {
        let categoryVar = match[1]
        
        // If it contains a dot, get the part after the dot
        if (categoryVar.includes('.')) {
          categoryVar = categoryVar.split('.').pop()
        }
        
        console.log(`Checking category variable: "${categoryVar}"`)
        
        // Check if this category variable exists in our map
        if (categoryMap.has(categoryVar)) {
          console.log(`✓ Found exact match: ${categoryVar}`)
          return categoryVar
        }
        
        // Also check direct matches (case-insensitive)
        for (const [key, value] of categoryMap.entries()) {
          if (key.toLowerCase() === categoryVar.toLowerCase()) {
            console.log(`✓ Found case-insensitive match: ${key}`)
            return key
          }
        }
      }
    }
    
    console.log(`✗ No category found for ${moduleName}`)
    return null // No category found
  } catch (error) {
    console.error('Error determining module category:', error)
    return null
  }
}

const fetchModules = async () => {
  try {
    // First extract categories and category mapping
    const { categories: extractedCategories, categoryMap } = await extractCategories()
    categories.value = extractedCategories
    
    console.log('Extracted categories:', extractedCategories)
    console.log('Category mapping:', categoryMap)
    
    // Fetch modules from the directory
    const response = await fetch(`https://api.github.com/repos/${urlParams.user}/${urlParams.repo}/contents/${urlParams.path}`)
    const data = await response.json()
    
    const moduleFiles = data.filter(item => item.name.endsWith('.java'))
    console.log('Found module files:', moduleFiles.map(f => f.name))
    
    // Process each module file
    for (const moduleFile of moduleFiles) {
      try {
        // Fetch module content to determine category
        const moduleResponse = await fetch(moduleFile.download_url)
        const moduleContent = await moduleResponse.text()
        
        const module = {
          name: moduleFile.name,
          displayName: moduleFile.name.replace('.java', ''),
          active: false
        }
        
        // Determine which category this module belongs to
        const categoryVar = determineModuleCategory(moduleContent, categoryMap, moduleFile.name)
        console.log(`Module ${moduleFile.name} -> Category: ${categoryVar}`)
        
        if (categoryVar) {
          // Find the category and add the module
          const category = categories.value.find(cat => cat.name === categoryVar)
          if (category) {
            category.modules.push(module)
            console.log(`✓ Added ${module.displayName} to category "${category.displayName}"`)
          } else {
            console.log(`✗ Category "${categoryVar}" not found in available categories`)
            // Add to first category as fallback
            if (categories.value.length > 0) {
              categories.value[0].modules.push(module)
              console.log(`✓ Added ${module.displayName} to fallback category "${categories.value[0].displayName}"`)
            }
          }
        } else {
          console.log(`✗ Could not categorize module: ${moduleFile.name}`)
          // Add to first category as fallback
          if (categories.value.length > 0) {
            categories.value[0].modules.push(module)
            console.log(`✓ Added ${module.displayName} to fallback category "${categories.value[0].displayName}"`)
          }
        }
        
      } catch (error) {
        console.error(`Error processing module ${moduleFile.name}:`, error)
      }
    }
    
    // Position categories with smart layout
    await nextTick() // Ensure DOM is ready
    positionCategories()
    
    console.log('Final categories with modules:', categories.value)
    
  } catch (error) {
    console.error('Error fetching modules:', error)
    // Fallback data for demo
    categories.value = [
      {
        name: 'Main',
        displayName: 'TrouserStreak',
        modules: [
          { name: 'AnHero.java', displayName: 'AnHero', active: false }
        ],
        collapsed: false,
        position: { x: 50, y: 50 },
        zIndex: 1000
      }
    ]
  }
}

const toggleCollapse = (category) => {
  category.collapsed = !category.collapsed
}

const toggleModule = (module) => {
  module.active = !module.active
}

const bringToFront = (category) => {
  maxZIndex.value += 1
  category.zIndex = maxZIndex.value
}

const positionCategories = () => {
  if (categories.value.length === 0) return
  
  const windowWidth = window.innerWidth
  const guiWidth = 280 // Increased estimated width of each GUI
  const topOffset = 20 // 20px from top
  const horizontalGap = 50 // Increased gap between GUIs
  
  if (categories.value.length === 1) {
    // Single GUI: center horizontally, 20px from top
    categories.value[0].position = {
      x: (windowWidth / 2) - (guiWidth / 2),
      y: topOffset
    }
    categories.value[0].zIndex = 1000
  } else {
    // Multiple GUIs: arrange them horizontally centered, 20px from top
    const totalWidth = categories.value.length * guiWidth + (categories.value.length - 1) * horizontalGap
    const startX = (windowWidth / 2) - (totalWidth / 2)
    
    categories.value.forEach((category, index) => {
      category.position = {
        x: startX + (index * (guiWidth + horizontalGap)), // Increased gap between GUIs
        y: topOffset
      }
      category.zIndex = 1000 + index
    })
  }
}

const updateMaxHeight = () => {
  maxHeight.value = window.innerHeight - 200
}

// Drag functionality
const startDrag = (event, category) => {
  event.stopPropagation()
  isDragging.value = true
  dragTarget.value = category
  
  const rect = event.currentTarget.parentElement.getBoundingClientRect()
  dragOffset.value = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  }
  
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
  
  // Bring to front when starting drag
  bringToFront(category)
}

const onDrag = (event) => {
  if (!isDragging.value || !dragTarget.value) return
  
  dragTarget.value.position = {
    x: event.clientX - dragOffset.value.x,
    y: event.clientY - dragOffset.value.y
  }
}

const stopDrag = () => {
  isDragging.value = false
  dragTarget.value = null
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

// Lifecycle
onMounted(async () => {
  await fetchModules()
  await nextTick()
  updateMaxHeight()
  window.addEventListener('resize', () => {
    updateMaxHeight()
    positionCategories() // Reposition on window resize
  })
})
</script>