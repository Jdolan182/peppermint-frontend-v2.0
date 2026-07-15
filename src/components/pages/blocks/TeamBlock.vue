<template>
  <section class="py-20 px-6 bg-white dark:bg-gray-900">
    <div class="max-w-5xl mx-auto">
      <div v-if="data.heading || data.subheading" class="text-center mb-14">
        <h2 v-if="data.heading" class="text-3xl font-bold text-gray-900 dark:text-white">{{ data.heading }}</h2>
        <p v-if="data.subheading" class="mt-3 text-gray-500 dark:text-gray-400">{{ data.subheading }}</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="(member, i) in (data.members ?? [])" :key="i" class="text-center">
          <img
            v-if="member.image"
            :src="resolveUrl(member.image)"
            :alt="member.name"
            class="w-24 h-24 rounded-full object-cover mx-auto mb-4"
          />
          <div
            v-else
            class="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4"
          >
            <span class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{{ member.name?.[0]?.toUpperCase() }}</span>
          </div>
          <h3 class="text-base font-semibold text-gray-900 dark:text-white">{{ member.name }}</h3>
          <p v-if="member.role" class="text-sm text-emerald-600 dark:text-emerald-400 mt-0.5">{{ member.role }}</p>
          <p v-if="member.bio" class="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{{ member.bio }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { config } from '@/config'
defineProps({ data: { type: Object, default: () => ({}) } })

const apiOrigin = config.apiUrl
function resolveUrl(url) {
  if (!url) return url
  return url.startsWith('/') ? apiOrigin + url : url
}
</script>
