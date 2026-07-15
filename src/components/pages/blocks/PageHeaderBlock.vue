<template>
  <section class="bg-gray-50 dark:bg-gray-800 py-14 px-6">
    <div class="max-w-5xl mx-auto">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white">{{ data.heading }}</h1>
      <p v-if="data.subheading" class="mt-3 text-lg text-gray-500 dark:text-gray-300">{{ data.subheading }}</p>
    </div>
  </section>
</template>

<script setup>
defineProps({ data: { type: Object, default: () => ({}) } })
</script>
