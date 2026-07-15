<template>
  <div>
    <h3 v-if="data.heading" class="text-sm font-semibold text-white mb-3">{{ data.heading }}</h3>
    <form class="flex gap-2" @submit.prevent>
      <input
        type="email"
        :placeholder="data.placeholder || 'Enter your email'"
        class="flex-1 min-w-0 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />
      <button
        type="submit"
        class="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors"
      >{{ data.button_label || 'Subscribe' }}</button>
    </form>
  </div>
</template>

<script setup>
defineProps({ data: { type: Object, default: () => ({}) } })
</script>
