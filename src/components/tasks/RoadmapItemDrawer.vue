<template>
  <Teleport to="body">
    <div v-if="modelValue" class="fixed inset-0 z-40 flex justify-end">
      <div class="absolute inset-0 bg-black/30" @click="$emit('update:modelValue', false)" />
      <div class="relative z-10 flex h-full w-full max-w-lg flex-col bg-white dark:bg-gray-900 shadow-2xl overflow-y-auto">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 px-6 py-4">
          <h2 class="text-base font-semibold text-gray-900 dark:text-white">
            {{ isNew ? 'New roadmap item' : 'Edit roadmap item' }}
          </h2>
          <button @click="$emit('update:modelValue', false)" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <XMarkIcon class="w-5 h-5" />
          </button>
        </div>

        <div class="flex-1 px-6 py-5 space-y-5">
          <!-- Title -->
          <div>
            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Title</label>
            <input
              v-model="form.title"
              type="text"
              class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Roadmap item title"
            />
          </div>

          <!-- Status + Category -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Status</label>
              <select v-model="form.status" class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="planned">Planned</option>
                <option value="in-progress">In Progress</option>
                <option value="shipped">Shipped</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Category</label>
              <SearchSelect
                v-model="form.category_id"
                :options="categories"
                null-label="Uncategorised"
              />
            </div>
          </div>

          <!-- Dates row -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Start date</label>
              <input
                v-model="form.start_date"
                type="date"
                class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Target date</label>
              <input
                v-model="form.date"
                type="date"
                class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <!-- Assigned admin -->
          <div>
            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Assigned to</label>
            <SearchSelect
              v-model="form.assigned_admin_id"
              :options="admins"
              null-label="Unassigned"
            />
          </div>

          <!-- Description -->
          <div>
            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Description</label>
            <textarea
              v-model="form.description"
              rows="5"
              class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              placeholder="What does this include?"
            />
          </div>

          <!-- Linked tasks (read-only list when editing) -->
          <div v-if="!isNew && item?.tasks?.length">
            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Linked tasks ({{ item.tasks.length }})</label>
            <ul class="space-y-1">
              <li
                v-for="t in item.tasks"
                :key="t.id"
                class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
              >
                <span
                  class="inline-block w-2 h-2 rounded-full flex-shrink-0"
                  :style="{ background: t.status?.color ?? '#6b7280' }"
                />
                {{ t.title }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Footer -->
        <div class="border-t border-gray-100 dark:border-gray-700 px-6 py-4 flex items-center justify-between gap-3">
          <button
            v-if="!isNew"
            @click="handleDelete"
            class="text-sm font-medium text-red-500 hover:text-red-600"
          >Delete</button>
          <div v-else />
          <div class="flex gap-3">
            <button
              @click="$emit('update:modelValue', false)"
              class="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >Cancel</button>
            <button
              @click="handleSave"
              :disabled="saving || !form.title"
              class="rounded-lg bg-gray-900 dark:bg-white px-4 py-2 text-sm font-semibold text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-100 transition-colors disabled:opacity-50"
            >{{ saving ? 'Saving…' : 'Save' }}</button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { useAxios } from '@/composables/request'
import SearchSelect from '@/components/ui/SearchSelect.vue'

const props = defineProps({
  modelValue: Boolean,
  item: { type: Object, default: null },
  admins: { type: Array, default: () => [] },
  categories: { type: Array, default: () => [] },
})

const emit = defineEmits(['update:modelValue', 'saved', 'deleted'])

const saving = ref(false)
const isNew = computed(() => !props.item?.id)

const defaultForm = () => ({
  title: '',
  description: '',
  status: 'planned',
  start_date: '',
  date: '',
  category_id: null,
  assigned_admin_id: null,
})

const form = ref(defaultForm())

watch(() => props.modelValue, (open) => {
  if (open) {
    form.value = props.item
      ? {
          title: props.item.title ?? '',
          description: props.item.description ?? '',
          status: props.item.status ?? 'planned',
          start_date: props.item.start_date?.slice(0, 10) ?? '',
          date: props.item.date?.slice(0, 10) ?? '',
          category_id: props.item.category_id ?? null,
          assigned_admin_id: props.item.assigned_admin_id ?? null,
        }
      : defaultForm()
  }
})

async function handleSave() {
  if (!form.value.title) return
  saving.value = true
  const payload = { ...form.value }
  if (!payload.start_date) payload.start_date = null
  if (!payload.date) payload.date = null
  const res = isNew.value
    ? await useAxios.post('/api/admin/roadmap', payload)
    : await useAxios.put(`/api/admin/roadmap/${props.item.id}`, payload)
  saving.value = false
  if (res?.data) {
    emit('saved', res.data)
    emit('update:modelValue', false)
  }
}

async function handleDelete() {
  if (!confirm('Delete this roadmap item? Linked tasks will be unlinked.')) return
  await useAxios.delete(`/api/admin/roadmap/${props.item.id}`)
  emit('deleted', props.item.id)
  emit('update:modelValue', false)
}
</script>
