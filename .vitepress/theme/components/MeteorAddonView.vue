<template>
  <div class="fixed relative inset-0 min-h-screen overflow-hidden font-['courier']">
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

    <!-- Improved GitHub Token Input Component -->
    <div
      v-if="showTokenPrompt"
      class="top-6 left-1/2 z-50 fixed bg-gradient-to-br from-purple-700 to-purple-500 shadow-2xl px-8 py-6 border border-purple-300 rounded-2xl w-full max-w-md text-white -translate-x-1/2 transform"
    >
      <div class="flex items-center mb-4">
        <div class="font-extrabold text-lg">Add GitHub Token for Higher Limits</div>
      </div>
      <div class="mb-5 text-purple-100 text-sm">
        You have exceeded the GitHub API rate limit for unauthenticated requests. To continue using this addon, please provide a Personal Access Token.
      </div>
      <div class="mb-5 text-purple-100 text-sm">
        For your security, use a second (Not so useful) GitHub account. Treat your access token like a password. Because I am not storing it, but your PC may have malware that can read it. And, I am not responsible for that.
      </div>
      <div class="flex items-center mb-3">
        <input
          v-model="tokenInput"
          type="password"
          placeholder="GitHub Personal Access Token"
          class="flex-1 mr-2 px-3 py-2 border border-purple-400 focus:border-green-400 rounded-lg focus:ring-2 focus:ring-green-400/50 text-white transition-all duration-150 placeholder-purple-300"
          @keyup.enter="saveToken"
          autocomplete="off"
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

    <!-- Statistics Panel -->
    <div class="right-4 bottom-4 z-40 absolute bg-gray-800 bg-opacity-90 px-4 py-2 rounded-lg text-white text-sm">
      <div class="flex space-x-4">
        <div>Repository: {{ urlParams.user }}/{{ urlParams.repo }}</div>
        <div>Total: {{ totalItems }}</div>
        <div>API Remaining: {{ apiCallsRemaining }}</div>
        <div v-if="showRateLimit" class="text-yellow-300">
          API Resets at: {{ rateLimitMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";

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
    path:
      urlParams.get("path") ||
      "src/main/java/meteordevelopment/meteorclient/systems/modules/combat",
    branch: "master",
  };
};
const urlParams = getUrlParams();

// --- State ---
const guiRefs = ref([]);
const categories = ref([]);
const isDragging = ref(false);
const dragOffset = ref({ x: 0, y: 0 });
const dragTarget = ref(null);
const maxHeight = ref(400);
const maxZIndex = ref(1000);

const totalItems = ref(0);
const apiCallsRemaining = ref(0);
const showRateLimit = ref(false);
const rateLimitMessage = ref("");
const showTokenPrompt = ref(false);
const tokenInput = ref("");

// --- Token logic ---
function saveToken() {
  if (tokenInput.value.trim()) {
    localStorage.setItem('github_token', tokenInput.value.trim());
    showTokenPrompt.value = false;
    tokenInput.value = '';
    fetchModules();
  }
}
function getAuthHeader() {
  const token = localStorage.getItem('github_token');
  return token ? { headers: { Authorization: `token ${token}` } } : {};
}

// --- Methods ---
const extractCategories = async () => {
  try {
    const possibleMainFiles = [
      `${urlParams.repo}.java`,
      `${urlParams.repo.charAt(0).toUpperCase() + urlParams.repo.slice(1)}.java`,
      "Addon.java",
      "Trouser.java",
    ];
    let mainFileContent = null;
    let categoryVariableMap = new Map();
    const addonRoot = urlParams.path.split("/").slice(0, -1).join("/");
    for (const fileName of possibleMainFiles) {
      try {
        const response = await fetch(
          `https://api.github.com/repos/${urlParams.user}/${urlParams.repo}/contents/${addonRoot}/${fileName}`,
          getAuthHeader()
        );
        if (response.ok) {
          const data = await response.json();
          mainFileContent = atob(data.content);
          break;
        }
      } catch (e) {}
    }
    const extractedCategories = [];
    if (mainFileContent) {
      const categoryRegex =
        /public\s+static\s+final\s+Category\s+(\w+)\s*=\s*new\s+Category\s*\(\s*"([^"]+)"/g;
      let match;
      while ((match = categoryRegex.exec(mainFileContent)) !== null) {
        const variableName = match[1];
        const displayName = match[2];
        categoryVariableMap.set(variableName, displayName);
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
    if (extractedCategories.length === 0) {
      extractedCategories.push({
        name: "Main",
        displayName: "Main",
        modules: [],
        collapsed: false,
        position: { x: 50, y: 50 },
        zIndex: 1000,
      });
    }
    return {
      categories: extractedCategories,
      categoryMap: categoryVariableMap,
    };
  } catch (error) {
    return {
      categories: [
        {
          name: "Main",
          displayName: "Main",
          modules: [],
          collapsed: false,
          position: { x: 50, y: 50 },
          zIndex: 1000,
        },
      ],
      categoryMap: new Map([["Main", "Main"]]),
    };
  }
};

const determineModuleCategory = (moduleContent, categoryMap, moduleName) => {
  const constructorPatterns = [
    /super\s*\(\s*\w+\.(\w+)\s*,/g,
    /super\s*\(\s*(\w+)\s*,/g,
    /super\s*\(\s*([^,\s]+)\s*,/g,
  ];
  for (let i = 0; i < constructorPatterns.length; i++) {
    const pattern = constructorPatterns[i];
    const matches = [...moduleContent.matchAll(pattern)];
    for (const match of matches) {
      let categoryVar = match[1];
      if (categoryVar.includes(".")) {
        categoryVar = categoryVar.split(".").pop();
      }
      if (categoryMap.has(categoryVar)) {
        return categoryVar;
      }
      for (const [key] of categoryMap.entries()) {
        if (key.toLowerCase() === categoryVar.toLowerCase()) {
          return key;
        }
      }
    }
  }
  return null;
};

const fetchModules = async () => {
  showRateLimit.value = false;
  rateLimitMessage.value = "";
  try {
    // Get repo stats and rate limit info
    const repoRes = await fetch(
      `https://api.github.com/repos/${urlParams.user}/${urlParams.repo}`,
      getAuthHeader()
    );
    apiCallsRemaining.value = repoRes.headers.get('x-ratelimit-remaining') || 0;
    const resetTimestamp = repoRes.headers.get('x-ratelimit-reset');
    if (resetTimestamp && apiCallsRemaining.value == 0) {
      showRateLimit.value = true;
      const resetDate = new Date(parseInt(resetTimestamp, 10) * 1000);
      rateLimitMessage.value = resetDate.toLocaleTimeString();
    }
    if (repoRes.status === 403) {
      showRateLimit.value = true;
      if (resetTimestamp) {
        const resetDate = new Date(parseInt(resetTimestamp, 10) * 1000);
        rateLimitMessage.value = resetDate.toLocaleTimeString();
      }
      // If rate limited, prompt for token
      showTokenPrompt.value = true;
      throw new Error('Rate limit exceeded');
    }
    const repoData = await repoRes.json();
    totalItems.value = repoData.stargazers_count || 0;

    // Extract categories and modules
    const { categories: extractedCategories, categoryMap } = await extractCategories();
    categories.value = extractedCategories;

    // Fetch modules from directory
    const response = await fetch(
      `https://api.github.com/repos/${urlParams.user}/${urlParams.repo}/contents/${urlParams.path}`,
      getAuthHeader()
    );
    apiCallsRemaining.value = response.headers.get('x-ratelimit-remaining') || 0;
    const resetTimestamp2 = response.headers.get('x-ratelimit-reset');
    if (resetTimestamp2 && apiCallsRemaining.value == 0) {
      showRateLimit.value = true;
      const resetDate = new Date(parseInt(resetTimestamp2, 10) * 1000);
      rateLimitMessage.value = resetDate.toLocaleTimeString();
    }
    if (response.status === 403) {
      showRateLimit.value = true;
      if (resetTimestamp2) {
        const resetDate = new Date(parseInt(resetTimestamp2, 10) * 1000);
        rateLimitMessage.value = resetDate.toLocaleTimeString();
      }
      // If rate limited, prompt for token
      showTokenPrompt.value = true;
      throw new Error('Rate limit exceeded');
    }
    const data = await response.json();
    const moduleFiles = data.filter((item) => item.name.endsWith(".java"));
    totalItems.value = moduleFiles.length;

    for (const moduleFile of moduleFiles) {
      try {
        const moduleResponse = await fetch(moduleFile.download_url);
        const moduleContent = await moduleResponse.text();
        const module = {
          name: moduleFile.name,
          displayName: moduleFile.name.replace(".java", ""),
          active: false,
        };
        const categoryVar = determineModuleCategory(
          moduleContent,
          categoryMap,
          moduleFile.name
        );
        if (categoryVar) {
          const category = categories.value.find(
            (cat) => cat.name === categoryVar
          );
          if (category) {
            category.modules.push(module);
          } else if (categories.value.length > 0) {
            categories.value[0].modules.push(module);
          }
        } else if (categories.value.length > 0) {
          categories.value[0].modules.push(module);
        }
      } catch (error) {}
    }
    await nextTick();
    positionCategories();
  } catch (err) {
    console.error(err);
  }
};

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
// Lifecycle
onMounted(async () => {
  const token = localStorage.getItem('github_token');
  if (!token) {
    showTokenPrompt.value = false; // Don't show at first, only on rate limit
    await fetchModules();
  } else {
    showTokenPrompt.value = false;
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
