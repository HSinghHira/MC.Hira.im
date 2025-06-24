<template>
  <article class="bg-gray-800 border border-gray-700 rounded-xl">
    <div class="flex items-center gap-4 it">
      <Avatar
        :image="profile.avatar"
        shape="circle"
        class="size-16 object-cover"
      />
      <h3 class="font-medium text-white text-lg">{{ profile.name }}</h3>
      <div>
        
        
      </div>
    </div>
  </article>
</template>

<script setup>
const props = defineProps({
  profile: {
    type: Object,
    required: true,
    default: () => ({
      name: '',
      username: '',
      githubUrl: '',
      avatar: '',
      description: ''
    })
  }
})
</script>

<style scoped>
/* Ensure flow-root works as expected */
.flow-root {
  display: flow-root;
}
</style>