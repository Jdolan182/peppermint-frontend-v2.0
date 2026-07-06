<template>
  <section class="py-20 px-6 bg-white dark:bg-gray-900">
    <div class="max-w-xl mx-auto">
      <div v-if="data.heading || data.subheading" class="mb-10 text-center">
        <h2 v-if="data.heading" class="text-3xl font-bold text-gray-900 dark:text-white">{{ data.heading }}</h2>
        <p v-if="data.subheading" class="mt-3 text-gray-500 dark:text-gray-400">{{ data.subheading }}</p>
      </div>

      <form v-if="!submitted" @submit.prevent="submit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
          <input v-model="form.name" type="text" required class="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
          <input v-model="form.email" type="email" required class="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
          <textarea v-model="form.message" rows="5" required class="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
        </div>

        <p v-if="error" class="text-sm text-red-500">{{ error }}</p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors disabled:opacity-60"
        >{{ loading ? 'Sending…' : 'Send message' }}</button>
      </form>

      <div v-else class="text-center py-12">
        <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <svg class="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <p class="text-base font-semibold text-gray-900 dark:text-white">Message sent</p>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">We'll be in touch soon.</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useAxios } from '@/composables/request'

defineProps({ data: { type: Object, default: () => ({}) } })

const route = useRoute()
const submitted = ref(false)
const loading = ref(false)
const error = ref(null)
const form = reactive({ name: '', email: '', message: '' })

async function submit() {
  error.value = null
  loading.value = true
  const res = await useAxios.post('/api/public/contact', {
    name: form.name,
    email: form.email,
    message: form.message,
    page_slug: route.params.slug ?? null,
  })
  if (res?.status === 200 || res?.status === 201) {
    submitted.value = true
  } else {
    error.value = res?.response?.data?.message ?? 'Something went wrong. Please try again.'
  }
  loading.value = false
}
</script>
