<template>
  <Modal :model-value="modelValue" :title="user ? 'Edit Admin User' : 'Add Admin User'" @update:model-value="close">
    <form @submit.prevent="submit">
      <div class="space-y-4">
        <div>
          <Label label="Name" />
          <Input v-model="form.name" :error="!!errors.name" :error-message="errors.name" />
        </div>
        <div>
          <Label label="Email" />
          <Input v-model="form.email" type="email" :error="!!errors.email" :error-message="errors.email" />
        </div>
        <div>
          <Label :label="user ? 'Password (leave blank to keep current)' : 'Password'" />
          <Input v-model="form.password" type="password" :error="!!errors.password" :error-message="errors.password" />
        </div>
        <div v-if="form.password">
          <Label label="Confirm password" />
          <Input v-model="form.password_confirmation" type="password" :error="!!errors.password_confirmation" :error-message="errors.password_confirmation" />
        </div>
        <label class="flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" v-model="form.is_active" class="rounded border-gray-300 dark:border-gray-600" />
          <span class="text-sm text-gray-700 dark:text-gray-300">Active (can log in)</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" v-model="form.notify_contact" class="rounded border-gray-300 dark:border-gray-600" />
          <span class="text-sm text-gray-700 dark:text-gray-300">Notify on contact submissions</span>
        </label>
      </div>
      <div class="flex justify-end gap-3 mt-6">
        <button
          type="button"
          class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          @click="close"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
          :disabled="loading"
        >
          {{ loading ? 'Saving...' : (user ? 'Save changes' : 'Add user') }}
        </button>
      </div>
    </form>
  </Modal>
</template>

<script setup>
import { ref, watch } from 'vue'
import Modal from './Modal.vue'
import Input from '@/components/inputs/Input.vue'
import Label from '@/components/labels/Label.vue'

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  user: { type: Object, default: null },
  loading: { type: Boolean, default: false },
  errors: { type: Object, default: () => ({}) },
})

const emit = defineEmits(['update:modelValue', 'submit'])

const form = ref({ name: '', email: '', password: '', password_confirmation: '', is_active: true, notify_contact: false })

watch(() => props.modelValue, (open) => {
  if (open) {
    form.value = {
      name: props.user?.name ?? '',
      email: props.user?.email ?? '',
      password: '',
      password_confirmation: '',
      is_active: props.user?.is_active ?? true,
      notify_contact: props.user?.notify_contact ?? false,
    }
  }
})

function close() {
  emit('update:modelValue', false)
}

function submit() {
  emit('submit', { ...form.value })
}
</script>
