<template>
  <div>
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Task types</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Define the types of tasks your team works on</p>
      </div>
      <button @click="openNew" class="rounded-lg bg-gray-900 dark:bg-white px-4 py-2 text-sm font-semibold text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-100 transition-colors">New type</button>
    </div>

    <div class="mt-8 rounded-xl bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
      <div v-if="!types.length" class="px-6 py-10 text-center text-sm text-gray-400">No types yet.</div>
      <div v-for="type in types" :key="type.id" class="flex items-center justify-between px-5 py-4">
        <div class="flex items-center gap-3">
          <span class="w-3.5 h-3.5 rounded-full flex-shrink-0" :style="{ background: type.color }" />
          <span class="text-sm font-medium text-gray-900 dark:text-white">{{ type.name }}</span>
          <span v-if="type.is_appointment" class="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-0.5">Appointment</span>
        </div>
        <div class="flex gap-2">
          <button @click="openEdit(type)" class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium">Edit</button>
          <button @click="handleDelete(type)" class="text-xs text-red-500 hover:text-red-600 transition-colors px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20">Delete</button>
        </div>
      </div>
    </div>

    <ConfirmModal
      v-model="confirmOpen"
      title="Delete type"
      :message="confirmPending ? `Delete type '${confirmPending.name}'? This cannot be undone.` : ''"
      :loading="deleting"
      @confirm="doDelete"
    />

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="modalOpen" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/30" @click="modalOpen = false" />
        <div class="relative z-10 w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6">
          <h2 class="text-base font-semibold text-gray-900 dark:text-white mb-5">{{ isNew ? 'New type' : 'Edit type' }}</h2>
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
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" v-model="form.is_appointment" class="rounded" />
              <span class="text-sm text-gray-700 dark:text-gray-300">This type is for appointments</span>
            </label>
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
import ConfirmModal from '@/components/modals/ConfirmModal.vue'
import { useToast } from '@/composables/useToast'

const toast = useToast()

const types = ref([])
const modalOpen = ref(false)
const saving = ref(false)
const editingId = ref(null)
const isNew = computed(() => !editingId.value)

const confirmOpen = ref(false)
const confirmPending = ref(null)
const deleting = ref(false)

const form = ref({ name: '', color: '#6366f1', is_appointment: false })

function openNew() {
  editingId.value = null
  form.value = { name: '', color: '#6366f1', is_appointment: false }
  modalOpen.value = true
}

function openEdit(type) {
  editingId.value = type.id
  form.value = { name: type.name, color: type.color, is_appointment: type.is_appointment }
  modalOpen.value = true
}

async function handleSave() {
  saving.value = true
  const res = isNew.value
    ? await useAxios.post('/api/admin/task-types', form.value)
    : await useAxios.put(`/api/admin/task-types/${editingId.value}`, form.value)
  saving.value = false
  if (res?.data) {
    toast.success(isNew.value ? 'Type created' : 'Type updated')
    modalOpen.value = false
    await load()
  } else {
    toast.error('Failed to save type')
  }
}

function handleDelete(type) {
  confirmPending.value = type
  confirmOpen.value = true
}

async function doDelete() {
  deleting.value = true
  const res = await useAxios.delete(`/api/admin/task-types/${confirmPending.value.id}`)
  deleting.value = false
  confirmOpen.value = false
  if (res?.status === 200) { toast.success('Type deleted'); await load() }
  else toast.error('Failed to delete type')
}

async function load() {
  const res = await useAxios.get('/api/admin/task-types')
  types.value = res?.data ?? []
}

onMounted(load)
</script>
