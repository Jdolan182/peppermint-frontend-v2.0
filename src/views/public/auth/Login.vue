<script setup>
import SignInForm from '@/components/forms/SignInForm.vue'
import { useAxios } from '@/composables/request.js'
import { useConsumerUserStore } from '@/store/consumer/user'
import { useRouter } from 'vue-router'
import { usePublicModules } from '@/composables/publicModules.js'
import { config } from '@/config'

const { siteName } = usePublicModules()

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
        <RouterLink to="/" class="flex items-center gap-3 mb-8 w-fit">
          <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <span class="text-white font-bold text-lg">{{ siteName[0]?.toUpperCase() }}</span>
          </div>
          <span class="text-2xl font-bold">{{ siteName }}</span>
        </RouterLink>
        <h1 class="text-4xl font-bold leading-tight">
          Welcome back
        </h1>
        <p class="mt-4 text-emerald-100 text-lg leading-relaxed">
          Sign in to access your account and see your tasks.
        </p>
      </div>
    </div>

    <!-- Right form panel -->
    <div class="flex flex-1 flex-col items-center justify-center bg-white dark:bg-gray-900 px-8 py-12">
      <div class="w-full max-w-sm">
        <!-- Mobile logo -->
        <RouterLink to="/" class="flex items-center gap-2 mb-10 lg:hidden w-fit">
          <div class="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-sm">{{ siteName[0]?.toUpperCase() }}</span>
          </div>
          <span class="text-xl font-bold text-gray-900 dark:text-white">{{ siteName }}</span>
        </RouterLink>

        <SignInForm :title="`Sign in to ${siteName}`" @login="login" />

        <p class="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <RouterLink to="/forgot-password" class="text-emerald-600 dark:text-emerald-400 hover:underline">Forgot password?</RouterLink>
        </p>

        <div v-if="config.demoMode" class="mt-6 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
          <p class="font-medium text-gray-700 dark:text-gray-200 mb-1">Try the demo</p>
          <p>Email: <span class="font-mono text-gray-900 dark:text-white">demo@example.com</span></p>
          <p>Password: <span class="font-mono text-gray-900 dark:text-white">password</span></p>
        </div>
      </div>
    </div>
  </div>
</template>
