<template>
  <Modal :model-value="modelValue" :title="consumer ? 'Edit Consumer' : 'Add Consumer'" @update:model-value="close">
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
          <Label :label="consumer ? 'Password (leave blank to keep current)' : 'Password'" />
          <Input v-model="form.password" type="password" :error="!!errors.password" :error-message="errors.password" />
        </div>
        <div v-if="form.password">
          <Label label="Confirm password" />
          <Input v-model="form.password_confirmation" type="password" :error="!!errors.password_confirmation" :error-message="errors.password_confirmation" />
        </div>
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
          {{ loading ? 'Saving...' : (consumer ? 'Save changes' : 'Add consumer') }}
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
  consumer: { type: Object, default: null },
  loading: { type: Boolean, default: false },
  errors: { type: Object, default: () => ({}) },
})

const emit = defineEmits(['update:modelValue', 'submit'])

const form = ref({ name: '', email: '', password: '', password_confirmation: '' })

watch(() => props.modelValue, (open) => {
  if (open) {
    form.value = {
      name: props.consumer?.name ?? '',
      email: props.consumer?.email ?? '',
      password: '',
      password_confirmation: '',
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
