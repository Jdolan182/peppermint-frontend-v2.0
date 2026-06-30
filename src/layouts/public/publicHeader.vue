<template>
  <header class="bg-white border-b border-gray-100">
    <div class="mx-auto max-w-screen-2xl px-8 lg:px-16 h-16 flex items-center justify-between">
      <router-link :to="{ name: 'Home' }" class="flex items-center gap-2">
        <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <span class="text-white font-bold text-sm">{{ siteName[0]?.toUpperCase() }}</span>
        </div>
        <span class="text-lg font-bold text-gray-900">{{ siteName }}</span>
      </router-link>

      <nav class="flex items-center gap-6">
        <router-link
          v-if="blogsEnabled"
          :to="{ name: 'PublicBlogs' }"
          class="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          Blog
        </router-link>

        <div class="flex items-center gap-4">
        <template v-if="consumerAuth.getIsLoggedIn">
          <span class="text-sm text-gray-500">{{ userStore.getName }}</span>
          <button
            @click="consumerAuth.logout()"
            class="rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-gray-300 hover:bg-gray-50 transition-colors"
          >
            Sign out
          </button>
        </template>
        <template v-else-if="publicLoginEnabled">
          <router-link :to="{ name: 'ConsumerLogin' }" class="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            Sign in
          </router-link>
          <router-link :to="{ name: 'ConsumerLogin' }" class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors">
            Get started
          </router-link>
        </template>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useConsumerAuthStore } from '@/store/consumer/auth'
import { useConsumerUserStore } from '@/store/consumer/user'
import { usePublicModules } from '@/composables/publicModules'

const consumerAuth = useConsumerAuthStore()
const userStore = useConsumerUserStore()

const { isPublicModuleEnabled, siteName } = usePublicModules()
const blogsEnabled = computed(() => isPublicModuleEnabled('blogs'))
const publicLoginEnabled = computed(() => isPublicModuleEnabled('public_login'))
</script>
