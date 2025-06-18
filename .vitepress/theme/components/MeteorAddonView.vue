<template>
  <div class="fixed inset-0 min-h-screen overflow-hidden font-['courier']">
    <!-- Background image -->
    <div
      class="z-0 absolute inset-0 bg-cover bg-no-repeat bg-center"
      style="background-image: url('/data/assets/meteoraddonbg.png')"
    ></div>

    <!-- Floating draggable category panels -->
    <div
      v-for="(category, index) in categories"
      :key="category.name"
      ref="guiRefs"
      class="z-10 absolute w-fit min-w-[200px] select-none"
      :style="{
        left: category.position.x + 'px',
        top: category.position.y + 'px',
        zIndex: category.zIndex,
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
            <path d="M7 10l5 5 5-5z" />
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
            'bg-gray-600 border-l-4 border-purple-600 !bg-none': module.active,
          }"
          @click="toggleModule(module)"
        >
          {{ module.displayName }}
        </div>
        <div
          v-if="category.modules.length === 0"
          class="px-2 py-1.5 text-gray-400 text-sm italic"
        >
          No modules found
        </div>
      </div>
    </div>

    <!-- Loading overlay -->
    <div v-if="isLoading" class="z-50 absolute inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div class="bg-purple-600 px-6 py-4 rounded-lg text-white">
        <div class="flex items-center space-x-3">
          <div class="border-white border-b-2 rounded-full w-6 h-6 animate-spin"></div>
          <div>
            <div class="font-bold">{{ loadingMessage }}</div>
            <div class="opacity-75 text-sm">{{ loadingProgress }}</div>
            <div v-if="rateLimitWarning" class="mt-1 text-yellow-300 text-xs">
              ⚠️ {{ rateLimitWarning }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Rate limit warning -->
    <div v-if="showRateLimit" class="top-4 right-4 z-40 absolute bg-red-600 px-4 py-2 rounded-lg text-white">
      <div class="font-bold">API Rate Limited</div>
      <div class="text-sm">Waiting for rate limit reset...</div>
      <div class="mt-1 text-xs">{{ rateLimitMessage }}</div>
    </div>

    <!-- GitHub token input -->
    <div
      v-if="showTokenPrompt"
      class="top-6 left-1/2 z-50 fixed bg-gradient-to-br from-purple-700 to-purple-500 shadow-2xl px-8 py-6 border border-purple-300 rounded-2xl w-full max-w-md text-white -translate-x-1/2 transform"
    >
      <div class="flex items-center mb-4">
        <div class="font-extrabold text-lg">Add GitHub Token for Higher Limits</div>
      </div>
      <div class="mb-5 text-purple-100 text-sm">
        You have exceeded the GitHub API rate limit for unauthenticated requests. To continue using this addon, please provide a Personal Access Token (classic).
      </div>
      <div class="mb-5 text-purple-100 text-sm">
        For your security, use a second (Not so useful) GitHub account. Treat your access token like a password. I am not storing it in anyway on my end. However, this website will store in your browser's local storage and your PC may have malware that can read it. And, I am not responsible for that.
      </div>
      <div class="flex items-center mb-3">
        <input
          v-model="tokenInput"
          type="password"
          placeholder="GitHub Personal Access Token"
          id="tokenInput" 
          @keyup.enter="saveToken"
          autocomplete="off"
          class="flex-1 bg-gray-800 px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white transition duration-200"

        >
        <button
          @click="saveToken"
          class="flex items-center px-4 py-2 rounded-lg font-semibold text-white transition"
          type="button"
        >
          <i class="mr-2 pi pi-save"></i> Save
        </button>
      </div>
      <div class="flex items-center text-yellow-200 text-xs italic">
        <i class="mr-2 pi pi-info-circle"></i>
        Never share your token. <a href="https://github.com/settings/tokens" target="_blank" class="ml-1 hover:text-white underline">Create a new token</a>
      </div>
    </div>

    <!-- Error display -->
    <div v-if="errorMessage" class="top-20 right-4 z-40 absolute bg-red-800 px-4 py-2 rounded-lg max-w-md text-white">
      <div class="font-bold">Error</div>
      <div class="text-sm">{{ errorMessage }}</div>
      <button @click="errorMessage = ''" class="bg-gray-600 mt-2 px-2 py-1 rounded text-xs">Dismiss</button>
    </div>

    <!-- Statistics Panel -->
<div class="right-4 bottom-4 z-40 absolute bg-gray-800 bg-opacity-90 px-4 py-2 rounded-lg text-white text-sm">
  <div class="flex space-x-4">
    <div>Repository: {{ urlParams.user }}/{{ urlParams.repo }}</div>
    <div>Total: {{ totalItems }}</div>
    <div>API Remaining: {{ apiCallsRemaining }}</div>
    <div v-if="showRateLimit" class="text-yellow-300">
      Available at: {{ rateLimitMessage }}
    </div>
  </div>
</div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from "vue";

// --- UI State ---
const isLoading = ref(false);
const loadingMessage = ref('Loading...');
const loadingProgress = ref('');
const rateLimitWarning = ref('');
const showRateLimit = ref(false);
const rateLimitMessage = ref('');
const showTokenPrompt = ref(false);
const tokenInput = ref('');
const errorMessage = ref('');
const totalItems = ref(0);
const apiCallsRemaining = ref(0);

// --- URL Params ---
const getUrlParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const keys = [...urlParams.keys()];
  if (keys.length > 0) {
    const fullPath = keys[0];
    const parts = fullPath.split("/");
    if (parts.length >= 4 && parts[2] === "tree") {
      const user = parts[0];
      const repo = parts[1];
      const branch = parts[3];
      const path = parts.slice(4).join("/");
      return { user, repo, path, branch };
    }
  }
  return {
    user: urlParams.get("user") || "MeteorDevelopment",
    repo: urlParams.get("repo") || "meteor-client",
    path: urlParams.get("path") ||
      "src/main/java/meteordevelopment/meteorclient/systems/modules/combat",
    branch: "master",
  };
};
const urlParams = getUrlParams();

// --- Floating Panels Data ---
const guiRefs = ref([]);
const categories = ref([]);
const isDragging = ref(false);
const dragOffset = ref({ x: 0, y: 0 });
const dragTarget = ref(null);
const maxHeight = ref(400);
const maxZIndex = ref(1000);



// --- Methods for Floating Panels ---
const toggleCollapse = (category) => {
  category.collapsed = !category.collapsed;
};
const toggleModule = (module) => {
  module.active = !module.active;
};
const bringToFront = (category) => {
  maxZIndex.value += 1;
  category.zIndex = maxZIndex.value;
};
const positionCategories = () => {
  if (categories.value.length === 0) return;
  const windowWidth = window.innerWidth;
  const guiWidth = 280;
  const topOffset = 20;
  const horizontalGap = 50;
  if (categories.value.length === 1) {
    categories.value[0].position = {
      x: windowWidth / 2 - guiWidth / 2,
      y: topOffset,
    };
    categories.value[0].zIndex = 1000;
  } else {
    const totalWidth =
      categories.value.length * guiWidth +
      (categories.value.length - 1) * horizontalGap;
    const startX = windowWidth / 2 - totalWidth / 2;
    categories.value.forEach((category, index) => {
      category.position = {
        x: startX + index * (guiWidth + horizontalGap),
        y: topOffset,
      };
      category.zIndex = 1000 + index;
    });
  }
};

const updateMaxHeight = () => {
  maxHeight.value = window.innerHeight - 200;
};
// Drag functionality
const startDrag = (event, category) => {
  event.stopPropagation();
  isDragging.value = true;
  dragTarget.value = category;
  const rect = event.currentTarget.parentElement.getBoundingClientRect();
  dragOffset.value = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
  document.addEventListener("mousemove", onDrag);
  document.addEventListener("mouseup", stopDrag);
  bringToFront(category);
};
const onDrag = (event) => {
  if (!isDragging.value || !dragTarget.value) return;
  dragTarget.value.position = {
    x: event.clientX - dragOffset.value.x,
    y: event.clientY - dragOffset.value.y,
  };
};
const stopDrag = () => {
  isDragging.value = false;
  dragTarget.value = null;
  document.removeEventListener("mousemove", onDrag);
  document.removeEventListener("mouseup", stopDrag);
};

// --- GitHub API and Token Logic ---
function saveToken() {
  if (tokenInput.value.trim()) {
    localStorage.setItem('github_token', tokenInput.value.trim());
    showTokenPrompt.value = false;
    tokenInput.value = '';
    fetchModules();
  }
}



// --- Improved Category and Module Extraction ---
const extractCategories = async () => {
  try {
    const possibleMainFiles = [
      `${urlParams.repo}.java`,
      `${urlParams.repo.charAt(0).toUpperCase() + urlParams.repo.slice(1)}.java`,
      "Addon.java",
      "TrouserStreak.java", // Added specific file for your repo
      "Main.java",
      "Client.java",
    ];
    
    let mainFileContent = null;
    let categoryVariableMap = new Map();
    
    // Try to find the main addon file
    const addonRoot = urlParams.path.split("/").slice(0, -1).join("/");
    console.log('Looking for main files in:', addonRoot);
    
    for (const fileName of possibleMainFiles) {
      try {
        const fileUrl = `https://api.github.com/repos/${urlParams.user}/${urlParams.repo}/contents/${addonRoot}/${fileName}`;
        console.log('Trying to fetch:', fileUrl);
        
        const response = await fetch(fileUrl, getAuthHeader());
        
        if (response.ok) {
          const data = await response.json();
          mainFileContent = atob(data.content);
          console.log(`Found main file: ${fileName}`);
          console.log('Main file content preview:', mainFileContent.substring(0, 500));
          break;
        }
      } catch (e) {
        console.log(`Failed to fetch ${fileName}:`, e.message);
      }
    }

    const extractedCategories = [];
    
    if (mainFileContent) {
      // Multiple patterns to match category definitions
      const categoryPatterns = [
        // Pattern 1: public static final Category CATEGORY_NAME = new Category("Display Name")
        /public\s+static\s+final\s+Category\s+(\w+)\s*=\s*new\s+Category\s*\(\s*"([^"]+)"/g,
        // Pattern 2: public static Category CATEGORY_NAME = new Category("Display Name")
        /public\s+static\s+Category\s+(\w+)\s*=\s*new\s+Category\s*\(\s*"([^"]+)"/g,
        // Pattern 3: Category CATEGORY_NAME = new Category("Display Name")
        /Category\s+(\w+)\s*=\s*new\s+Category\s*\(\s*"([^"]+)"/g,
        // Pattern 4: Categories.register("Display Name", CATEGORY_VAR)
        /Categories\.register\s*\(\s*"([^"]+)"\s*,\s*(\w+)\s*\)/g,
      ];

      for (const pattern of categoryPatterns) {
        let match;
        pattern.lastIndex = 0; // Reset regex
        
        while ((match = pattern.exec(mainFileContent)) !== null) {
          let variableName, displayName;
          
          if (pattern.source.includes('Categories\\.register')) {
            // For Categories.register pattern, order is reversed
            displayName = match[1];
            variableName = match[2];
          } else {
            variableName = match[1];
            displayName = match[2];
          }
          
          console.log(`Found category: ${variableName} -> ${displayName}`);
          
          categoryVariableMap.set(variableName, displayName);
          categoryVariableMap.set(variableName.toLowerCase(), displayName);
          
          // Check if category already exists
          const existingCategory = extractedCategories.find(cat => cat.name === variableName);
          if (!existingCategory) {
            extractedCategories.push({
              name: variableName,
              displayName: displayName,
              modules: [],
              collapsed: false,
              position: { x: 50, y: 50 },
              zIndex: 1000,
            });
          }
        }
      }
    }

    // If no categories found, create some common default categories
    if (extractedCategories.length === 0) {
      console.log('No categories found in main file, creating defaults');
      
      const defaultCategories = [
        { name: 'COMBAT', displayName: 'Combat' },
        { name: 'MOVEMENT', displayName: 'Movement' },
        { name: 'RENDER', displayName: 'Render' },
        { name: 'PLAYER', displayName: 'Player' },
        { name: 'WORLD', displayName: 'World' },
        { name: 'MISC', displayName: 'Misc' },
        { name: 'MAIN', displayName: 'Main' },
      ];
      
      for (const cat of defaultCategories) {
        extractedCategories.push({
          name: cat.name,
          displayName: cat.displayName,
          modules: [],
          collapsed: false,
          position: { x: 50, y: 50 },
          zIndex: 1000,
        });
        categoryVariableMap.set(cat.name, cat.displayName);
        categoryVariableMap.set(cat.name.toLowerCase(), cat.displayName);
      }
    }

    console.log('Final categories:', extractedCategories);
    console.log('Category variable map:', categoryVariableMap);

    return {
      categories: extractedCategories,
      categoryMap: categoryVariableMap,
    };
  } catch (error) {
    console.error('Error in extractCategories:', error);
    return {
      categories: [
        {
          name: "MAIN",
          displayName: "Main",
          modules: [],
          collapsed: false,
          position: { x: 50, y: 50 },
          zIndex: 1000,
        },
      ],
      categoryMap: new Map([["MAIN", "Main"], ["main", "Main"]]),
    };
  }
};

const determineModuleCategory = (moduleContent, categoryMap, moduleName) => {
  console.log(`\n--- Analyzing module: ${moduleName} ---`);
  console.log('Available categories:', Array.from(categoryMap.keys()));
  
  // Multiple patterns to find category references in modules
  const categoryPatterns = [
    // Pattern 1: super(CategoryClass.CATEGORY_NAME, ...)
    /super\s*\(\s*\w+\.(\w+)\s*,/g,
    // Pattern 2: super(CATEGORY_NAME, ...)
    /super\s*\(\s*([A-Z_]+)\s*,/g,
    // Pattern 3: super("module name", "description", CATEGORY_NAME, ...)
    /super\s*\(\s*"[^"]*"\s*,\s*"[^"]*"\s*,\s*(\w+)/g,
    // Pattern 4: super("module name", CATEGORY_NAME, ...)
    /super\s*\(\s*"[^"]*"\s*,\s*(\w+)/g,
    // Pattern 5: Category.CATEGORY_NAME
    /Category\.(\w+)/g,
    // Pattern 6: @RegisterModule(category = CATEGORY_NAME)
    /@RegisterModule\s*\([^)]*category\s*=\s*(\w+)/g,
    // Pattern 7: this.category = CATEGORY_NAME
    /this\.category\s*=\s*(\w+)/g,
  ];

  for (let i = 0; i < categoryPatterns.length; i++) {
    const pattern = categoryPatterns[i];
    pattern.lastIndex = 0; // Reset regex
    
    console.log(`Trying pattern ${i + 1}: ${pattern.source}`);
    
    const matches = [...moduleContent.matchAll(pattern)];
    console.log(`Found ${matches.length} matches`);
    
    for (const match of matches) {
      let categoryVar = match[1];
      console.log(`Raw match: "${categoryVar}"`);
      
      // Clean up the category variable
      if (categoryVar.includes(".")) {
        categoryVar = categoryVar.split(".").pop();
      }
      
      console.log(`Cleaned category var: "${categoryVar}"`);
      
      // Try exact match first
      if (categoryMap.has(categoryVar)) {
        console.log(`✓ Found exact match: ${categoryVar}`);
        return categoryVar;
      }
      
      // Try case-insensitive match
      const lowerCategoryVar = categoryVar.toLowerCase();
      if (categoryMap.has(lowerCategoryVar)) {
        console.log(`✓ Found case-insensitive match: ${lowerCategoryVar}`);
        return Array.from(categoryMap.keys()).find(key => key.toLowerCase() === lowerCategoryVar);
      }
      
      // Try partial matches
      for (const [key] of categoryMap.entries()) {
        if (key.toLowerCase().includes(lowerCategoryVar) || lowerCategoryVar.includes(key.toLowerCase())) {
          console.log(`✓ Found partial match: ${key} (from ${categoryVar})`);
          return key;
        }
      }
    }
  }
  
  // Try to guess category based on module name
  const moduleNameLower = moduleName.toLowerCase();
  const categoryGuesses = [
    { keywords: ['combat', 'attack', 'kill', 'fight', 'pvp', 'war'], category: 'COMBAT' },
    { keywords: ['move', 'speed', 'fly', 'jump', 'walk', 'run', 'step'], category: 'MOVEMENT' },
    { keywords: ['render', 'esp', 'visual', 'display', 'show', 'hud'], category: 'RENDER' },
    { keywords: ['player', 'inv', 'inventory', 'hand', 'armor'], category: 'PLAYER' },
    { keywords: ['world', 'block', 'place', 'break', 'mine'], category: 'WORLD' },
    { keywords: ['misc', 'util', 'helper', 'auto', 'anti'], category: 'MISC' },
  ];
  
  for (const guess of categoryGuesses) {
    if (guess.keywords.some(keyword => moduleNameLower.includes(keyword))) {
      if (categoryMap.has(guess.category)) {
        console.log(`✓ Guessed category based on name: ${guess.category}`);
        return guess.category;
      }
    }
  }
  
  console.log('✗ No category found, will use first available');
  return null;
};

function getAuthHeader() {
  const token = localStorage.getItem('github_token');
  return token ? { headers: { Authorization: `token ${token}` } } : {};
}

async function fetchModules() {
  isLoading.value = true;
  loadingMessage.value = 'Fetching repository data...';
  showRateLimit.value = false;
  rateLimitWarning.value = '';
  errorMessage.value = '';
  
  try {
    // Check repo API for stats and rate limit
    const repoRes = await fetch(
      `https://api.github.com/repos/${urlParams.user}/${urlParams.repo}`,
      getAuthHeader()
    );
    
    apiCallsRemaining.value = repoRes.headers.get('x-ratelimit-remaining') || 0;
    
    if (repoRes.status === 403) {
      const resetTime = repoRes.headers.get('x-ratelimit-reset');
      const resetDate = resetTime ? new Date(resetTime * 1000) : null;
      showRateLimit.value = true;
      rateLimitMessage.value = resetDate 
        ? `Rate limit resets at ${resetDate.toLocaleTimeString()}`
        : 'You have exceeded your API rate limit.';
      
      if (!localStorage.getItem('github_token')) {
        showTokenPrompt.value = true;
        return;
      }
      throw new Error('Rate limit exceeded');
    }

    if (!repoRes.ok) {
      throw new Error(`Failed to fetch repository info: ${repoRes.status} ${repoRes.statusText}`);
    }

    const repoData = await repoRes.json();
    totalItems.value = repoData.stargazers_count || 0;

    // Extract categories and modules
    const { categories: extractedCategories, categoryMap } = await extractCategories();
    categories.value = extractedCategories;

    // Fetch modules from directory - Fix the API endpoint
    const contentsUrl = `https://api.github.com/repos/${urlParams.user}/${urlParams.repo}/contents/${urlParams.path}`;
    console.log('Fetching from URL:', contentsUrl); // Debug log
    
    const response = await fetch(contentsUrl, getAuthHeader());
    
    apiCallsRemaining.value = response.headers.get('x-ratelimit-remaining') || 0;
    
    if (response.status === 403) {
      const resetTime = response.headers.get('x-ratelimit-reset');
      const resetDate = resetTime ? new Date(resetTime * 1000) : null;
      showRateLimit.value = true;
      rateLimitMessage.value = resetDate 
        ? `Rate limit resets at ${resetDate.toLocaleTimeString()}`
        : 'You have exceeded your API rate limit.';
      
      if (!localStorage.getItem('github_token')) {
        showTokenPrompt.value = true;
        return;
      }
      throw new Error('Rate limit exceeded');
    }

    if (response.status === 404) {
      throw new Error(`Directory not found: ${urlParams.path}`);
    }

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('API Response:', data); // Debug log
    
    // Check if data is an array (directory contents) or an object (single file/error)
    if (!Array.isArray(data)) {
      if (data.message) {
        throw new Error(`GitHub API: ${data.message}`);
      }
      if (data.type === 'file') {
        throw new Error('The specified path points to a file, not a directory');
      }
      throw new Error('Unexpected response format from GitHub API');
    }
    
    // Filter for Java files
    const moduleFiles = data.filter((item) => {
      return item.type === 'file' && item.name.endsWith('.java');
    });
    
    totalItems.value = moduleFiles.length;

    loadingMessage.value = 'Processing modules...';
    loadingProgress.value = `0 / ${moduleFiles.length}`;

 // Updated module processing section for fetchModules function
// Replace the module processing loop in your fetchModules function with this:

// Process each module file
for (let i = 0; i < moduleFiles.length; i++) {
  const moduleFile = moduleFiles[i];
  
  try {
    loadingProgress.value = `${i + 1} / ${moduleFiles.length}`;
    
    // Use the download_url to get the raw file content
    const moduleResponse = await fetch(moduleFile.download_url);
    
    if (!moduleResponse.ok) {
      console.warn(`Failed to fetch ${moduleFile.name}: ${moduleResponse.status}`);
      continue;
    }
    
    const moduleContent = await moduleResponse.text();
    
    const module = {
      name: moduleFile.name,
      displayName: moduleFile.name.replace('.java', ''),
      active: false,
    };

    // Determine which category this module belongs to
    const categoryVar = determineModuleCategory(
      moduleContent,
      categoryMap,
      moduleFile.name
    );

    let targetCategory = null;
    
    if (categoryVar) {
      // Find the category by variable name
      targetCategory = categories.value.find((cat) => cat.name === categoryVar);
      
      if (!targetCategory) {
        // Try case-insensitive search
        targetCategory = categories.value.find((cat) => 
          cat.name.toLowerCase() === categoryVar.toLowerCase()
        );
      }
    }
    
    // If no specific category found, try to auto-categorize based on module name
    if (!targetCategory) {
      const moduleNameLower = moduleFile.name.toLowerCase();
      
      // Auto-categorization based on common patterns
      if (moduleNameLower.includes('combat') || moduleNameLower.includes('kill') || 
          moduleNameLower.includes('attack') || moduleNameLower.includes('pvp')) {
        targetCategory = categories.value.find(cat => 
          cat.name.toLowerCase().includes('combat') || cat.displayName.toLowerCase().includes('combat')
        );
      } else if (moduleNameLower.includes('move') || moduleNameLower.includes('speed') || 
                 moduleNameLower.includes('fly') || moduleNameLower.includes('jump')) {
        targetCategory = categories.value.find(cat => 
          cat.name.toLowerCase().includes('movement') || cat.displayName.toLowerCase().includes('movement')
        );
      } else if (moduleNameLower.includes('render') || moduleNameLower.includes('esp') || 
                 moduleNameLower.includes('visual') || moduleNameLower.includes('hud')) {
        targetCategory = categories.value.find(cat => 
          cat.name.toLowerCase().includes('render') || cat.displayName.toLowerCase().includes('render')
        );
      } else if (moduleNameLower.includes('player') || moduleNameLower.includes('inv')) {
        targetCategory = categories.value.find(cat => 
          cat.name.toLowerCase().includes('player') || cat.displayName.toLowerCase().includes('player')
        );
      } else if (moduleNameLower.includes('world') || moduleNameLower.includes('block')) {
        targetCategory = categories.value.find(cat => 
          cat.name.toLowerCase().includes('world') || cat.displayName.toLowerCase().includes('world')
        );
      }
    }
    
    // If still no category found, use the first available category
    if (!targetCategory && categories.value.length > 0) {
      targetCategory = categories.value[0];
    }
    
    // Add the module to the determined category
    if (targetCategory) {
      targetCategory.modules.push(module);
      console.log(`✓ Added ${module.displayName} to category: ${targetCategory.displayName}`);
    } else {
      console.warn(`✗ Could not categorize module: ${module.displayName}`);
    }
    
    // Small delay to avoid overwhelming the API
    if (i < moduleFiles.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
  } catch (error) {
    console.warn(`Error processing ${moduleFile.name}:`, error);
    // Continue with other files even if one fails
  }
}

// After processing all modules, log the final distribution
console.log('\n=== Final Category Distribution ===');
categories.value.forEach(category => {
  console.log(`${category.displayName}: ${category.modules.length} modules`);
  if (category.modules.length > 0) {
    console.log(`  Modules: ${category.modules.map(m => m.displayName).join(', ')}`);
  }
});

// Remove empty categories (optional)
categories.value = categories.value.filter(category => category.modules.length > 0);

await nextTick();
positionCategories();
    
  } catch (err) {
    console.error('fetchModules error:', err);
    errorMessage.value = err.message;
    
    // Create fallback category with error info
    categories.value = [
      {
        name: 'Error',
        displayName: 'Error Loading Modules',
        modules: [
          { 
            name: 'error', 
            displayName: err.message.length > 50 ? err.message.substring(0, 50) + '...' : err.message, 
            active: false 
          },
        ],
        collapsed: false,
        position: { x: 50, y: 50 },
        zIndex: 1000,
      },
    ];
    
    await nextTick();
    positionCategories();
    
  } finally {
    isLoading.value = false;
    loadingMessage.value = '';
    loadingProgress.value = '';
  }
}

// --- Lifecycle ---
onMounted(async () => {
  const token = localStorage.getItem('github_token');
  if (!token) {
    showTokenPrompt.value = true;
  } else {
    await fetchModules();
  }
  await nextTick();
  updateMaxHeight();
  window.addEventListener("resize", () => {
    updateMaxHeight();
    positionCategories();
  });
});
</script>

<style scoped>
/* Customize styles here if needed */
#tokenInput {
padding-top: 0.5rem!important;
padding-bottom: 0.5rem!important; 
padding-left: 0.75rem!important;
padding-right: 0.75rem!important; 
margin-right: 0.5rem!important; 
flex: 1 1 0%!important; 
border-radius: 0.5rem!important; 
border-width: 1px!important; 
border-color: #A78BFA!important; 
color: #ffffff!important; 
transition-property: all!important;
transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1)!important;
transition-duration: 300ms!important; 
transition-duration: 150ms!important; 
}
</style>
