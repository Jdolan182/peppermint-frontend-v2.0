<script setup>
import SignInForm from '@/components/forms/SignInForm.vue'
import { useAxios } from '@/composables/request.js'
import { useConsumerUserStore } from '@/store/consumer/user'
import { useRouter } from 'vue-router'

const adminName = import.meta.env.VITE_MODULE_ADMIN_NAME

const userStore = useConsumerUserStore()
const router = useRouter()

const login = async ({ params, form }) => {
  try {
    await useAxios.get('sanctum/csrf-cookie')
    const res = await useAxios.post('/api/consumer/auth/login', params, form)

    if (res?.status === 401) {
      form.value.login.error = true
      form.value.login.errorMessage = 'Invalid credentials'
      return
    }

    if (res?.status === 200) {
      userStore.setUser(res.data.user)
      router.push({ name: 'Home' })
      return
    }

    form.value.login.error = true
    form.value.login.errorMessage = 'An error has occurred'
  } catch (e) {
    form.value.login.error = true
    form.value.login.errorMessage = 'An error has occurred'
  }
}
</script>

<template>
  <div class="min-h-screen flex">
    <!-- Left branding panel -->
    <div class="hidden lg:flex lg:w-1/2 flex-col items-center justify-center bg-emerald-600 px-12 text-white">
      <div class="max-w-md">
        <div class="flex items-center gap-3 mb-8">
          <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <span class="text-white font-bold text-lg">P</span>
          </div>
          <span class="text-2xl font-bold">{{ adminName }}</span>
        </div>
        <h1 class="text-4xl font-bold leading-tight">
          Welcome back
        </h1>
        <p class="mt-4 text-emerald-100 text-lg leading-relaxed">
          Sign in to access your account and see your tasks.
        </p>
      </div>
    </div>

    <!-- Right form panel -->
    <div class="flex flex-1 flex-col items-center justify-center bg-white px-8 py-12">
      <div class="w-full max-w-sm">
        <!-- Mobile logo -->
        <div class="flex items-center gap-2 mb-10 lg:hidden">
          <div class="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-sm">P</span>
          </div>
          <span class="text-xl font-bold text-gray-900">{{ adminName }}</span>
        </div>

        <SignInForm :title="`Sign in to ${adminName}`" @login="login" />

        <div class="mt-6 rounded-lg bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-gray-600">
          <p class="font-medium text-gray-700 mb-1">Try the demo</p>
          <p>Email: <span class="font-mono text-gray-900">demo@example.com</span></p>
          <p>Password: <span class="font-mono text-gray-900">password</span></p>
        </div>
      </div>
    </div>
  </div>
</template>
