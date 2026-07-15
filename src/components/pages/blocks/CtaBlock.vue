<template>
  <section
    class="py-20 px-6"
    :class="data.style === 'light'
      ? 'bg-gray-50 dark:bg-gray-800'
      : 'bg-emerald-900 dark:bg-emerald-950'"
  >
    <div class="max-w-3xl mx-auto text-center">
      <h2
        v-if="data.heading"
        class="text-3xl font-bold"
        :class="data.style === 'light' ? 'text-gray-900 dark:text-white' : 'text-white'"
      >{{ data.heading }}</h2>
      <p
        v-if="data.body"
        class="mt-4 text-base"
        :class="data.style === 'light' ? 'text-gray-600 dark:text-gray-200' : 'text-white/80'"
        v-html="data.body"
      />
      <SmartLink
        v-if="data.cta_label"
        :href="data.cta_url || '#'"
        class="mt-8 inline-block rounded-xl px-8 py-3 text-sm font-semibold transition-colors"
        :class="data.style === 'light'
          ? 'bg-emerald-600 text-white hover:bg-emerald-500'
          : 'bg-white text-emerald-900 hover:bg-emerald-50'"
      >{{ data.cta_label }}</SmartLink>
    </div>
  </section>
</template>

<script setup>
import SmartLink from '@/components/pages/SmartLink.vue'
defineProps({ data: { type: Object, default: () => ({}) } })
</script>
