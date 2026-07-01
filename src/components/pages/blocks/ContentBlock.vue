<template>
  <section class="py-16 px-6 bg-white dark:bg-gray-900">
    <div class="max-w-3xl mx-auto prose dark:prose-invert prose-indigo" v-html="data.body" />
  </section>
</template>

<script setup>
defineProps({ data: { type: Object, default: () => ({}) } })
</script>
