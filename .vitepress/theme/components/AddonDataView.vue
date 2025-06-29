<template>
  <div class="addon-dataview-container">
    <DataView
      :value="sortedAddons"
      :rows="9"
      :paginator="true"
      :sortOrder="1"
      :sortField="'title'"
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
              <!-- Addon Card -->
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
          <p>No addons found.</p>
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
.addons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  width: 100%;
}
/* Card wrapper becomes horizontal row */
.addon-card-inner {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.addon-grid-item {
  width: 100%;
}
/* Image on left */
.addon-icon-container {
  flex-shrink: 0;
  margin: 0; 
}
/* Remove base border, apply on hover only */
.addon-card {
  background: var(--vp-c-bg-soft);
  border: none; /* no border by default */
  border-radius: 12px;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  height: 100%;
  display: block;
  
}

.addon-card:hover {
  border: 1px solid var(--vp-c-border);

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
}

.addon-title {
  line-height: 24px;
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.addon-description {
  flex-grow: 1;
  line-height: 24px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  text-decoration: none;
}

.empty-state,
.loading-state {
  text-align: center;
  padding: 2rem;
  color: var(--vp-c-text-2);
}

/* Remove the DataView content override since we're handling grid ourselves */

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
  padding: 8px 12px;
  font-size: 16px;
  border-radius: 50%;
  min-width: 40px;
  height: 40px;
  margin: 0 4px;
}

:deep(.p-paginator .p-paginator-pages .p-paginator-page) {
  background: var(--vp-c-bg-soft);
  border: none;
  color: var(--vp-c-text-1);
  padding: 8px 12px;
  font-size: 16px;
  border-radius: 50%;
  min-width: 40px;
  height: 40px;
  margin: 0 4px;
}

:deep(.p-paginator .p-paginator-prev),
:deep(.p-paginator .p-paginator-next),
:deep(.p-paginator .p-paginator-first),
:deep(.p-paginator .p-paginator-last) {
  background: var(--vp-c-bg-soft);
  border: none;
  color: var(--vp-c-text-1);
  border-radius: 50%;
  min-width: 40px;
  height: 40px;
  margin: 0 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.p-paginator .p-paginator-prev:hover),
:deep(.p-paginator .p-paginator-next:hover),
:deep(.p-paginator .p-paginator-first:hover),
:deep(.p-paginator .p-paginator-last:hover) {
  background: var(--vp-c-bg-alt);
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
}
:deep(.p-dataview-paginator-bottom) {
  --p-dataview-content-border-width: 0;
  border-width: 0 !important;
  border: none !important;
}

/* Dark mode adjustments */
@media (prefers-color-scheme: dark) {
  .addon-card {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  .addon-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  }
}
</style>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";

// Define the addon interface
interface Addon {
  title: string;
  link: string;
  description: string;
  icon: string;
}

// Reactive data
const addons = ref<Addon[]>([]);
const loading = ref(true);

// Computed property for sorted addons (A to Z by title)
const sortedAddons = computed(() => {
  return [...addons.value].sort((a, b) => a.title.localeCompare(b.title));
});

// Load addons data
const loadAddons = async () => {
  try {
    loading.value = true;
    const response = await fetch("/data/addons.json");
    if (!response.ok) {
      throw new Error("Failed to load addons");
    }
    const data = await response.json();
    addons.value = data;
  } catch (error) {
    console.error("Error loading addons:", error);
    addons.value = [];
  } finally {
    loading.value = false;
  }
};

// Load data when component mounts
onMounted(() => {
  loadAddons();
});
</script>
