<template>
  <div class="flex flex-col gap-3">
    <img v-if="data.logo_image" :src="data.logo_image" alt="" class="h-8 object-contain" />
    <p v-if="data.tagline" class="text-sm text-gray-400">{{ data.tagline }}</p>
    <p v-if="data.copyright" class="text-xs text-gray-500">{{ data.copyright }}</p>
  </div>
</template>

<script setup>
defineProps({ data: { type: Object, default: () => ({}) } })
</script>
