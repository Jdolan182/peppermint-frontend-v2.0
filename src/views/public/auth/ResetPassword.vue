<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAxios } from '@/composables/request.js'
import { usePublicModules } from '@/composables/publicModules.js'

const { siteName } = usePublicModules()
const route = useRoute()
const router = useRouter()

const password = ref('')
const passwordConfirmation = ref('')
const loading = ref(false)
const done = ref(false)
const error = ref('')

const token = ref('')
const email = ref('')

onMounted(() => {
  token.value = route.query.token ?? ''
  email.value = route.query.email ?? ''
  if (!token.value || !email.value) {
    error.value = 'Invalid or missing reset link.'
  }
})

async function submit() {
  error.value = ''
  if (password.value !== passwordConfirmation.value) {
    error.value = 'Passwords do not match.'
    return
  }
  loading.value = true
  try {
    const res = await useAxios.post('/api/consumer/auth/reset-password', {
      token: token.value,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
    })
    if (res?.status === 200) {
      done.value = true
    } else {
      error.value = res?.data?.message ?? 'This reset link is invalid or has expired.'
    }
  } catch (e) {
    error.value = e?.response?.data?.message ?? 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 px-4">
    <div class="w-full max-w-sm">
      <RouterLink to="/" class="flex items-center gap-2 mb-8 w-fit">
        <div class="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
          <span class="text-white font-bold text-sm">{{ siteName[0]?.toUpperCase() }}</span>
        </div>
        <span class="text-xl font-bold text-gray-900 dark:text-white">{{ siteName }}</span>
      </RouterLink>

      <template v-if="done">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Password updated</h1>
        <p class="text-gray-500 dark:text-gray-400 mb-6">Your password has been reset successfully.</p>
        <RouterLink to="/login" class="text-emerald-600 dark:text-emerald-400 text-sm hover:underline">Sign in</RouterLink>
      </template>

      <template v-else>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">Set a new password</h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm mb-6">Choose a strong password for your account.</p>

        <form @submit.prevent="submit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">New password</label>
            <input
              v-model="password"
              type="password"
              required
              minlength="8"
              class="w-full border border-gray-300 dark:border-gray-600 dark:bg-white/5 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Min. 8 characters"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Confirm password</label>
            <input
              v-model="passwordConfirmation"
              type="password"
              required
              class="w-full border border-gray-300 dark:border-gray-600 dark:bg-white/5 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Repeat your password"
            />
          </div>

          <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>

          <button
            type="submit"
            :disabled="loading || !token || !email"
            class="w-full bg-emerald-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-emerald-700 disabled:opacity-50"
          >
            {{ loading ? 'Saving...' : 'Reset password' }}
          </button>
        </form>

        <p class="mt-4 text-center text-sm text-gray-500">
          <RouterLink to="/login" class="text-emerald-600 hover:underline">Back to sign in</RouterLink>
        </p>
      </template>
    </div>
  </div>
</template>
