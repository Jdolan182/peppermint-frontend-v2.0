<template>
  <header class="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
    <div class="mx-auto max-w-screen-2xl px-6 lg:px-16 h-16 flex items-center justify-between">
      <router-link :to="{ name: 'Home' }" class="flex items-center gap-2">
        <div class="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
          <span class="text-white font-bold text-sm">{{ siteName[0]?.toUpperCase() }}</span>
        </div>
        <span class="text-lg font-bold text-gray-900 dark:text-white">{{ siteName }}</span>
      </router-link>

      <!-- Desktop nav -->
      <nav class="hidden lg:flex items-center gap-6">
        <!-- Dynamic pages nav -->
        <template v-for="page in navPages" :key="page.id">
          <!-- Parent with children → dropdown -->
          <div v-if="page.children?.length" class="relative group">
            <button class="flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
              {{ page.nav_label || page.title }}
              <svg class="w-3 h-3 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div class="absolute left-0 top-full pt-2 hidden group-hover:block z-50">
              <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg ring-1 ring-gray-100 dark:ring-gray-700 py-1 min-w-40">
                <router-link
                  :to="'/' + page.slug"
                  class="block px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >{{ page.nav_label || page.title }}</router-link>
                <div class="border-t border-gray-100 dark:border-gray-700 my-1" />
                <router-link
                  v-for="child in page.children"
                  :key="child.id"
                  :to="'/' + child.slug"
                  class="block px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >{{ child.nav_label || child.title }}</router-link>
              </div>
            </div>
          </div>

          <!-- Simple link -->
          <router-link
            v-else
            :to="'/' + page.slug"
            class="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >{{ page.nav_label || page.title }}</router-link>
        </template>

        <!-- Static blog link -->
        <router-link
          v-if="blogsEnabled"
          :to="{ name: 'PublicBlogs' }"
          class="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
        >Blog</router-link>

        <!-- Roadmap link -->
        <router-link
          v-if="roadmapEnabled"
          :to="{ name: 'PublicRoadmap' }"
          class="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
        >Roadmap</router-link>

        <div class="flex items-center gap-4">
          <template v-if="consumerAuth.getIsLoggedIn">
            <router-link
              v-if="tasksEnabled"
              :to="{ name: 'ConsumerTasks' }"
              class="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >My Tasks</router-link>
            <router-link
              v-if="tasksEnabled"
              :to="{ name: 'ConsumerCalendar' }"
              class="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >Calendar</router-link>
            <router-link
              :to="{ name: 'ConsumerProfile' }"
              class="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >Profile</router-link>
            <button
              @click="consumerAuth.logout()"
              class="rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 ring-1 ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >Sign out</button>
          </template>
          <template v-else-if="publicLoginEnabled">
            <router-link :to="{ name: 'ConsumerLogin' }" class="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Sign in</router-link>
          </template>

          <!-- Dark mode toggle -->
          <button
            @click="themeStore.toggle()"
            class="rounded-lg p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            :title="themeStore.isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            <SunIcon v-if="themeStore.isDark" class="w-5 h-5" />
            <MoonIcon v-else class="w-5 h-5" />
          </button>
        </div>
      </nav>

      <!-- Mobile controls -->
      <div class="flex items-center gap-1 lg:hidden">
        <button
          @click="themeStore.toggle()"
          class="rounded-lg p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          <SunIcon v-if="themeStore.isDark" class="w-5 h-5" />
          <MoonIcon v-else class="w-5 h-5" />
        </button>
        <button
          @click="mobileOpen = !mobileOpen"
          class="rounded-lg p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
          aria-label="Menu"
        >
          <XMarkIcon v-if="mobileOpen" class="w-6 h-6" />
          <Bars3Icon v-else class="w-6 h-6" />
        </button>
      </div>
    </div>

    <!-- Mobile menu panel -->
    <div v-if="mobileOpen" class="lg:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
      <nav class="px-4 py-3 space-y-1">
        <template v-for="page in navPages" :key="page.id">
          <!-- Parent with children → accordion -->
          <div v-if="page.children?.length">
            <button
              @click="expanded = expanded === page.id ? null : page.id"
              class="w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              {{ page.nav_label || page.title }}
              <svg
                class="w-4 h-4 text-gray-400 transition-transform"
                :class="expanded === page.id ? 'rotate-180' : ''"
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              ><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
            </button>
            <div v-if="expanded === page.id" class="ml-3 border-l border-gray-100 dark:border-gray-800 pl-2 space-y-1">
              <router-link
                :to="'/' + page.slug"
                class="block rounded-lg px-3 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >{{ page.nav_label || page.title }}</router-link>
              <router-link
                v-for="child in page.children"
                :key="child.id"
                :to="'/' + child.slug"
                class="block rounded-lg px-3 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >{{ child.nav_label || child.title }}</router-link>
            </div>
          </div>

          <!-- Simple link -->
          <router-link
            v-else
            :to="'/' + page.slug"
            class="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >{{ page.nav_label || page.title }}</router-link>
        </template>

        <router-link
          v-if="blogsEnabled"
          :to="{ name: 'PublicBlogs' }"
          class="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >Blog</router-link>
        <router-link
          v-if="roadmapEnabled"
          :to="{ name: 'PublicRoadmap' }"
          class="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >Roadmap</router-link>

        <div class="border-t border-gray-100 dark:border-gray-800 my-2" />

        <template v-if="consumerAuth.getIsLoggedIn">
          <router-link
            v-if="tasksEnabled"
            :to="{ name: 'ConsumerTasks' }"
            class="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >My Tasks</router-link>
          <router-link
            v-if="tasksEnabled"
            :to="{ name: 'ConsumerCalendar' }"
            class="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >Calendar</router-link>
          <router-link
            :to="{ name: 'ConsumerProfile' }"
            class="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >Profile</router-link>
          <button
            @click="consumerAuth.logout()"
            class="block w-full text-left rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >Sign out</button>
        </template>
        <template v-else-if="publicLoginEnabled">
          <router-link
            :to="{ name: 'ConsumerLogin' }"
            class="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >Sign in</router-link>
        </template>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { Bars3Icon, XMarkIcon, SunIcon, MoonIcon } from '@heroicons/vue/24/outline'
import { useRoute } from 'vue-router'
import { useConsumerAuthStore } from '@/store/consumer/auth'
import { useConsumerUserStore } from '@/store/consumer/user'
import { usePublicModules } from '@/composables/publicModules'
import { useThemeStore } from '@/store/theme'
import { useAxios } from '@/composables/request'

const route = useRoute()
const consumerAuth = useConsumerAuthStore()
const userStore = useConsumerUserStore()
const themeStore = useThemeStore()

const { isPublicModuleEnabled, siteName } = usePublicModules()
const blogsEnabled = computed(() => isPublicModuleEnabled('blogs'))
const publicLoginEnabled = computed(() => isPublicModuleEnabled('public_login'))
const roadmapEnabled = computed(() => isPublicModuleEnabled('roadmap'))
const tasksEnabled = computed(() => isPublicModuleEnabled('tasks'))

const navPages = ref([])
const mobileOpen = ref(false)
const expanded = ref(null)

// Close the mobile menu on navigation
watch(() => route.fullPath, () => {
  mobileOpen.value = false
  expanded.value = null
})

onMounted(async () => {
  try {
    const res = await useAxios.get('/api/public/pages/nav')
    navPages.value = res?.data ?? []
  } catch {}
})
</script>
