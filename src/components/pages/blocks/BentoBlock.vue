<template>
  <section class="py-20 px-6 bg-white dark:bg-gray-900">
    <div class="max-w-5xl mx-auto">
      <h2 v-if="data.heading" class="text-3xl font-bold text-gray-900 dark:text-white mb-10 text-center">{{ data.heading }}</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-auto">
        <div
          v-for="(item, i) in (data.items ?? [])"
          :key="i"
          class="rounded-2xl bg-gray-50 dark:bg-gray-800 overflow-hidden flex flex-col"
          :class="{
            'sm:col-span-2': item.size === 'wide',
            'row-span-2': item.size === 'tall',
          }"
        >
          <img v-if="item.image" :src="resolveUrl(item.image)" alt="" class="w-full object-cover" :class="item.size === 'tall' ? 'h-64' : 'h-40'" />
          <div class="p-5 flex-1">
            <h3 class="font-semibold text-gray-900 dark:text-white">{{ item.title }}</h3>
            <p v-if="item.description" class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ item.description }}</p>
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
