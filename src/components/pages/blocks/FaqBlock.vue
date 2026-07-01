<template>
  <section class="py-20 px-6 bg-white dark:bg-gray-900">
    <div class="max-w-3xl mx-auto">
      <h2 v-if="data.heading" class="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">{{ data.heading }}</h2>
      <div class="space-y-0 divide-y divide-gray-100 dark:divide-gray-800">
        <div v-for="(item, i) in (data.items ?? [])" :key="i">
          <button
            class="flex w-full items-center justify-between py-5 text-left"
            @click="open === i ? (open = null) : (open = i)"
          >
            <span class="text-base font-medium text-gray-900 dark:text-white">{{ item.question }}</span>
            <span class="ml-4 flex-shrink-0 text-gray-400 transition-transform" :class="open === i ? 'rotate-180' : ''">▾</span>
          </button>
          <div v-if="open === i" class="pb-5 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            {{ item.answer }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
defineProps({ data: { type: Object, default: () => ({}) } })
const open = ref(null)
</script>
