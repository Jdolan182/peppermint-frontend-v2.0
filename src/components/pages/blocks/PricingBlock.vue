<template>
  <section class="py-20 px-6 bg-gray-50 dark:bg-gray-800">
    <div class="max-w-5xl mx-auto">
      <h2 v-if="data.heading" class="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">{{ data.heading }}</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(plan, i) in (data.plans ?? [])"
          :key="i"
          class="rounded-2xl bg-white dark:bg-gray-900 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 p-8 flex flex-col"
        >
          <div>
            <h3 class="text-base font-semibold text-gray-900 dark:text-white">{{ plan.name }}</h3>
            <div class="mt-4 flex items-baseline gap-1">
              <span class="text-4xl font-bold text-gray-900 dark:text-white">{{ plan.price }}</span>
              <span v-if="plan.period" class="text-sm text-gray-500 dark:text-gray-400">{{ plan.period }}</span>
            </div>
          </div>
          <ul class="mt-8 space-y-3 flex-1">
            <li
              v-for="(feature, j) in parseFeatures(plan.features)"
              :key="j"
              class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-200"
            >
              <span class="text-green-500 flex-shrink-0">✓</span>
              {{ feature }}
            </li>
          </ul>
          <SmartLink
            v-if="plan.cta"
            :href="plan.cta_url || '#'"
            class="mt-8 block rounded-xl bg-emerald-600 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-emerald-500 transition-colors"
          >{{ plan.cta }}</SmartLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import SmartLink from '@/components/pages/SmartLink.vue'
defineProps({ data: { type: Object, default: () => ({}) } })

function parseFeatures(raw) {
  if (!raw) return []
  if (Array.isArray(raw)) return raw
  return String(raw).split('\n').map(s => s.trim()).filter(Boolean)
}
</script>
