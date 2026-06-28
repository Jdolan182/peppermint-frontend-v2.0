<template>
  <header class="sticky top-0 z-20 bg-white border-b border-gray-200 h-16 flex items-center px-4 gap-4">
    <!-- Mobile hamburger -->
    <button
      class="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
      @click="sidebar.toggleMobile()"
    >
      <Bars3Icon class="w-5 h-5" />
    </button>

    <!-- Desktop collapse toggle -->
    <button
      class="hidden lg:flex p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
      @click="sidebar.toggle()"
    >
      <Bars3Icon class="w-5 h-5" />
    </button>

    <div class="flex-1" />

    <!-- User info -->
    <div class="flex items-center gap-3">
      <span class="text-sm text-gray-500">{{ userStore.getName }}</span>
      <div class="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
        <span class="text-white text-xs font-semibold">{{ initials }}</span>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { Bars3Icon } from '@heroicons/vue/24/outline'
import { useSidebarStore } from '@/store/admin/sidebar'
import { useUserStore } from '@/store/admin/user'

const sidebar = useSidebarStore()
const userStore = useUserStore()

const initials = computed(() => {
  const name = userStore.getName || ''
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})
</script>
