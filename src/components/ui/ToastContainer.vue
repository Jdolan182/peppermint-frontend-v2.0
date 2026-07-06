<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none" style="max-width:360px; min-width:280px;">
      <div
        v-for="toast in toastStore.toasts"
        :key="toast.id"
        class="pointer-events-auto flex items-start gap-3 rounded-xl px-4 py-3 shadow-lg ring-1 text-sm font-medium"
        :class="styles[toast.type] ?? styles.info"
      >
        <span class="flex-shrink-0 mt-0.5 text-base leading-none">{{ icons[toast.type] ?? icons.info }}</span>
        <span class="flex-1 leading-snug">{{ toast.message }}</span>
        <button
          @click="toastStore.dismiss(toast.id)"
          class="flex-shrink-0 ml-1 opacity-60 hover:opacity-100 transition-opacity leading-none text-base"
        >&times;</button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { useToastStore } from '@/store/admin/toasts'

const toastStore = useToastStore()

const styles = {
  success: 'bg-green-50  text-green-800  ring-green-200  dark:bg-green-900/40 dark:text-green-200 dark:ring-green-700',
  error:   'bg-red-50    text-red-800    ring-red-200    dark:bg-red-900/40   dark:text-red-200   dark:ring-red-700',
  warning: 'bg-amber-50  text-amber-800  ring-amber-200  dark:bg-amber-900/40 dark:text-amber-200 dark:ring-amber-700',
  info:    'bg-blue-50   text-blue-800   ring-blue-200   dark:bg-blue-900/40  dark:text-blue-200  dark:ring-blue-700',
}

const icons = {
  success: '✓',
  error:   '✕',
  warning: '⚠',
  info:    'ℹ',
}
</script>
