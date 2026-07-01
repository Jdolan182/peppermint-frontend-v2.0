<template>
  <section class="py-16 px-6 bg-white dark:bg-gray-900">
    <div class="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
      <div v-for="(item, i) in (data.items ?? [])" :key="i" class="text-center">
        <div class="text-4xl font-bold text-indigo-600 dark:text-indigo-400">{{ item.value }}</div>
        <div class="mt-1 text-sm font-semibold text-gray-900 dark:text-white">{{ item.label }}</div>
        <div v-if="item.description" class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{ item.description }}</div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({ data: { type: Object, default: () => ({}) } })
</script>
