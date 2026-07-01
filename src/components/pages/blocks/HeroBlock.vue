<template>
  <section class="relative bg-white dark:bg-gray-900 py-20 px-6 overflow-hidden">
    <div class="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
      <div class="flex-1 min-w-0">
        <h1 v-if="data.heading" class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">{{ data.heading }}</h1>
        <p v-if="data.subheading" class="mt-4 text-lg text-gray-600 dark:text-gray-300">{{ data.subheading }}</p>
        <div v-if="data.body" class="mt-4 prose dark:prose-invert" v-html="data.body" />
        <div v-if="data.cta_primary_label || data.cta_secondary_label" class="mt-8 flex flex-wrap gap-4">
          <SmartLink
            v-if="data.cta_primary_label"
            :href="data.cta_primary_url || '#'"
            class="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
          >{{ data.cta_primary_label }}</SmartLink>
          <SmartLink
            v-if="data.cta_secondary_label"
            :href="data.cta_secondary_url || '#'"
            class="rounded-xl border border-gray-300 dark:border-gray-600 px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >{{ data.cta_secondary_label }}</SmartLink>
        </div>
      </div>
      <div v-if="data.image" class="flex-shrink-0 w-full md:w-96">
        <img :src="data.image" alt="" class="rounded-2xl w-full object-cover shadow-lg" />
      </div>
    </div>
  </section>
</template>

<script setup>
import SmartLink from '@/components/pages/SmartLink.vue'
defineProps({ data: { type: Object, default: () => ({}) } })
</script>
