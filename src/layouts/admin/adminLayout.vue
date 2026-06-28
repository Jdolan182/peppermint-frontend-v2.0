<template>
  <div class="min-h-screen bg-gray-100">
    <adminSidebar />

    <div
      class="transition-all duration-200"
      :class="sidebar.collapsed ? 'lg:pl-16' : 'lg:pl-64'"
    >
      <adminHeader />

      <main class="py-8">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <RouterView />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import adminHeader from './adminHeader.vue'
import adminSidebar from './adminSidebar.vue'
import { useSidebarStore } from '@/store/admin/sidebar'

const sidebar = useSidebarStore()
</script>
