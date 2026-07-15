<template>
  <section class="py-20 px-6 bg-gray-50 dark:bg-gray-800">
    <div class="max-w-5xl mx-auto">
      <div v-if="data.heading || data.subheading" class="text-center mb-12">
        <h2 v-if="data.heading" class="text-3xl font-bold text-gray-900 dark:text-white">{{ data.heading }}</h2>
        <p v-if="data.subheading" class="mt-3 text-base text-gray-500 dark:text-gray-300">{{ data.subheading }}</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(item, i) in (data.items ?? [])"
          :key="i"
          class="rounded-2xl bg-white dark:bg-gray-900 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 p-6 flex flex-col gap-4"
        >
          <p class="text-sm text-gray-600 dark:text-gray-200 leading-relaxed flex-1">"{{ item.quote }}"</p>
          <div class="flex items-center gap-3">
            <img
              v-if="item.image"
              :src="resolveUrl(item.image)"
              :alt="item.author"
              class="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
            <div v-else class="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
              <span class="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{{ item.author?.[0]?.toUpperCase() }}</span>
            </div>
            <div>
              <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ item.author }}</p>
              <p v-if="item.role" class="text-xs text-gray-500 dark:text-gray-400">{{ item.role }}</p>
            </div>
          </div>
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
