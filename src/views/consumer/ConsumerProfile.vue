<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <div class="mx-auto max-w-lg px-4 py-12 sm:px-6">

      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Your profile</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Update your name, email, and password</p>
      </div>

      <!-- Personal info -->
      <div class="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 space-y-4">
        <h2 class="text-sm font-semibold text-gray-900 dark:text-white">Personal info</h2>

        <div>
          <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Name</label>
          <input
            v-model="form.name"
            type="text"
            class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <p v-if="errors.name" class="mt-1 text-xs text-red-500">{{ errors.name }}</p>
        </div>

        <div>
          <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Email</label>
          <input
            v-model="form.email"
            type="email"
            class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <p v-if="errors.email" class="mt-1 text-xs text-red-500">{{ errors.email }}</p>
        </div>

        <div>
          <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Current password</label>
          <input
            v-model="form.current_password"
            type="password"
            autocomplete="current-password"
            class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <p class="mt-1 text-xs text-gray-400">Only required when changing your email.</p>
          <p v-if="errors.current_password" class="mt-1 text-xs text-red-500">{{ errors.current_password }}</p>
        </div>

        <div class="flex justify-end pt-1">
          <button
            @click="saveInfo"
            :disabled="savingInfo"
            class="rounded-xl bg-gray-900 dark:bg-white px-4 py-2 text-sm font-semibold text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-100 transition-colors disabled:opacity-50"
          >{{ savingInfo ? 'Saving…' : 'Save' }}</button>
        </div>
      </div>

      <!-- Change password -->
      <div class="mt-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 space-y-4">
        <h2 class="text-sm font-semibold text-gray-900 dark:text-white">Change password</h2>
        <p class="text-xs text-gray-500 dark:text-gray-400">Leave blank to keep your current password.</p>

        <div>
          <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Current password</label>
          <input
            v-model="pwForm.current_password"
            type="password"
            autocomplete="current-password"
            class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <p v-if="errors.current_password" class="mt-1 text-xs text-red-500">{{ errors.current_password }}</p>
        </div>

        <div>
          <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">New password</label>
          <input
            v-model="pwForm.password"
            type="password"
            autocomplete="new-password"
            class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <p v-if="errors.password" class="mt-1 text-xs text-red-500">{{ errors.password }}</p>
        </div>

        <div>
          <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Confirm new password</label>
          <input
            v-model="pwForm.password_confirmation"
            type="password"
            autocomplete="new-password"
            class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div class="flex justify-end pt-1">
          <button
            @click="savePassword"
            :disabled="savingPw || !pwForm.password || !pwForm.current_password"
            class="rounded-xl bg-gray-900 dark:bg-white px-4 py-2 text-sm font-semibold text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-100 transition-colors disabled:opacity-50"
          >{{ savingPw ? 'Updating…' : 'Update password' }}</button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAxios } from '@/composables/request'
import { useConsumerUserStore } from '@/store/consumer/user'
import { useToast } from '@/composables/useToast'

const userStore = useConsumerUserStore()
const toast = useToast()

const form = ref({ name: '', email: '', current_password: '' })
const pwForm = ref({ current_password: '', password: '', password_confirmation: '' })
const errors = ref({})
const savingInfo = ref(false)
const savingPw = ref(false)

onMounted(() => {
  form.value.name  = userStore.name  ?? ''
  form.value.email = userStore.email ?? ''
})

async function saveInfo() {
  savingInfo.value = true
  errors.value = {}
  const res = await useAxios.put('/api/consumer/user', {
    name: form.value.name,
    email: form.value.email,
    current_password: form.value.current_password,
  })
  savingInfo.value = false
  if (res?.data) {
    form.value.current_password = ''
    await userStore.getUser()
    toast.success('Profile updated')
  } else if (res?.response?.status === 422) {
    const errs = res.response.data?.errors ?? {}
    errors.value = Object.fromEntries(Object.entries(errs).map(([k, v]) => [k, v[0]]))
  } else {
    toast.error('Failed to update profile')
  }
}

async function savePassword() {
  if (!pwForm.value.password) return
  savingPw.value = true
  errors.value = {}
  const res = await useAxios.put('/api/consumer/user', {
    name: form.value.name,
    email: form.value.email,
    current_password: pwForm.value.current_password,
    password: pwForm.value.password,
    password_confirmation: pwForm.value.password_confirmation,
  })
  savingPw.value = false
  if (res?.data) {
    pwForm.value = { current_password: '', password: '', password_confirmation: '' }
    toast.success('Password updated')
  } else if (res?.response?.status === 422) {
    const errs = res.response.data?.errors ?? {}
    errors.value = Object.fromEntries(Object.entries(errs).map(([k, v]) => [k, v[0]]))
  } else {
    toast.error('Failed to update password')
  }
}
</script>
