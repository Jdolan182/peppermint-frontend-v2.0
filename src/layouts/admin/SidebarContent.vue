<template>
  <div class="flex h-full flex-col bg-gray-900">
    <!-- Logo -->
    <div class="flex h-16 items-center px-4 border-b border-gray-700/50" :class="collapsed ? 'justify-center' : 'gap-3'">
      <div class="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
        <span class="text-white font-bold text-sm">{{ siteName[0]?.toUpperCase() }}</span>
      </div>
      <span v-if="!collapsed" class="text-white font-semibold text-base">{{ siteName }}</span>
    </div>

    <!-- Nav -->
    <nav class="flex-1 px-3 py-4 overflow-y-auto">
      <template v-for="item in visibleNav" :key="item.label ?? item.routeName">
        <!-- Section label -->
        <p
          v-if="item.type === 'section'"
          class="mt-4 mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500"
          :class="collapsed ? 'hidden' : ''"
        >
          {{ item.label }}
        </p>
        <div v-else-if="item.type === 'section' && collapsed" class="mt-3 mb-1 border-t border-gray-700/50" />

        <!-- Nav link -->
        <router-link
          v-else
          :to="{ name: item.routeName }"
          class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors group"
          :class="[
            isActive(item.routeName)
              ? 'bg-indigo-600 text-white'
              : 'text-gray-400 hover:bg-gray-800 hover:text-white',
            collapsed ? 'justify-center' : ''
          ]"
          :title="collapsed ? item.name : undefined"
        >
          <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
          <span v-if="!collapsed">{{ item.name }}</span>
        </router-link>
      </template>
    </nav>

    <!-- Bottom actions -->
    <div class="border-t border-gray-700/50 p-3 space-y-1">
      <DarkModeToggle :collapsed="collapsed" />
      <button
        @click="logout"
        class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors w-full"
        :class="collapsed ? 'justify-center' : ''"
        :title="collapsed ? 'Sign out' : undefined"
      >
        <ArrowRightOnRectangleIcon class="w-5 h-5 flex-shrink-0" />
        <span v-if="!collapsed">Sign out</span>
      </button>
    </div>
  </div>
</template>


<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/store/admin/auth'
import { useModulesStore } from '@/store/admin/modules'
import { HomeIcon, UsersIcon, UserGroupIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon, NewspaperIcon, TagIcon } from '@heroicons/vue/24/outline'
import DarkModeToggle from '@/components/buttons/DarkModeToggle.vue'

defineProps({
  collapsed: { type: Boolean, default: false },
})

const route = useRoute()
const authStore = useAuthStore()
const modulesStore = useModulesStore()

const siteName = computed(() => modulesStore.settings.site_name || import.meta.env.VITE_MODULE_ADMIN_NAME || 'Peppermint')
const dashboardName = import.meta.env.VITE_MODULE_ADMIN_DASHBOARD_NAME

// module is the short name e.g. 'blogs', null means always visible
const allNav = [
  { name: dashboardName, routeName: 'Dashboard', icon: HomeIcon, module: null },
  { name: 'Consumers', routeName: 'Consumers', icon: UsersIcon, module: 'consumers' },
  { type: 'section', label: 'Content', module: 'blogs' },
  { name: 'Blogs', routeName: 'Blogs', icon: NewspaperIcon, module: 'blogs' },
  { name: 'Categories', routeName: 'BlogCategories', icon: TagIcon, module: 'blogs' },
  { type: 'section', label: 'Team', module: 'team' },
  { name: 'Admin Users', routeName: 'AdminUsers', icon: UserGroupIcon, module: 'team' },
  { name: 'Settings', routeName: 'Settings', icon: Cog6ToothIcon, module: 'settings' },
]

const visibleNav = computed(() => {
  return allNav.filter(item => item.module === null || modulesStore.isEnabled(item.module))
})

const isActive = (routeName) => route.name === routeName

const logout = () => authStore.logout()
</script>
