<template>
  <button
    type="button"
    class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors w-full"
    :class="collapsed ? 'justify-center' : ''"
    :title="collapsed ? (themeStore.isDark ? 'Switch to light mode' : 'Switch to dark mode') : undefined"
    @click="themeStore.toggle()"
  >
    <SunIcon v-if="themeStore.isDark" class="w-5 h-5 flex-shrink-0" />
    <MoonIcon v-else class="w-5 h-5 flex-shrink-0" />
    <span v-if="!collapsed">{{ themeStore.isDark ? 'Light mode' : 'Dark mode' }}</span>
  </button>
</template>

<script setup>
import { SunIcon, MoonIcon } from '@heroicons/vue/24/outline'
import { useThemeStore } from '@/store/theme'

defineProps({
  collapsed: { type: Boolean, default: false },
})

const themeStore = useThemeStore()
</script>
