<template>
  <div class="max-w-xl">
    <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Your profile</h1>
    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Update your name, email, and password</p>

    <!-- Personal info -->
    <div class="mt-8 rounded-xl bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 p-6 space-y-4">
      <h2 class="text-sm font-semibold text-gray-900 dark:text-white">Personal info</h2>

      <div>
        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Name</label>
        <input
          v-model="form.name"
          type="text"
          class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <p v-if="errors.name" class="mt-1 text-xs text-red-500">{{ errors.name }}</p>
      </div>

      <div>
        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Email</label>
        <input
          v-model="form.email"
          type="email"
          class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <p v-if="errors.email" class="mt-1 text-xs text-red-500">{{ errors.email }}</p>
      </div>

      <div class="flex justify-end pt-1">
        <button
          @click="saveInfo"
          :disabled="savingInfo"
          class="rounded-lg bg-gray-900 dark:bg-white px-4 py-2 text-sm font-semibold text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-100 transition-colors disabled:opacity-50"
        >{{ savingInfo ? 'Saving…' : 'Save' }}</button>
      </div>
    </div>

    <!-- Notifications -->
    <div class="mt-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 p-6">
      <h2 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">Notifications</h2>
      <label class="flex items-center justify-between cursor-pointer gap-4">
        <div>
          <p class="text-sm text-gray-900 dark:text-white font-medium">Contact form submissions</p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Receive an email when someone submits the contact form</p>
        </div>
        <button
          type="button"
          role="switch"
          :aria-checked="notifyContact"
          @click="toggleNotifyContact"
          class="relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          :class="notifyContact ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-600'"
        >
          <span
            class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200"
            :class="notifyContact ? 'translate-x-5' : 'translate-x-0'"
          />
        </button>
      </label>
    </div>

    <!-- Change password -->
    <div class="mt-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 p-6 space-y-4">
      <h2 class="text-sm font-semibold text-gray-900 dark:text-white">Change password</h2>
      <p class="text-xs text-gray-500 dark:text-gray-400">Leave blank to keep your current password.</p>

      <div>
        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">New password</label>
        <input
          v-model="pwForm.password"
          type="password"
          autocomplete="new-password"
          class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <p v-if="errors.password" class="mt-1 text-xs text-red-500">{{ errors.password }}</p>
      </div>

      <div>
        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Confirm new password</label>
        <input
          v-model="pwForm.password_confirmation"
          type="password"
          autocomplete="new-password"
          class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div class="flex justify-end pt-1">
        <button
          @click="savePassword"
          :disabled="savingPw || !pwForm.password"
          class="rounded-lg bg-gray-900 dark:bg-white px-4 py-2 text-sm font-semibold text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-100 transition-colors disabled:opacity-50"
        >{{ savingPw ? 'Updating…' : 'Update password' }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAxios } from '@/composables/request'
import { useUserStore } from '@/store/admin/user'
import { useToast } from '@/composables/useToast'

const userStore = useUserStore()
const toast = useToast()

const form = ref({ name: '', email: '' })
const pwForm = ref({ password: '', password_confirmation: '' })
const errors = ref({})
const savingInfo = ref(false)
const savingPw = ref(false)
const notifyContact = ref(false)

onMounted(async () => {
  form.value.name  = userStore.name  ?? ''
  form.value.email = userStore.email ?? ''
  const res = await useAxios.get('/api/admin/user')
  notifyContact.value = res?.data?.data?.notify_contact ?? false
})

async function saveInfo() {
  savingInfo.value = true
  errors.value = {}
  const res = await useAxios.put('/api/admin/user', { name: form.value.name, email: form.value.email })
  savingInfo.value = false
  if (res?.data) {
    await userStore.getUser()
    toast.success('Profile updated')
  } else if (res?.response?.status === 422) {
    const errs = res.response.data?.errors ?? {}
    errors.value = Object.fromEntries(Object.entries(errs).map(([k, v]) => [k, v[0]]))
  } else {
    toast.error('Failed to update profile')
  }
}

async function toggleNotifyContact() {
  notifyContact.value = !notifyContact.value
  const res = await useAxios.put('/api/admin/user', {
    name: form.value.name,
    email: form.value.email,
    notify_contact: notifyContact.value,
  })
  if (!res?.data) {
    notifyContact.value = !notifyContact.value
    toast.error('Failed to update notification preference')
  }
}

async function savePassword() {
  if (!pwForm.value.password) return
  savingPw.value = true
  errors.value = {}
  const res = await useAxios.put('/api/admin/user', {
    name: form.value.name,
    email: form.value.email,
    password: pwForm.value.password,
    password_confirmation: pwForm.value.password_confirmation,
  })
  savingPw.value = false
  if (res?.data) {
    pwForm.value = { password: '', password_confirmation: '' }
    toast.success('Password updated')
  } else if (res?.response?.status === 422) {
    const errs = res.response.data?.errors ?? {}
    errors.value = Object.fromEntries(Object.entries(errs).map(([k, v]) => [k, v[0]]))
  } else {
    toast.error('Failed to update password')
  }
}
</script>
