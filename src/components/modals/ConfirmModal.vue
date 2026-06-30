<template>
  <Modal :model-value="modelValue" :title="title" width="sm" @update:model-value="$emit('update:modelValue', $event)">
    <p class="text-sm text-gray-600 dark:text-gray-300 mb-6">{{ message }}</p>
    <div class="flex justify-end gap-3">
      <button
        type="button"
        class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
        @click="$emit('update:modelValue', false)"
      >
        Cancel
      </button>
      <button
        type="button"
        class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
        :disabled="loading"
        @click="$emit('confirm')"
      >
        <span v-if="loading">Deleting...</span>
        <span v-else>{{ confirmLabel }}</span>
      </button>
    </div>
  </Modal>
</template>

<script setup>
import Modal from './Modal.vue'

defineProps({
  modelValue: { type: Boolean, required: true },
  title: { type: String, default: 'Are you sure?' },
  message: { type: String, default: 'This action cannot be undone.' },
  confirmLabel: { type: String, default: 'Delete' },
  loading: { type: Boolean, default: false },
})

defineEmits(['update:modelValue', 'confirm'])
</script>
