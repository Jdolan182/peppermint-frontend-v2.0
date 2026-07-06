<template>
  <!-- Backdrop -->
  <Teleport to="body">
    <div v-if="modelValue" class="fixed inset-0 z-40 flex justify-end">
      <div class="absolute inset-0 bg-black/30" @click="$emit('update:modelValue', false)" />
      <div class="relative z-10 flex h-full w-full max-w-lg flex-col bg-white dark:bg-gray-900 shadow-2xl overflow-y-auto">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 px-6 py-4">
          <h2 class="text-base font-semibold text-gray-900 dark:text-white">
            {{ isNew ? 'New task' : 'Edit task' }}
          </h2>
          <button @click="$emit('update:modelValue', false)" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <XMarkIcon class="w-5 h-5" />
          </button>
        </div>

        <!-- Form -->
        <div class="flex-1 px-6 py-5 space-y-5">
          <!-- Title -->
          <div>
            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Title</label>
            <input
              v-model="form.title"
              type="text"
              class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Task title"
            />
          </div>

          <!-- Type + Priority row -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Type</label>
              <select v-model="form.type_id" class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option v-for="t in types" :key="t.id" :value="t.id">{{ t.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Priority</label>
              <select v-model="form.priority" class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <!-- Status + Due date -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Status</label>
              <select v-model="form.status_id" class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option v-for="s in statuses" :key="s.id" :value="s.id">{{ s.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Due date</label>
              <input
                v-model="form.due_date"
                type="date"
                class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <!-- Assigned admin + Consumer -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Assigned to (admin)</label>
              <SearchSelect
                v-model="form.assigned_admin_id"
                :options="admins"
                null-label="Unassigned"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Consumer</label>
              <SearchSelect
                v-model="form.consumer_id"
                :options="consumers"
                null-label="None"
              />
            </div>
          </div>

          <!-- Roadmap item -->
          <div>
            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Linked roadmap item</label>
            <SearchSelect v-model="form.roadmap_item_id" :options="roadmapOptions" null-label="None" />
          </div>

          <!-- Description -->
          <div>
            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Description</label>
            <textarea
              v-model="form.description"
              rows="4"
              class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              placeholder="What needs to be done?"
            />
          </div>

          <!-- Notes -->
          <div>
            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Notes</label>
            <textarea
              v-model="form.notes"
              rows="3"
              class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              placeholder="Internal notes…"
            />
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

  <ConfirmModal
    v-model="confirmOpen"
    title="Delete task"
    :message="props.task ? `Delete '${props.task.title}'? This cannot be undone.` : ''"
    :loading="deleting"
    @confirm="doDelete"
  />
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { useAxios } from '@/composables/request'
import SearchSelect from '@/components/ui/SearchSelect.vue'
import ConfirmModal from '@/components/modals/ConfirmModal.vue'
import { useToast } from '@/composables/useToast'

const toast = useToast()

const props = defineProps({
  modelValue: Boolean,
  task: { type: Object, default: null },
  types: { type: Array, default: () => [] },
  statuses: { type: Array, default: () => [] },
  admins: { type: Array, default: () => [] },
  consumers: { type: Array, default: () => [] },
  roadmapItems: { type: Array, default: () => [] },
})

const emit = defineEmits(['update:modelValue', 'saved', 'deleted'])

const saving = ref(false)
const isNew = computed(() => !props.task?.id)
const roadmapOptions = computed(() => props.roadmapItems.map(r => ({ id: r.id, name: r.title })))

const confirmOpen = ref(false)
const deleting = ref(false)

const defaultForm = () => ({
  title: '',
  description: '',
  type_id: props.types[0]?.id ?? null,
  status_id: props.statuses.find(s => s.is_default)?.id ?? props.statuses[0]?.id ?? null,
  priority: 'medium',
  due_date: '',
  assigned_admin_id: null,
  consumer_id: null,
  roadmap_item_id: null,
  notes: '',
})

const form = ref(defaultForm())

watch(() => props.modelValue, (open) => {
  if (open) {
    form.value = props.task
      ? {
          title: props.task.title ?? '',
          description: props.task.description ?? '',
          type_id: props.task.type_id,
          status_id: props.task.status_id,
          priority: props.task.priority ?? 'medium',
          due_date: props.task.due_date?.slice(0, 10) ?? '',
          assigned_admin_id: props.task.assigned_admin_id ?? null,
          consumer_id: props.task.consumer_id ?? null,
          roadmap_item_id: props.task.roadmap_item_id ?? null,
          notes: props.task.notes ?? '',
        }
      : defaultForm()
  }
})

async function handleSave() {
  if (!form.value.title) return
  saving.value = true
  const payload = { ...form.value }
  if (!payload.due_date) payload.due_date = null
  const res = isNew.value
    ? await useAxios.post('/api/admin/tasks', payload)
    : await useAxios.put(`/api/admin/tasks/${props.task.id}`, payload)
  saving.value = false
  if (res?.data) {
    toast.success(isNew.value ? 'Task created' : 'Task updated')
    emit('saved', res.data)
    emit('update:modelValue', false)
  } else {
    toast.error('Failed to save task')
  }
}

function handleDelete() {
  confirmOpen.value = true
}

async function doDelete() {
  deleting.value = true
  const res = await useAxios.delete(`/api/admin/tasks/${props.task.id}`)
  deleting.value = false
  confirmOpen.value = false
  if (res?.status === 200 || res?.status === 204) {
    toast.success('Task deleted')
    emit('deleted', props.task.id)
    emit('update:modelValue', false)
  } else {
    toast.error('Failed to delete task')
  }
}
</script>
