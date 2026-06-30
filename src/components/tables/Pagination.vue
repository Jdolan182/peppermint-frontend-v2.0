<template>
  <div v-if="meta && meta.last_page > 1" class="flex items-center justify-between px-1 py-3">
    <p class="text-sm text-gray-500 dark:text-gray-400">
      Showing {{ meta.from }}–{{ meta.to }} of {{ meta.total }}
    </p>
    <div class="flex items-center gap-1">
      <button
        class="px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        :disabled="meta.current_page === 1"
        @click="$emit('change', meta.current_page - 1)"
      >
        Previous
      </button>
      <button
        v-for="page in pages"
        :key="page"
        class="px-3 py-1.5 text-sm rounded-lg border transition-colors"
        :class="page === meta.current_page
          ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white'
          : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'"
        @click="page !== '…' && $emit('change', page)"
      >
        {{ page }}
      </button>
      <button
        class="px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        :disabled="meta.current_page === meta.last_page"
        @click="$emit('change', meta.current_page + 1)"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  meta: { type: Object, default: null },
})

defineEmits(['change'])

const pages = computed(() => {
  if (!props.meta) return []
  const { current_page: cur, last_page: last } = props.meta
  if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1)
  const pages = new Set([1, last, cur, cur - 1, cur + 1].filter(p => p >= 1 && p <= last))
  const sorted = [...pages].sort((a, b) => a - b)
  const result = []
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) result.push('…')
    result.push(p)
  })
  return result
})
</script>
