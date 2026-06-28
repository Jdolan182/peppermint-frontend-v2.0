<template>
  <!-- Mobile overlay -->
  <Transition
    enter-active-class="transition-opacity duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="sidebar.mobileOpen"
      class="fixed inset-0 z-40 bg-gray-900/50 lg:hidden"
      @click="sidebar.closeMobile()"
    />
  </Transition>

  <!-- Mobile slide-over -->
  <Transition
    enter-active-class="transition-transform duration-200"
    enter-from-class="-translate-x-full"
    enter-to-class="translate-x-0"
    leave-active-class="transition-transform duration-200"
    leave-from-class="translate-x-0"
    leave-to-class="-translate-x-full"
  >
    <div v-if="sidebar.mobileOpen" class="fixed inset-y-0 left-0 z-50 w-64 lg:hidden">
      <SidebarContent />
    </div>
  </Transition>

  <!-- Desktop sidebar -->
  <div
    class="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex flex-col transition-all duration-200"
    :class="sidebar.collapsed ? 'w-16' : 'w-64'"
  >
    <SidebarContent :collapsed="sidebar.collapsed" />
  </div>
</template>

<script setup>
import { useSidebarStore } from '@/store/admin/sidebar'
import SidebarContent from './SidebarContent.vue'

const sidebar = useSidebarStore()
</script>
