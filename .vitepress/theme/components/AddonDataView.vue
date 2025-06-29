<template>
  <div class="addon-dataview-container">
    <!-- Enhanced Filters Section -->
    <div class="filters-container">
      <div class="filter-group">
        <FloatLabel class="w-full md:w-56" variant="in">
          <Select
            v-model="sortType"
            inputId="sort-type"
            :options="sortOptions"
            optionLabel="label"
            optionValue="value"
            class="filter-select w-full"

          />
          <label for="sort-type">Sort by</label>
        </FloatLabel>
      </div>

      <div class="filter-group">
        <FloatLabel class="w-full md:w-56" variant="in">
          <Select
            v-model="sortOrder"
            inputId="sort-order"
            :options="orderOptions"
            optionLabel="label"
            optionValue="value"
            class="filter-select w-full"

          />
          <label for="sort-order">Order</label>
        </FloatLabel>
      </div>

      <div class="filter-group">
        <FloatLabel class="w-full md:w-80" variant="in">
          <MultiSelect
            id="minecraft-version"
            v-model="selectedVersion"
            :options="availableVersions"
            optionLabel="version"
            optionValue="version"
            :maxSelectedLabels="1"
            filter
            class="filter-select w-full"

          />
          <label for="minecraft-version">MC Version</label>
        </FloatLabel>
      </div>

      <!-- Quick Stats Display -->
      <div class="stats-display">
        <div class="stat-item">
          <span class="stat-number">{{ filteredCount }}</span>
          <span class="stat-label">Addons</span>
        </div>
      </div>
    </div>

    <DataView
      :value="sortedAddons"
      :rows="9"
      :paginator="true"
      layout="grid"
      :loading="loading"
      class="addon-dataview"
    >
      <template #grid="{ items }">
        <div class="addons-grid">
          <div
            v-for="addon in items"
            :key="addon.title"
            class="addon-grid-item"
          >
            <a :href="`/${addon.link}`">
              <!-- Enhanced Addon Card -->
              <div class="addon-card">
                <!-- Icon and Content Row -->
                <div class="addon-card-inner">
                  <div class="addon-icon-container">
                    <img
                      :src="addon.icon"
                      :alt="addon.title"
                      class="addon-icon VPImage"
                    />
                  </div>

                  <div class="addon-content">
                    <h3 class="addon-title">{{ addon.title }}</h3>
                    <p class="addon-description">{{ addon.description }}</p>

                    <!-- Enhanced Stats Row -->
                    <div class="addon-stats">
                      <span v-if="addon.stars" class="stat-badge stars">
                        ⭐ {{ addon.stars }}
                      </span>
                      <span v-if="addon.downloads" class="stat-badge downloads">
                        📥 {{ formatNumber(addon.downloads) }}
                      </span>
                      <span
                        v-if="addon.last_updated"
                        class="stat-badge updated"
                      >
                        🕒 {{ formatDate(addon.last_updated) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </template>

      <!-- Empty state when no addons -->
      <template #empty>
        <div class="empty-state">
          <p>No addons found matching your filters.</p>
          <button @click="clearFilters" class="clear-filters-btn">
            Clear Filters
          </button>
        </div>
      </template>
    </DataView>
  </div>
</template>

<style scoped>
a {
  text-decoration: none;
}

.addon-dataview-container {
  margin: 2rem 0;
}

/* Enhanced Filters Styling */
.filters-container {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  flex-wrap: wrap;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 14px;
  min-width: 150px;
}

.filter-select:hover {
  border-color: var(--vp-c-brand);
}

.filter-select:focus {
  outline: none;
  border-color: var(--vp-c-brand);
  box-shadow: 0 0 0 2px rgba(var(--vp-c-brand-rgb), 0.2);
}

/* Stats Display */
.stats-display {
  display: flex;
  gap: 2rem;
  margin-left: auto;
  flex-wrap: wrap;
  border-color: var(--vp-c-brand);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 13px 12px;
  background: var(--vp-c-bg);
  border-radius: 8px;
  min-width: 60px;
  border: 1px solid var(--vp-c-border);
}

.stat-number {
  font-size: 16px;
  font-weight: 700;
  color: var(--vp-c-brand);
}

.stat-label {
  font-size: 12px;
  color: var(--vp-c-text-2);
}

/* Grid and Cards */
.addons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  width: 100%;
}

.addon-card-inner {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.addon-grid-item {
  width: 100%;
}

.addon-icon-container {
  flex-shrink: 0;
  margin: 0;
}

.addon-card {
  background: var(--vp-c-bg-soft);
  border: none;
  border-radius: 12px;
  padding: 1.5rem;
  height: 100%;
  display: block;
  transition: all 0.2s ease;
}

.addon-icon-container {
  display: flex;
  justify-content: center;
}

.addon-icon {
  width: 64px;
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  object-fit: cover;
  align-items: start;
}

.addon-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  text-align: left;
  gap: 0.5rem;
}

.addon-title {
  line-height: 24px;
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0;
}

.addon-description {
  line-height: 20px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  text-decoration: none;
  margin: 0;
}

/* Enhanced Stats Badges */
.addon-stats {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}

.stat-badge {
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 12px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  white-space: nowrap;
}

.stat-badge.stars {
  background: #fef3c7;
  color: #92400e;
}

.stat-badge.downloads {
  background: #dbeafe;
  color: #1e40af;
}

.stat-badge.updated {
  background: #d1fae5;
  color: #065f46;
}

/* Dark mode adjustments */
@media (prefers-color-scheme: dark) {
  .addon-card {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  .addon-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  }

  .stat-badge.stars {
    background: #451a03;
    color: #fcd34d;
  }

  .stat-badge.downloads {
    background: #1e3a8a;
    color: #93c5fd;
  }

  .stat-badge.updated {
    background: #064e3b;
    color: #6ee7b7;
  }
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--vp-c-text-2);
}

.clear-filters-btn {
  margin-top: 0.75rem;
  padding: 6px 12px;
  background: var(--vp-c-brand);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: background 0.2s ease, transform 0.1s ease;
}

.clear-filters-btn:hover {
  background: var(--vp-c-brand-dark);
  transform: scale(1.05);
}

/* PrimeVue DataView overrides */
:deep(.p-paginator) {
  background: transparent;
  border: none;
  padding: 1rem 0;
}

:deep(.p-paginator .p-paginator-pages .p-paginator-page) {
  background: var(--vp-c-bg-soft);
  border: none;
  color: var(--vp-c-text-1);
  padding: 6px 10px;
  font-size: 14px;
  border-radius: 50%;
  min-width: 32px;
  height: 32px;
  margin: 0 3px;
  transition: background 0.2s ease, transform 0.1s ease;
}

:deep(.p-paginator .p-paginator-pages .p-paginator-page:hover) {
  background: var(--vp-c-bg-alt);
  transform: scale(1.1);
}

:deep(.p-paginator .p-paginator-pages .p-paginator-page.p-highlight) {
  background: var(--vp-c-brand);
  border: none;
  color: white;
}

:deep(.p-paginator .p-paginator-prev),
:deep(.p-paginator .p-paginator-next),
:deep(.p-paginator .p-paginator-first),
:deep(.p-paginator .p-paginator-last) {
  background: var(--vp-c-bg-soft);
  border: none;
  color: var(--vp-c-text-1);
  border-radius: 50%;
  min-width: 32px;
  height: 32px;
  margin: 0 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease, transform 0.1s ease;
}

:deep(.p-paginator .p-paginator-prev:hover),
:deep(.p-paginator .p-paginator-next:hover),
:deep(.p-paginator .p-paginator-first:hover),
:deep(.p-paginator .p-paginator-last:hover) {
  background: var(--vp-c-bg-alt);
  transform: scale(1.1);
}

/* Hide first/prev buttons on first page */
:deep(.p-paginator .p-paginator-first.p-disabled),
:deep(.p-paginator .p-paginator-prev.p-disabled) {
  display: none;
}

/* Hide last/next buttons on last page */
:deep(.p-paginator .p-paginator-last.p-disabled),
:deep(.p-paginator .p-paginator-next.p-disabled) {
  display: none;
}

:deep(.p-dataview) {
  --p-dataview-content-border-width: 0;
  border-width: 0 !important;
  border: none !important;
  
}

:deep(.p-dataview-content) {
  --p-dataview-content-border-width: 0;
  border-width: 0 !important;
  border: none !important;
  background-color: transparent !important;
}

:deep(.p-dataview-paginator-bottom) {
  --p-dataview-content-border-width: 0;
  border-width: 0 !important;
  border: none !important;
}

/* Ensure MultiSelect maintains consistent height */
:deep(.p-multiselect) {
  min-height: 74px !important;
  height: 44px;
  display: flex;
  align-items: center;
}
:deep(.p-multiselect-label) {
  min-height: 36px !important;
  height: 36px;
  display: flex;
  align-items: center;
  padding: 4px 12px;
  line-height: normal;
}

/* Make filters stack on small screens */
@media (max-width: 600px) {
  .filters-container {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .filter-group {
    width: 100%;
  }

  .filter-select {
    width: 100%;
    min-width: auto;
  }

  .stats-display {
    margin-left: 0;
    justify-content: center;
  }
}
</style>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";

// Enhanced addon interface
interface Addon {
  title: string;
  link: string;
  description: string;
  icon: string;
  mc_version: string[];
  github_repo?: string;
  stars?: number;
  forks?: number;
  watchers?: number;
  open_issues?: number;
  last_updated?: string;
  created_date?: string;
  language?: string;
  downloads?: number;
  default_branch?: string;
  archived?: boolean;
  size?: number;
}

// Reactive data
const originalAddons = ref<Addon[]>([]);
const loading = ref(true);
const sortType = ref("stars");
const sortOrder = ref("desc");
const selectedVersion = ref<string[]>([]);

// Options for Sort by
const sortOptions = ref([
  { label: "Alphabetical", value: "alphabetical" },
  { label: "Most Stars", value: "stars" },
  { label: "Most Downloads", value: "downloads" },
  { label: "Recently Updated", value: "last_updated" },
]);

// Options for Order
const orderOptions = ref([
  { label: "High to Low", value: "desc" },
  { label: "Low to High", value: "asc" },
]);

// Get all unique Minecraft versions
const availableVersions = computed(() => {
  const versions = new Set<string>();
  originalAddons.value.forEach((addon) => {
    addon.mc_version.forEach((version) => versions.add(version));
  });
  return Array.from(versions)
    .map((version) => ({ version }))
    .sort((a, b) => {
      return b.version.localeCompare(a.version, undefined, { numeric: true });
    });
});

// Filter and sort addons
const sortedAddons = computed(() => {
  let result = [...originalAddons.value];

  // Apply version filter
  if (selectedVersion.value.length > 0) {
    result = result.filter((addon) =>
      addon.mc_version.some((version) =>
        selectedVersion.value.includes(version)
      )
    );
  }

  // Apply sorting
  result.sort((a, b) => {
    let comparison = 0;

    switch (sortType.value) {
      case "alphabetical":
        comparison = a.title.toLowerCase().localeCompare(b.title.toLowerCase());
        break;

      case "stars":
        comparison = (a.stars || 0) - (b.stars || 0);
        break;

      case "downloads":
        comparison = (a.downloads || 0) - (b.downloads || 0);
        break;

      case "last_updated":
        const dateA = new Date(a.last_updated || "1970-01-01").getTime();
        const dateB = new Date(b.last_updated || "1970-01-01").getTime();
        comparison = dateA - dateB;
        break;
    }

    // Apply sort order (except for alphabetical which has its own logic)
    if (sortType.value === "alphabetical") {
      return sortOrder.value === "asc" ? comparison : -comparison;
    } else {
      return sortOrder.value === "desc" ? -comparison : comparison;
    }
  });

  return result;
});

// Computed stats
const filteredCount = computed(() => sortedAddons.value.length);

const totalStats = computed(() => {
  const filtered = sortedAddons.value;
  return {
    stars: filtered.reduce((sum, addon) => sum + (addon.stars || 0), 0),
    downloads: filtered.reduce((sum, addon) => sum + (addon.downloads || 0), 0),
    forks: filtered.reduce((sum, addon) => sum + (addon.forks || 0), 0),
  };
});

// Helper functions
const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return "1d ago";
  if (diffDays < 30) return `${diffDays}d ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
  return `${Math.floor(diffDays / 365)}y ago`;
};

const clearFilters = () => {
  sortType.value = "alphabetical";
  sortOrder.value = "desc";
  selectedVersion.value = [];
};

// Load addons data with multiple fallbacks
const loadAddons = async () => {
  loading.value = true;

  // Try primary URL
  try {
    const response = await fetch("/data/addons-enhanced.json");
    if (response.ok) {
      const data = await response.json();
      originalAddons.value = data;
      console.log("Loaded addons from primary URL:", data.length);
      loading.value = false;
      return;
    }
  } catch {
    // Silently catch errors to avoid console logs
  }

  // Try first fallback: GitHub raw URL
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/HSinghHira/MC.Hira.im/main/public/data/addons-enhanced.json"
    );
    if (response.ok) {
      const data = await response.json();
      originalAddons.value = data;
      console.log("Loaded addons from GitHub raw URL:", data.length);
      loading.value = false;
      return;
    }
  } catch {
    // Silently catch errors to avoid console logs
  }

  // Try second fallback: addons.json
  try {
    const response = await fetch("/data/addons.json");
    if (response.ok) {
      const data = await response.json();
      originalAddons.value = data;
      console.log("Loaded addons from fallback URL:", data.length);
      loading.value = false;
      return;
    }
  } catch {
    // Silently catch errors to avoid console logs
  }

  // If all fetches fail, set empty array
  originalAddons.value = [];
  console.log("All fetch attempts failed, using empty addons list");
  loading.value = false;
};

// Load data when component mounts
onMounted(() => {
  loadAddons();
});
</script>