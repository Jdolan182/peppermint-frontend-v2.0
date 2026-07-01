<template>
  <div>
    <h3 v-if="data.heading" class="text-sm font-semibold text-white mb-4">{{ data.heading }}</h3>
    <ul class="space-y-2">
      <li v-for="(link, i) in (data.links ?? [])" :key="i">
        <a :href="link.url || '#'" class="text-sm text-gray-400 hover:text-white transition-colors">{{ link.label }}</a>
      </li>
    </ul>
  </div>
</template>

<script setup>
defineProps({ data: { type: Object, default: () => ({}) } })
</script>
