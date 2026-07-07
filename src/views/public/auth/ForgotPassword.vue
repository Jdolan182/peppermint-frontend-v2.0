<script setup>
import { ref } from 'vue'
import { useAxios } from '@/composables/request.js'
import { usePublicModules } from '@/composables/publicModules.js'

const { siteName } = usePublicModules()

const email = ref('')
const loading = ref(false)
const sent = ref(false)
const error = ref('')

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await useAxios.post('/api/consumer/auth/forgot-password', { email: email.value })
    sent.value = true
  } catch {
    error.value = 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-white px-4">
    <div class="w-full max-w-sm">
      <div class="flex items-center gap-2 mb-8">
        <div class="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
          <span class="text-white font-bold text-sm">P</span>
        </div>
        <span class="text-xl font-bold text-gray-900">{{ siteName }}</span>
      </div>

      <template v-if="sent">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Check your email</h1>
        <p class="text-gray-500 mb-6">If that email is registered, a reset link has been sent.</p>
        <RouterLink to="/login" class="text-emerald-600 text-sm hover:underline">Back to sign in</RouterLink>
      </template>

      <template v-else>
        <h1 class="text-2xl font-bold text-gray-900 mb-1">Reset your password</h1>
        <p class="text-gray-500 text-sm mb-6">Enter your email and we'll send you a reset link.</p>

        <form @submit.prevent="submit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              v-model="email"
              type="email"
              required
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="you@example.com"
            />
          </div>

          <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-emerald-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-emerald-700 disabled:opacity-50"
          >
            {{ loading ? 'Sending...' : 'Send reset link' }}
          </button>
        </form>

        <p class="mt-4 text-center text-sm text-gray-500">
          <RouterLink to="/login" class="text-emerald-600 hover:underline">Back to sign in</RouterLink>
        </p>
      </template>
    </div>
  </div>
</template>
