<template>
  <div>
    <Galleria :value="images" :numVisible="5" containerStyle="max-width: 640px">
      <template #item="slotProps">
        <img :src="slotProps.item.itemImageSrc" :alt="slotProps.item.alt" style="width: 100%; display: block" />
      </template>
      <template #thumbnail="slotProps">
        <img :src="slotProps.item.thumbnailImageSrc" :alt="slotProps.item.alt" style="width: 100%; display: block" />
      </template>
    </Galleria>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Galleria from 'primevue/galleria';

// Our list of pictures (like toys in a box)
const images = ref([
  {
    itemImageSrc: 'https://via.placeholder.com/600x400/FF0000/FFFFFF?text=Picture+1',
    thumbnailImageSrc: 'https://via.placeholder.com/100x100/FF0000/FFFFFF?text=Thumb+1',
    alt: 'Red Picture'
  },
  {
    itemImageSrc: 'https://via.placeholder.com/600x400/00FF00/FFFFFF?text=Picture+2',
    thumbnailImageSrc: 'https://via.placeholder.com/100x100/00FF00/FFFFFF?text=Thumb+2',
    alt: 'Green Picture'
  },
  {
    itemImageSrc: 'https://via.placeholder.com/600x400/0000FF/FFFFFF?text=Picture+3',
    thumbnailImageSrc: 'https://via.placeholder.com/100x100/0000FF/FFFFFF?text=Thumb+3',
    alt: 'Blue Picture'
  }
]);
</script>

<style>
@import 'primeicons/primeicons.css';
</style>