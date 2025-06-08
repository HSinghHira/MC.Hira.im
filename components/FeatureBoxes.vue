<template>
  <div class="gap-6 grid grid-cols-1 md:grid-cols-2">
    <div
      v-for="(feature, index) in features"
      :key="index"
      class="bg-white shadow-md hover:shadow-lg p-6 rounded-2xl transition"
    >
      <div class="flex items-center gap-4">
        <img v-if="feature.icon?.src" :src="feature.icon.src" alt="icon" class="w-12 h-12" />
        <h2 class="font-semibold text-xl">{{ feature.title }}</h2>
      </div>
      <p class="mt-2 text-gray-600">{{ feature.details }}</p>

      <div class="space-y-1 mt-4 text-gray-500 text-sm">
        <div v-if="feature.mc_version"><strong>MC Version:</strong> {{ feature.mc_version }}</div>
        <div v-if="feature.github">
          <a :href="feature.github" target="_blank" class="text-blue-600 hover:underline">GitHub Repo</a>
        </div>
        <div v-if="feature.download_link">
          <a :href="feature.download_link" target="_blank" class="text-green-600 hover:underline">Download</a>
        </div>
        <div>
          <a :href="feature.link" class="inline-block mt-2 text-indigo-600 hover:underline">Learn More →</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useData } from 'vitepress'

const { frontmatter } = useData()
const features = frontmatter.value.features || []
</script>
