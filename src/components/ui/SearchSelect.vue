<template>
  <div class="relative" ref="root">
    <button
      type="button"
      @click="toggle"
      class="w-full flex items-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      <span v-if="selected" class="flex-1 truncate flex items-center gap-2 text-gray-900 dark:text-white">
        <span v-if="selected.color" class="w-2 h-2 rounded-full flex-shrink-0" :style="{ background: selected.color }" />
        {{ selected.name }}
      </span>
      <span v-else class="flex-1 text-gray-400 text-sm">{{ nullLabel }}</span>
      <ChevronUpDownIcon class="w-4 h-4 text-gray-400 flex-shrink-0 ml-1" />
    </button>

    <div
      v-if="open"
      class="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden"
    >
      <div class="p-2 border-b border-gray-100 dark:border-gray-700">
        <input
          ref="searchInput"
          v-model="query"
          type="text"
          class="w-full rounded-md border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-2 py-1.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Search…"
          @keydown.esc="open = false"
          @keydown.enter.prevent="selectFirst"
        />
      </div>
      <div class="max-h-52 overflow-y-auto">
        <button
          v-if="allowNull"
          type="button"
          @mousedown.prevent="select(null)"
          class="w-full text-left px-3 py-2 text-sm text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          :class="modelValue == null ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''"
        >{{ nullLabel }}</button>
        <button
          v-for="opt in filtered"
          :key="opt.id"
          type="button"
          @mousedown.prevent="select(opt)"
          class="w-full text-left px-3 py-2 text-sm text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
          :class="modelValue != null && modelValue == opt.id ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''"
        >
          <span v-if="opt.color" class="w-2 h-2 rounded-full flex-shrink-0" :style="{ background: opt.color }" />
          {{ opt.name }}
        </button>
        <p v-if="!filtered.length && (!allowNull || query)" class="px-3 py-2 text-sm text-gray-400">No results</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onBeforeUnmount } from 'vue'
import { ChevronUpDownIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  modelValue: { default: null },
  options: { type: Array, default: () => [] },
  nullLabel: { type: String, default: 'None' },
  allowNull: { type: Boolean, default: true },
})

const emit = defineEmits(['update:modelValue'])

const open = ref(false)
const query = ref('')
const searchInput = ref(null)
const root = ref(null)

const selected = computed(() => {
  if (props.modelValue == null) return null
  return props.options.find(o => o.id == props.modelValue) ?? null
})

const filtered = computed(() => {
  const q = query.value.toLowerCase()
  return q ? props.options.filter(o => o.name.toLowerCase().includes(q)) : props.options
})

function toggle() {
  open.value = !open.value
  if (open.value) {
    query.value = ''
    nextTick(() => searchInput.value?.focus())
  }
}

function select(opt) {
  emit('update:modelValue', opt?.id ?? null)
  open.value = false
  query.value = ''
}

function selectFirst() {
  if (filtered.value.length) select(filtered.value[0])
}

function handleClickOutside(e) {
  if (root.value && !root.value.contains(e.target)) {
    open.value = false
  }
}

watch(open, (val) => {
  if (val) document.addEventListener('mousedown', handleClickOutside)
  else document.removeEventListener('mousedown', handleClickOutside)
})

onBeforeUnmount(() => document.removeEventListener('mousedown', handleClickOutside))
</script>
