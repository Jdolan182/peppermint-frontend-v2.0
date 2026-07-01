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
        <!-- Dynamic pages nav -->
        <template v-for="page in navPages" :key="page.id">
          <!-- Parent with children → dropdown -->
          <div v-if="page.children?.length" class="relative group">
            <button class="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              {{ page.nav_label || page.title }}
              <svg class="w-3 h-3 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div class="absolute left-0 top-full pt-2 hidden group-hover:block z-50">
              <div class="bg-white rounded-xl shadow-lg ring-1 ring-gray-100 py-1 min-w-40">
                <router-link
                  :to="'/' + page.slug"
                  class="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                >{{ page.nav_label || page.title }}</router-link>
                <div class="border-t border-gray-100 my-1" />
                <router-link
                  v-for="child in page.children"
                  :key="child.id"
                  :to="'/' + child.slug"
                  class="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                >{{ child.nav_label || child.title }}</router-link>
              </div>
            </div>
          </div>

          <!-- Simple link -->
          <router-link
            v-else
            :to="'/' + page.slug"
            class="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >{{ page.nav_label || page.title }}</router-link>
        </template>

        <!-- Static blog link -->
        <router-link
          v-if="blogsEnabled"
          :to="{ name: 'PublicBlogs' }"
          class="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >Blog</router-link>

        <div class="flex items-center gap-4">
          <template v-if="consumerAuth.getIsLoggedIn">
            <span class="text-sm text-gray-500">{{ userStore.getName }}</span>
            <button
              @click="consumerAuth.logout()"
              class="rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-gray-300 hover:bg-gray-50 transition-colors"
            >Sign out</button>
          </template>
          <template v-else-if="publicLoginEnabled">
            <router-link :to="{ name: 'ConsumerLogin' }" class="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Sign in</router-link>
            <router-link :to="{ name: 'ConsumerLogin' }" class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors">Get started</router-link>
          </template>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useConsumerAuthStore } from '@/store/consumer/auth'
import { useConsumerUserStore } from '@/store/consumer/user'
import { usePublicModules } from '@/composables/publicModules'
import { useAxios } from '@/composables/request'

const consumerAuth = useConsumerAuthStore()
const userStore = useConsumerUserStore()

const { isPublicModuleEnabled, siteName } = usePublicModules()
const blogsEnabled = computed(() => isPublicModuleEnabled('blogs'))
const publicLoginEnabled = computed(() => isPublicModuleEnabled('public_login'))

const navPages = ref([])

onMounted(async () => {
  try {
    const res = await useAxios.get('/api/public/pages/nav')
    navPages.value = res?.data ?? []
  } catch {}
})
</script>
