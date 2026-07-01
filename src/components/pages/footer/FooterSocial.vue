<template>
  <div class="flex flex-wrap gap-3">
    <a
      v-for="(item, i) in (data.items ?? [])"
      :key="i"
      :href="item.url || '#'"
      class="text-sm text-gray-400 hover:text-white transition-colors capitalize"
    >{{ item.platform }}</a>
  </div>
</template>

<script setup>
defineProps({ data: { type: Object, default: () => ({}) } })
</script>
