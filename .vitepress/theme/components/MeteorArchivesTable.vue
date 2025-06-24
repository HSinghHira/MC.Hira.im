<template>
  <DataTable :value="archives" :paginator="true" :rows="10" :rowsPerPageOptions="[5, 10, 20]" responsiveLayout="scroll">
    <Column field="version" header="Meteor Version" :sortable="true"></Column>
    <Column field="minecraft_versions" header="Minecraft Version" :sortable="true">
      <template #body="slotProps">
        <Tag
          v-for="version in slotProps.data.minecraft_versions"
          :key="version"
          :value="version"
          class="mr-1 mb-1"
        />
      </template>
    </Column>
    <Column field="release_date" header="Release Date" :sortable="true">
      <template #body="slotProps">
        {{ formatDate(slotProps.data.release_date) }}
      </template>
    </Column>
    <Column header="Download">
      <template #body="slotProps">
        <Button
          label="Download"
          icon="pi pi-download"
          class="p-button-sm"
          @click="openDownloadDialog(slotProps.data)"
          :disabled="!slotProps.data.downloads || slotProps.data.downloads.length === 0"
        />
      </template>
    </Column>
    <Column header="Source Code">
      <template #body="slotProps">
        <Button
          label="Source"
          icon="pi pi-github"
          class="p-button-sm p-button-outlined"
          @click="openSourceLink(slotProps.data.source_code)"
          :disabled="!slotProps.data.source_code"
        />
      </template>
    </Column>
  </DataTable>

  <!-- Download Dialog -->
  <Dialog
    v-model:visible="showDownloadDialog"
    header="Download Version"
    :modal="true"
    :dismissableMask="true"
  >
    <div v-if="selectedArchive">
      <p>Download <strong>{{ selectedArchive.version }}</strong> for the following Minecraft versions:</p>
      <div class="flex flex-col gap-2 mt-2">
        <Button
          v-for="(download, index) in selectedArchive.downloads"
          :key="download"
          :label="`Download for ${selectedArchive.minecraft_versions[index] || 'Unknown Version'}`"
          icon="pi pi-download"
          class="p-button-success"
          @click="downloadFile(download)"
          :disabled="!download"
        />
      </div>
      <p v-if="!selectedArchive.downloads || selectedArchive.downloads.length === 0" class="text-red-500">
        No downloads available.
      </p>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Define interface for archive data
interface Archive {
  version: string
  minecraft_versions: string[]
  downloads: string[]
  source_code: string | null
  release_date: string
}

// Reactive state
const archives = ref<Archive[]>([])
const showDownloadDialog = ref(false)
const selectedArchive = ref<Archive | null>(null)

// Fetch data from JSON file
onMounted(async () => {
  try {
    const response = await fetch('/data/meteor-client-versions.json')
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`)
    }
    archives.value = await response.json()
  } catch (error) {
    console.error('Error loading Meteor Client versions:', error)
    // Optionally set a fallback or show an error message
  }
})

// Format date to "1st Mar. 2023" style
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  console.log("Parsed date:", date) // 👈 log to check

  const day = date.getDate()
  const month = date.toLocaleString('en-US', { month: 'short' })
  const year = date.getFullYear().toString().slice(2)

  return `${day} ${month}. ${year}`
}


const openDownloadDialog = (archive: Archive) => {
  selectedArchive.value = archive
  showDownloadDialog.value = true
}

const downloadFile = (url: string) => {
  if (url) {
    window.open(url, '_blank')
    showDownloadDialog.value = false
  }
}

const openSourceLink = (url: string | null) => {
  if (url) {
    window.open(url, '_blank')
  }
}
</script>

<style scoped>
/* Optional: Add custom styles */
</style>