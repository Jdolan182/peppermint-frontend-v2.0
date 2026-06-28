<template>
  <div class="flex h-full flex-col bg-gray-900">
    <!-- Logo -->
    <div class="flex h-16 items-center px-4 border-b border-gray-700/50" :class="collapsed ? 'justify-center' : 'gap-3'">
      <div class="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
        <span class="text-white font-bold text-sm">P</span>
      </div>
      <span v-if="!collapsed" class="text-white font-semibold text-base">{{ adminName }}</span>
    </div>

    <!-- Nav -->
    <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      <router-link
        v-for="item in navItems"
        :key="item.name"
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
    </nav>

    <!-- User + logout -->
    <div class="border-t border-gray-700/50 p-3">
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
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/store/admin/auth'
import { HomeIcon, ArrowRightOnRectangleIcon } from '@heroicons/vue/24/outline'

defineProps({
  collapsed: { type: Boolean, default: false },
})

const route = useRoute()
const authStore = useAuthStore()

const adminName = import.meta.env.VITE_MODULE_ADMIN_NAME
const dashboardName = import.meta.env.VITE_MODULE_ADMIN_DASHBOARD_NAME

const navItems = [
  { name: dashboardName, routeName: 'Dashboard', icon: HomeIcon },
]

const isActive = (routeName) => route.name === routeName

const logout = () => authStore.logout()
</script>
