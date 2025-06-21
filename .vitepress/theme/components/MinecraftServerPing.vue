<template>
  <div class="minecraft-ping-tool">
    <!-- Content -->
    <div>
      <!-- CORS Notice -->
      <div v-if="showCorsNotice" class="bg-red-50 mb-6 p-4 border-red-500 border-l-4 rounded-r-lg text-red-700">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="w-5 h-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm">
              <strong>⚠️ CORS Notice:</strong> If you're getting "Failed to
              fetch" errors, this is due to browser security restrictions. Try
              using the tool in a different browser, or consider running it from
              a local web server. Some servers may also block API requests
              entirely.
            </p>
          </div>
        </div>
      </div>

      <!-- Input Section -->
      <div class="mb-8">
        <label for="serverList" class="block mb-3 font-semibold text-lg">
          Server IPs (one per line):
        </label>
        <textarea id="serverList" v-model="serverList"
          class="p-4 border-2 w-full h-40 font-mono text-sm transition-colors duration-300 resize-y \rounded-xl"
          placeholder="Enter server IPs, one per line:&#10;play.example.com&#10;192.168.1.100:25565&#10;mc.server.net" />
      </div>

      <!-- Controls -->
      <div class="flex flex-wrap gap-4 mb-8">
        <button @click="pingServers" :disabled="isPinging"
          class="bg-gradient-to-r from-green-500 hover:from-green-600 to-green-600 hover:to-green-700 disabled:opacity-60 hover:shadow-lg px-6 py-3 rounded-lg focus:outline-none focus:ring-4 focus:ring-green-300 font-bold text-white uppercase tracking-wide hover:scale-105 transition-all duration-300 disabled:cursor-not-allowed transform">
          <span v-if="isPinging" class="flex items-center">
            <svg class="mr-3 -ml-1 w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            Pinging...
          </span>
          <span v-else><i class="mr-2 pi pi-search"></i> Ping Servers</span>
        </button>

        <button @click="clearResults"
          class="bg-gradient-to-r from-red-500 hover:from-red-600 to-red-600 hover:to-red-700 hover:shadow-lg px-6 py-3 rounded-lg focus:outline-none focus:ring-4 focus:ring-red-300 font-bold text-white uppercase tracking-wide hover:scale-105 transition-all duration-300 transform">
          <i class="mr-2 pi pi-trash"></i> Clear Results
        </button>
      </div>

      <!-- Progress Bar -->
      <div v-if="showProgress" class="mb-8">
        <div class="bg-gray-200 rounded-full h-5 overflow-hidden">
          <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-full h-full transition-all duration-300"
            :style="{ width: progressPercentage + '%' }" />
        </div>
        <p class="mt-2 text-gray-600 text-sm text-center">
          {{ Math.round(progressPercentage) }}% Complete
        </p>
      </div>

      <!-- Results -->
      <div v-if="showResults" class="mt-8">
        <h2 class="mb-6 pb-3 font-bold text-2xl">📊 Results</h2>

        <div class="space-y-6">
          <div v-for="(result, index) in results" :key="index"
            class="shadow-lg hover:shadow-xl border border-gray-600 rounded-xl overflow-hidden transition-all hover:-translate-y-1 duration-300">
            <!-- Server Header -->
            <div class="flex flex-wrap justify-between items-center gap-4 p-6">
              <div class="font-mono font-bold text-xl">
                {{ result.address }}
              </div>
              <div :class="[
                'px-4 py-2 rounded-full font-bold text-sm uppercase tracking-wider',
                result.status === 'online'
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                  : result.status === 'offline'
                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                    : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white',
              ]">
                {{
                  result.status === "checking" ? "Checking..." : result.status
                }}
              </div>
            </div>

            <!-- Server Details -->
            <div v-if="result.status !== 'checking'" class="px-6 pb-6">
              <div v-if="result.status === 'online'" class="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <div class="bg-gray-50 dark:bg-gray-800 p-4 border-green-500 border-l-4 rounded-lg">
                  <div class="mb-1 font-semibold text-gray-400 dark:text-gray-400 text-xs uppercase tracking-wider">
                    Server Status
                  </div>
                  <div class="text-gray-600 dark:text-gray-200 text-lg">
                    ✅ Online
                  </div>
                </div>

                <div class="bg-gray-50 dark:bg-gray-800 p-4 border-green-500 border-l-4 rounded-lg">
                  <div class="mb-1 font-semibold text-gray-400 dark:text-gray-400 text-xs uppercase tracking-wider">
                    Whitelist Status
                  </div>
                  <div :class="[
                    'text-lg font-bold',
                    result.whitelistStatus?.includes('Enabled')
                      ? 'text-red-500 dark:text-red-400'
                      : 'text-green-500 dark:text-green-400',
                  ]">
                    {{ result.whitelistStatus }}
                  </div>
                </div>

                <div class="bg-gray-50 dark:bg-gray-800 p-4 border-green-500 border-l-4 rounded-lg">
                  <div class="mb-1 font-semibold text-gray-400 dark:text-gray-400 text-xs uppercase tracking-wider">
                    Players Online
                  </div>
                  <div class="text-gray-600 dark:text-gray-200 text-lg">
                    {{ result.playersOnline }} / {{ result.playersMax }}
                  </div>
                </div>

                <div class="bg-gray-50 dark:bg-gray-800 p-4 border-green-500 border-l-4 rounded-lg">
                  <div class="mb-1 font-semibold text-gray-400 dark:text-gray-400 text-xs uppercase tracking-wider">
                    Version
                  </div>
                  <div class="text-gray-600 dark:text-gray-200 text-lg">
                    {{ result.version }}
                  </div>
                </div>

                <div class="bg-gray-50 dark:bg-gray-800 p-4 border-green-500 border-l-4 rounded-lg">
                  <div class="mb-1 font-semibold text-gray-400 dark:text-gray-400 text-xs uppercase tracking-wider">
                    Software
                  </div>
                  <div class="text-gray-600 dark:text-gray-200 text-lg">
                    {{ result.software }}
                  </div>
                </div>

                <div class="bg-gray-50 dark:bg-gray-800 p-4 border-green-500 border-l-4 rounded-lg">
                  <div class="mb-1 font-semibold text-gray-400 dark:text-gray-400 text-xs uppercase tracking-wider">
                    MOTD
                  </div>
                  <div class="text-gray-600 dark:text-gray-200 text-lg break-all">
                    {{ result.motd }}
                  </div>
                </div>

                <div v-if="result.playerList && result.playerList.length > 0"
                  class="md:col-span-2 lg:col-span-3 bg-gray-50 dark:bg-gray-800 p-4 border-green-500 border-l-4 rounded-lg">
                  <div class="mb-1 font-semibold text-gray-400 dark:text-gray-400 text-xs uppercase tracking-wider">
                    Online Players
                  </div>
                  <div class="text-gray-600 dark:text-gray-200 text-lg">
                    {{ result.playerList.join(", ") }}
                  </div>
                </div>
              </div>

              <div v-else class="gap-4 grid grid-cols-1 md:grid-cols-2">
                <div class="bg-gray-50 dark:bg-gray-800 p-4 border-red-500 border-l-4 rounded-lg">
                  <div class="mb-1 font-semibold text-gray-400 dark:text-gray-400 text-xs uppercase tracking-wider">
                    Server Status
                  </div>
                  <div class="text-gray-600 dark:text-gray-200 text-lg">
                    ❌ Offline
                  </div>
                </div>

                <div class="bg-gray-50 dark:bg-gray-800 p-4 border-red-500 border-l-4 rounded-lg">
                  <div class="mb-1 font-semibold text-gray-400 dark:text-gray-400 text-xs uppercase tracking-wider">
                    Whitelist Status
                  </div>
                  <div class="text-gray-600 dark:text-gray-200 text-lg">
                    Cannot determine (server offline)
                  </div>
                </div>

                <div class="md:col-span-2 bg-gray-50 dark:bg-gray-800 p-4 border-red-500 border-l-4 rounded-lg">
                  <div class="mb-1 font-semibold text-gray-400 dark:text-gray-400 text-xs uppercase tracking-wider">
                    Error
                  </div>
                  <div class="text-gray-600 dark:text-gray-200 text-lg">
                    {{ result.error }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Loading State -->
            <div v-else class="px-6 pb-6 text-center">
              <div class="flex justify-center items-center text-gray-600">
                <svg class="mr-3 -ml-1 w-5 h-5 text-gray-400 animate-spin" xmlns="http://www.w3.org/2000/svg"
                  fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
                Pinging server...
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";

// Reactive data
const serverList = ref("");
const isPinging = ref(false);
const showProgress = ref(false);
const showResults = ref(false);
const showCorsNotice = ref(false);
const progressPercentage = ref(0);
const results = ref([]);
const corsErrorCount = ref(0);

// API endpoints for fallback
const apiEndpoints = [
  "https://api.mcsrvstat.us/3/",
  "https://mcapi.us/server/status?ip=",
  "https://api.mcstatus.io/v2/status/java/",
];

// Methods
const pingServers = async () => {
  const servers = serverList.value.trim();
  if (!servers) {
    alert("Please enter at least one server IP!");
    return;
  }

  const serverAddresses = servers.split("\n").filter((ip) => ip.trim());
  if (serverAddresses.length === 0) {
    alert("Please enter valid server IPs!");
    return;
  }

  isPinging.value = true;
  showProgress.value = true;
  showResults.value = true;
  showCorsNotice.value = false;
  corsErrorCount.value = 0;
  results.value = [];
  progressPercentage.value = 0;

  // Initialize results with checking status
  serverAddresses.forEach((address) => {
    results.value.push({
      address: address.trim(),
      status: "checking",
    });
  });

  // Ping each server
  for (let i = 0; i < serverAddresses.length; i++) {
    const serverAddress = serverAddresses[i].trim();
    await pingServer(serverAddress, i);
    progressPercentage.value = ((i + 1) / serverAddresses.length) * 100;
  }

  isPinging.value = false;
  showProgress.value = false;

  // Show CORS notice if needed
  if (corsErrorCount.value >= 2) {
    showCorsNotice.value = true;
  }
};

const pingServer = async (serverAddress, index) => {
  let lastError = null;

  // Try each API endpoint until one works
  for (let i = 0; i < apiEndpoints.length; i++) {
    try {
      const data = await tryApiEndpoint(apiEndpoints[i], serverAddress);
      updateServerResult(index, serverAddress, data);
      return; // Success, exit the loop
    } catch (error) {
      console.warn(`API ${i + 1} failed for ${serverAddress}:`, error.message);
      lastError = error;

      // Track CORS errors
      if (
        error.message.includes("Failed to fetch") ||
        error.message.includes("CORS")
      ) {
        corsErrorCount.value++;
      }

      // If it's the last API, show the error
      if (i === apiEndpoints.length - 1) {
        updateServerResult(index, serverAddress, {
          online: false,
          error: `Connection failed: ${error.message}`,
        });
      }
    }
  }
};

const tryApiEndpoint = async (apiUrl, serverAddress) => {
  let url;
  let response;

  if (apiUrl.includes("mcsrvstat.us")) {
    url = `${apiUrl}${encodeURIComponent(serverAddress)}`;
    response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } else if (apiUrl.includes("mcapi.us")) {
    url = `${apiUrl}${encodeURIComponent(serverAddress)}`;
    response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    return convertMcApiUsData(data);
  } else if (apiUrl.includes("mcstatus.io")) {
    url = `${apiUrl}${encodeURIComponent(serverAddress)}`;
    response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    return convertMcStatusIoData(data);
  }

  throw new Error("Unknown API format");
};

const convertMcStatusIoData = (data) => {
  if (!data || data.online === false) {
    return { online: false };
  }

  return {
    online: data.online || false,
    players: {
      online: data.players?.online || 0,
      max: data.players?.max || 0,
      list: data.players?.list?.map((p) => p.name_raw || p.name) || [],
    },
    version: data.version?.name_raw || data.version?.name || "Unknown",
    motd: {
      clean: data.motd?.clean || data.motd?.raw || "No MOTD",
      raw: data.motd?.raw || "No MOTD",
    },
    software: data.software || "Unknown",
  };
};

const convertMcApiUsData = (data) => {
  if (!data || data.status !== "success" || !data.online) {
    return { online: false };
  }

  return {
    online: data.online || false,
    players: {
      online: data.players?.now || 0,
      max: data.players?.max || 0,
      list: [],
    },
    version: data.server?.name || "Unknown",
    motd: {
      clean: data.motd || "No MOTD",
      raw: data.motd || "No MOTD",
    },
    software: "Unknown",
  };
};

const updateServerResult = (index, serverAddress, data) => {
  if (data.online) {
    const motd = data.motd
      ? data.motd.clean || data.motd.raw || "No MOTD"
      : "No MOTD";
    const version = data.version || "Unknown";
    const playersOnline = data.players ? data.players.online || 0 : 0;
    const playersMax = data.players ? data.players.max || 0 : 0;
    const software = data.software || "Unknown";

    // Determine whitelist status
    let whitelistStatus = "Unknown";

    if (data.debug && data.debug.ping !== undefined) {
      if (playersOnline === 0 && data.debug.query === false) {
        whitelistStatus = "Possibly Enabled";
      } else {
        whitelistStatus = "Likely Disabled";
      }
    } else {
      if (!data.players || (!data.players.list && playersOnline > 0)) {
        whitelistStatus = "Possibly Enabled";
      } else {
        whitelistStatus = "Likely Disabled";
      }
    }

    results.value[index] = {
      address: serverAddress,
      status: "online",
      whitelistStatus,
      playersOnline,
      playersMax,
      version,
      software,
      motd,
      playerList:
        data.players && data.players.list
          ? data.players.list.map((player) => player.name || player)
          : [],
    };
  } else {
    results.value[index] = {
      address: serverAddress,
      status: "offline",
      error: data.error || "Server is not responding",
    };
  }
};

const clearResults = () => {
  results.value = [];
  showResults.value = false;
  showProgress.value = false;
  showCorsNotice.value = false;
  progressPercentage.value = 0;
};
</script>
