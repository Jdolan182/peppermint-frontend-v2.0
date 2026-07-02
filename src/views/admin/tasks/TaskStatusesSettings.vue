<template>
  <div>
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Task statuses</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Customise the workflow stages for tasks</p>
      </div>
      <button @click="openNew" class="rounded-lg bg-gray-900 dark:bg-white px-4 py-2 text-sm font-semibold text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-100 transition-colors">New status</button>
    </div>

    <div class="mt-8 rounded-xl bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
      <div v-if="!statuses.length" class="px-6 py-10 text-center text-sm text-gray-400">No statuses yet.</div>
      <div v-for="status in statuses" :key="status.id" class="flex items-center justify-between px-5 py-4">
        <div class="flex items-center gap-3">
          <span class="w-3.5 h-3.5 rounded-full flex-shrink-0" :style="{ background: status.color }" />
          <span class="text-sm font-medium text-gray-900 dark:text-white">{{ status.name }}</span>
          <span v-if="status.is_default" class="text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-full px-2 py-0.5">Default</span>
          <span v-if="status.is_closed" class="text-xs bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 rounded-full px-2 py-0.5">Closed</span>
        </div>
        <div class="flex gap-2">
          <button @click="openEdit(status)" class="text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">Edit</button>
          <button @click="handleDelete(status)" class="text-xs text-red-500 hover:text-red-600 transition-colors px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20">Delete</button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="modalOpen" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/30" @click="modalOpen = false" />
        <div class="relative z-10 w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6">
          <h2 class="text-base font-semibold text-gray-900 dark:text-white mb-5">{{ isNew ? 'New status' : 'Edit status' }}</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Name</label>
              <input v-model="form.name" type="text" class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Color</label>
              <div class="flex items-center gap-3">
                <input v-model="form.color" type="color" class="h-9 w-16 rounded cursor-pointer border border-gray-200 dark:border-gray-700" />
                <span class="text-sm text-gray-500 dark:text-gray-400">{{ form.color }}</span>
              </div>
            </div>
            <div class="flex gap-5">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" v-model="form.is_default" class="rounded" />
                <span class="text-sm text-gray-700 dark:text-gray-300">Default</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" v-model="form.is_closed" class="rounded" />
                <span class="text-sm text-gray-700 dark:text-gray-300">Closed state</span>
              </label>
            </div>
          </div>
          <div class="mt-6 flex justify-end gap-3">
            <button @click="modalOpen = false" class="px-4 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">Cancel</button>
            <button @click="handleSave" :disabled="saving || !form.name" class="px-4 py-2 rounded-lg bg-gray-900 dark:bg-white text-sm font-semibold text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-100 disabled:opacity-50">{{ saving ? 'Saving…' : 'Save' }}</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAxios } from '@/composables/request'

const statuses = ref([])
const modalOpen = ref(false)
const saving = ref(false)
const editingId = ref(null)
const isNew = computed(() => !editingId.value)

const form = ref({ name: '', color: '#6b7280', is_default: false, is_closed: false })

function openNew() {
  editingId.value = null
  form.value = { name: '', color: '#6b7280', is_default: false, is_closed: false }
  modalOpen.value = true
}

function openEdit(status) {
  editingId.value = status.id
  form.value = { name: status.name, color: status.color, is_default: status.is_default, is_closed: status.is_closed }
  modalOpen.value = true
}

async function handleSave() {
  saving.value = true
  const res = isNew.value
    ? await useAxios.post('/api/admin/task-statuses', form.value)
    : await useAxios.put(`/api/admin/task-statuses/${editingId.value}`, form.value)
  saving.value = false
  if (res?.data) {
    modalOpen.value = false
    await load()
  }
}

async function handleDelete(status) {
  if (!confirm(`Delete status "${status.name}"?`)) return
  const res = await useAxios.delete(`/api/admin/task-statuses/${status.id}`)
  if (res?.status === 200) await load()
  else if (res?.data?.message) alert(res.data.message)
}

async function load() {
  const res = await useAxios.get('/api/admin/task-statuses')
  statuses.value = res?.data ?? []
}

onMounted(load)
</script>
