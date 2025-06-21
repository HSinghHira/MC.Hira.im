<template>
  <div class="minecraft-ping-tool">
    <!-- Content -->
    <div>
      <!-- CORS Notice -->
      <div v-if="showCorsNotice" class="cors-notice">
        <div class="cors-notice-content">
          <div class="cors-notice-icon">
            <svg class="warning-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd" />
            </svg>
          </div>
          <div class="cors-notice-text">
            <p>
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
      <div class="input-section">
        <label for="serverList" class="input-label">
          Server IPs (one per line):
        </label>
        <textarea 
          id="serverList" 
          v-model="serverList"
          class="server-textarea"
          placeholder="Enter server IPs, one per line:&#10;play.example.com&#10;192.168.1.100:25565&#10;mc.server.net" 
        />
      </div>

      <!-- Controls -->
      <div class="controls-section">
        <button 
          @click="pingServers" 
          :disabled="isPinging"
          class="btn btn-primary"
        >
          <span v-if="isPinging" class="btn-loading">
            <svg class="loading-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="loading-circle" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="loading-path" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            Pinging...
          </span>
          <span v-else>🔍 Ping Servers</span>
        </button>

        <button 
          @click="clearResults"
          class="btn btn-danger"
        >
          🗑️ Clear Results
        </button>
      </div>

      <!-- Progress Bar -->
      <div v-if="showProgress" class="progress-section">
        <div class="progress-bar">
          <div 
            class="progress-fill"
            :style="{ width: progressPercentage + '%' }" 
          />
        </div>
        <p class="progress-text">
          {{ Math.round(progressPercentage) }}% Complete
        </p>
      </div>

      <!-- Results -->
      <div v-if="showResults" class="results-section">
        <h2 class="results-title">📊 Results</h2>

        <div class="results-container">
          <div 
            v-for="(result, index) in results" 
            :key="index"
            class="result-card"
          >
            <!-- Server Header -->
            <div class="result-header">
              <div class="server-address">
                {{ result.address }}
              </div>
              <div :class="['status-badge', `status-${result.status}`]">
                {{
                  result.status === "checking" ? "Checking..." : result.status
                }}
              </div>
            </div>

            <!-- Server Details -->
            <div v-if="result.status !== 'checking'" class="result-details">
              <div v-if="result.status === 'online'" class="details-grid">
                <div class="detail-card detail-online">
                  <div class="detail-label">Server Status</div>
                  <div class="detail-value">✅ Online</div>
                </div>

                <div class="detail-card detail-online">
                  <div class="detail-label">Whitelist Status</div>
                  <div :class="['detail-value', result.whitelistStatus?.includes('Enabled') ? 'text-danger' : 'text-success']">
                    {{ result.whitelistStatus }}
                  </div>
                </div>

                <div class="detail-card detail-online">
                  <div class="detail-label">Players Online</div>
                  <div class="detail-value">
                    {{ result.playersOnline }} / {{ result.playersMax }}
                  </div>
                </div>

                <div class="detail-card detail-online">
                  <div class="detail-label">Version</div>
                  <div class="detail-value">{{ result.version }}</div>
                </div>

                <div class="detail-card detail-online">
                  <div class="detail-label">Software</div>
                  <div class="detail-value">{{ result.software }}</div>
                </div>

                <div class="detail-card detail-online">
                  <div class="detail-label">MOTD</div>
                  <div class="detail-value detail-motd">{{ result.motd }}</div>
                </div>

                <div 
                  v-if="result.playerList && result.playerList.length > 0"
                  class="detail-card detail-online detail-players"
                >
                  <div class="detail-label">Online Players</div>
                  <div class="detail-value">
                    {{ result.playerList.join(", ") }}
                  </div>
                </div>
              </div>

              <div v-else class="details-grid">
                <div class="detail-card detail-offline">
                  <div class="detail-label">Server Status</div>
                  <div class="detail-value">❌ Offline</div>
                </div>

                <div class="detail-card detail-offline">
                  <div class="detail-label">Whitelist Status</div>
                  <div class="detail-value">Cannot determine (server offline)</div>
                </div>

                <div class="detail-card detail-offline detail-error">
                  <div class="detail-label">Error</div>
                  <div class="detail-value">{{ result.error }}</div>
                </div>
              </div>
            </div>

            <!-- Loading State -->
            <div v-else class="result-loading">
              <div class="loading-content">
                <svg class="loading-spinner-small" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="loading-circle" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="loading-path" fill="currentColor"
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

<style scoped>
.minecraft-ping-tool {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

/* CORS Notice */
.cors-notice {
  background-color: var(--vp-c-danger-soft);
  border: 1px solid var(--vp-c-danger);
  border-left: 4px solid var(--vp-c-danger);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  color: var(--vp-c-danger-text);
}

.cors-notice-content {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.cors-notice-icon {
  flex-shrink: 0;
}

.warning-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--vp-c-danger);
}

.cors-notice-text p {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;
}

/* Input Section */
.input-section {
  margin-bottom: 2rem;
}

.input-label {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 600;
  font-size: 1.125rem;
  color: var(--vp-c-text-1);
}

.server-textarea {
  width: 100%;
  height: 10rem;
  padding: 1rem;
  border: 2px solid var(--vp-c-border);
  border-radius: 12px;
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-family: var(--vp-font-family-mono);
  font-size: 0.875rem;
  resize: vertical;
  transition: border-color 0.3s ease;
}

.server-textarea:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px var(--vp-c-brand-soft);
}

/* Controls */
.controls-section {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-primary {
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--vp-c-brand-2), var(--vp-c-brand-3));
}

.btn-danger {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.btn-danger:hover {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
}

.btn-loading {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.loading-spinner, .loading-spinner-small {
  animation: spin 1s linear infinite;
}

.loading-spinner {
  width: 1.25rem;
  height: 1.25rem;
}

.loading-spinner-small {
  width: 1rem;
  height: 1rem;
}

.loading-circle {
  opacity: 0.25;
}

.loading-path {
  opacity: 0.75;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Progress Bar */
.progress-section {
  margin-bottom: 2rem;
}

.progress-bar {
  width: 100%;
  height: 1.25rem;
  background-color: var(--vp-c-bg-mute);
  border-radius: 9999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  border-radius: 9999px;
  transition: width 0.3s ease;
}

.progress-text {
  margin-top: 0.5rem;
  text-align: center;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}

/* Results */
.results-section {
  margin-top: 2rem;
}

.results-title {
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  font-weight: 700;
  font-size: 1.5rem;
  color: var(--vp-c-text-1);
  border-bottom: 2px solid var(--vp-c-divider);
}

.results-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.result-card {
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  background-color: var(--vp-c-bg);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
}

.result-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1);
}

.result-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.server-address {
  font-family: var(--vp-font-family-mono);
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--vp-c-text-1);
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-weight: 700;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.status-online {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.status-offline {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.status-checking {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
}

/* Result Details */
.result-details {
  padding: 1.5rem;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.detail-card {
  padding: 1rem;
  border-radius: 8px;
  background-color: var(--vp-c-bg-soft);
}

.detail-online {
  border-left: 4px solid #10b981;
}

.detail-offline {
  border-left: 4px solid #ef4444;
}

.detail-players {
  grid-column: 1 / -1;
}

.detail-error {
  grid-column: 1 / -1;
}

.detail-label {
  margin-bottom: 0.25rem;
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--vp-c-text-2);
}

.detail-value {
  font-size: 1.125rem;
  color: var(--vp-c-text-1);
}

.detail-motd {
  word-break: break-all;
}

.text-success {
  color: #10b981 !important;
  font-weight: 700;
}

.text-danger {
  color: #ef4444 !important;
  font-weight: 700;
}

/* Loading State */
.result-loading {
  padding: 1.5rem;
  text-align: center;
}

.loading-content {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
  color: var(--vp-c-text-2);
}

/* Responsive Design */
@media (max-width: 768px) {
  .minecraft-ping-tool {
    padding: 0.5rem;
  }
  
  .controls-section {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
  
  .details-grid {
    grid-template-columns: 1fr;
  }
  
  .result-header {
    flex-direction: column;
    align-items: flex-start;
  }
}

/* Dark mode adjustments */
@media (prefers-color-scheme: dark) {
  .result-card:hover {
    box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.3);
  }
}
</style>