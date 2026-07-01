<template>
  <section class="py-20 px-6 bg-gray-50 dark:bg-gray-800/50">
    <div class="max-w-5xl mx-auto">
      <div v-if="data.heading || data.subheading" class="text-center mb-14">
        <h2 v-if="data.heading" class="text-3xl font-bold text-gray-900 dark:text-white">{{ data.heading }}</h2>
        <p v-if="data.subheading" class="mt-3 text-gray-500 dark:text-gray-400">{{ data.subheading }}</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="(item, i) in (data.items ?? [])" :key="i" class="flex flex-col gap-3">
          <div v-if="item.icon" class="text-3xl">{{ item.icon }}</div>
          <h3 class="text-base font-semibold text-gray-900 dark:text-white">{{ item.title }}</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{{ item.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({ data: { type: Object, default: () => ({}) } })
</script>
