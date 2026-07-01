<template>
  <section class="py-20 px-6 bg-indigo-600">
    <div class="max-w-xl mx-auto text-center">
      <h2 v-if="data.heading" class="text-3xl font-bold text-white">{{ data.heading }}</h2>
      <p v-if="data.subheading" class="mt-3 text-indigo-100">{{ data.subheading }}</p>
      <form class="mt-8 flex gap-3 max-w-sm mx-auto" @submit.prevent>
        <input
          type="email"
          :placeholder="data.placeholder || 'Enter your email'"
          class="flex-1 rounded-xl bg-white border-0 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-white focus:outline-none"
        />
        <button
          type="submit"
          class="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors whitespace-nowrap"
        >{{ data.button_label || 'Subscribe' }}</button>
      </form>
    </div>
  </section>
</template>

<script setup>
defineProps({ data: { type: Object, default: () => ({}) } })
</script>
