<template>
  <section class="py-16 px-6 bg-gray-50 dark:bg-gray-800/50">
    <div class="max-w-5xl mx-auto">
      <p v-if="data.heading" class="text-center text-sm font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-8">{{ data.heading }}</p>
      <div class="flex flex-wrap items-center justify-center gap-8">
        <div
          v-for="(logo, i) in (data.logos ?? [])"
          :key="i"
          class="opacity-60 hover:opacity-100 transition-opacity"
        >
          <img v-if="logo.image" :src="resolveUrl(logo.image)" :alt="logo.name" class="h-8 object-contain" />
          <span v-else class="text-sm font-semibold text-gray-500 dark:text-gray-400">{{ logo.name }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { config } from '@/config'
defineProps({ data: { type: Object, default: () => ({}) } })
const apiOrigin = config.apiUrl
function resolveUrl(url) { return url?.startsWith('/') ? apiOrigin + url : url }
</script>
