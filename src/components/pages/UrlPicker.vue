<template>
  <div class="space-y-2">
    <!-- Mode tabs -->
    <div class="flex rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden w-fit">
      <button
        type="button"
        @click="mode = 'page'"
        class="px-3 py-1.5 text-xs font-medium transition-colors"
        :class="mode === 'page'
          ? 'bg-indigo-600 text-white'
          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'"
      >Page</button>
      <button
        type="button"
        @click="mode = 'external'"
        class="px-3 py-1.5 text-xs font-medium transition-colors"
        :class="mode === 'external'
          ? 'bg-indigo-600 text-white'
          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'"
      >External</button>
    </div>

    <!-- Page picker -->
    <select
      v-if="mode === 'page'"
      :value="selectedPageSlug"
      @change="onPageSelect"
      class="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      <option value="">— choose a page —</option>
      <template v-for="page in pages" :key="page.id">
        <option :value="page.slug">{{ page.title }}</option>
        <option
          v-for="child in (page.children ?? [])"
          :key="child.id"
          :value="child.slug"
        >  ↳ {{ child.title }}</option>
      </template>
    </select>

    <!-- External URL -->
    <input
      v-else
      :value="modelValue"
      type="url"
      placeholder="https://example.com"
      @input="$emit('update:modelValue', $event.target.value)"
      class="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />

    <!-- Preview of current value -->
    <p v-if="modelValue" class="text-xs text-gray-400 truncate">{{ modelValue }}</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAxios } from '@/composables/request'

const props = defineProps({
  modelValue: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue'])

const pages = ref([])
const loading = ref(false)

// Determine initial mode from the current value
const isInternalUrl = (val) => val && val.startsWith('/')
const mode = ref(isInternalUrl(props.modelValue) ? 'page' : 'external')

const selectedPageSlug = computed(() => {
  if (!props.modelValue) return ''
  // internal URLs are stored as /slug
  return props.modelValue.startsWith('/') ? props.modelValue.slice(1) : ''
})

function onPageSelect(e) {
  const slug = e.target.value
  emit('update:modelValue', slug ? '/' + slug : '')
}

onMounted(async () => {
  loading.value = true
  const res = await useAxios.get('/api/admin/pages')
  pages.value = res?.data ?? []
  loading.value = false
})
</script>
