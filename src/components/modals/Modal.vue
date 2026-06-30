<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/50" @click="$emit('update:modelValue', false)" />
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="modelValue"
            class="relative z-10 w-full mx-4 bg-white dark:bg-gray-800 rounded-xl shadow-xl"
            :class="widthClass"
          >
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <h2 class="text-base font-semibold text-gray-900 dark:text-white">{{ title }}</h2>
              <button
                type="button"
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                @click="$emit('update:modelValue', false)"
              >
                <XMarkIcon class="w-5 h-5" />
              </button>
            </div>
            <div class="px-6 py-5">
              <slot />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  title: { type: String, required: true },
  width: { type: String, default: 'md' },
})

defineEmits(['update:modelValue'])

const widthClass = computed(() => ({
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
}[props.width] ?? 'max-w-md'))
</script>
