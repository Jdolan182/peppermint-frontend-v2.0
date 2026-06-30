<script setup>
import SignInForm from '@/components/forms/SignInForm.vue'
import { useAxios } from "@/composables/request.js";
import { useUserStore } from "@/store/admin/user";
import { useRouter } from "vue-router";

const adminName = import.meta.env.VITE_MODULE_ADMIN_NAME

const userStore = useUserStore();
const router = useRouter();

const login = async ({ params, form }) => {
  try {
    await useAxios.get('sanctum/csrf-cookie')
    const res = await useAxios.post('/api/admin/auth/login', params, form)

    if (res?.status === 401) {
      form.value.login.error = true
      form.value.login.errorMessage = 'Invalid credentials'
      return
    }

    if (res?.status === 200) {
      userStore.setUser(res.data.user)
      router.push({ name: 'Dashboard' })
      return
    }

    form.value.login.error = true
    form.value.login.errorMessage = 'An error has occurred'
  } catch (e) {
    form.value.login.error = true
    form.value.login.errorMessage = 'An error has occurred'
  }
};
</script>

<template>
  <div class="min-h-screen flex">
    <!-- Left branding panel -->
    <div class="hidden lg:flex lg:w-1/2 flex-col items-center justify-center bg-indigo-600 px-12 text-white">
      <div class="max-w-md">
        <div class="flex items-center gap-3 mb-8">
          <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <span class="text-white font-bold text-lg">P</span>
          </div>
          <span class="text-2xl font-bold">{{ adminName }}</span>
        </div>
        <h1 class="text-4xl font-bold leading-tight">
          Manage your content with confidence
        </h1>
        <p class="mt-4 text-indigo-200 text-lg leading-relaxed">
          A powerful CMS built for modern teams. Simple to use, flexible enough to scale.
        </p>
        <div class="mt-10 flex flex-col gap-3">
          <div class="flex items-center gap-3 text-indigo-100">
            <div class="w-5 h-5 rounded-full bg-indigo-400 flex items-center justify-center flex-shrink-0">
              <svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
            </div>
            <span class="text-sm">Full content management</span>
          </div>
          <div class="flex items-center gap-3 text-indigo-100">
            <div class="w-5 h-5 rounded-full bg-indigo-400 flex items-center justify-center flex-shrink-0">
              <svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
            </div>
            <span class="text-sm">Separate admin & consumer auth</span>
          </div>
          <div class="flex items-center gap-3 text-indigo-100">
            <div class="w-5 h-5 rounded-full bg-indigo-400 flex items-center justify-center flex-shrink-0">
              <svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
            </div>
            <span class="text-sm">Modular & extensible</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Right form panel -->
    <div class="flex flex-1 flex-col items-center justify-center bg-white dark:bg-gray-900 px-8 py-12 transition-colors duration-200">
      <div class="w-full max-w-sm">
        <!-- Mobile logo -->
        <div class="flex items-center gap-2 mb-10 lg:hidden">
          <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-sm">P</span>
          </div>
          <span class="text-xl font-bold text-gray-900 dark:text-white">{{ adminName }}</span>
        </div>

        <SignInForm :title="`Sign in to ${adminName}`" @login="login" />
      </div>
    </div>
  </div>
</template>
