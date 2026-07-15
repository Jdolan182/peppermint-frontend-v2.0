<template>
  <div class="min-h-screen bg-gray-50 flex flex-col px-4">
    <div class="flex-1 flex items-center justify-center">
      <div class="text-center max-w-sm w-full">
        <div class="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
          <span class="text-white font-bold text-xl">{{ initial }}</span>
        </div>
        <h1 class="mt-6 text-2xl font-bold text-gray-900">{{ siteName }}</h1>
        <p class="mt-3 text-gray-500">{{ maintenanceMessage }}</p>
      </div>
    </div>

    <form v-if="showBypass" class="pb-8 w-full max-w-xs mx-auto" @submit.prevent="attemptBypass">
      <div class="flex gap-2">
        <input
          v-model="password"
          type="password"
          placeholder="Staff access"
          class="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button
          type="submit"
          class="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
        >
          Go
        </button>
      </div>
      <p v-if="error" class="mt-2 text-xs text-red-500 text-center">Incorrect password</p>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePublicModules } from '@/composables/publicModules'
import { useAxios } from '@/composables/request'
import { config } from '@/config'

const { siteName, maintenanceMessage, fetchPublicModules } = usePublicModules()

onMounted(fetchPublicModules)
const initial = computed(() => siteName.value?.[0]?.toUpperCase() ?? 'P')

const showBypass = config.maintenance.bypass

const router = useRouter()
const password = ref('')
const error = ref(false)

async function attemptBypass() {
  error.value = false
  try {
    const res = await useAxios.post('/api/maintenance/unlock', { password: password.value })
    if (res?.status === 200) {
      localStorage.setItem('pm_bypass_token', res.data.token)
      router.push({ name: 'Home' })
    } else {
      error.value = true
      password.value = ''
    }
  } catch {
    error.value = true
    password.value = ''
  }
}
</script>
