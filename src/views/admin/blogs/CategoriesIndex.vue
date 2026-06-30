<template>
  <div>
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Categories</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage blog categories</p>
      </div>
      <button
        class="rounded-lg bg-gray-900 dark:bg-white px-4 py-2 text-sm font-semibold text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-100 transition-colors"
        @click="openAdd"
      >
        Add category
      </button>
    </div>

    <div class="mt-8">
      <DataTable :columns="columns" :rows="categories" empty-message="No categories yet.">
        <template #cell-color="{ row }">
          <span class="inline-flex items-center gap-2">
            <span class="w-5 h-5 rounded-full border border-gray-200 dark:border-gray-600 flex-shrink-0" :style="{ background: row.color }" />
            <span class="text-gray-500 dark:text-gray-400 font-mono text-xs">{{ row.color }}</span>
          </span>
        </template>
        <template #actions="{ row }">
          <button class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium mr-4" @click="openEdit(row)">Edit</button>
          <button class="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium" @click="openDelete(row)">Delete</button>
        </template>
      </DataTable>
      <Pagination :meta="meta" class="mt-3" @change="fetchPage" />
    </div>

    <!-- Add/Edit modal -->
    <Modal v-model="showForm" :title="editing ? 'Edit category' : 'Add category'" width="sm">
      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div>
            <Label label="Name" />
            <Input v-model="form.name" :error="!!formErrors.name" :error-message="formErrors.name" />
          </div>

          <div>
            <Label label="Colour" />
            <div class="flex items-center gap-3 mt-1">
              <!-- Native colour picker hidden behind the swatch -->
              <label class="relative cursor-pointer group">
                <span
                  class="block w-10 h-10 rounded-lg border-2 border-gray-200 dark:border-gray-600 group-hover:border-gray-400 transition-colors shadow-sm"
                  :style="{ background: form.color }"
                />
                <input
                  type="color"
                  v-model="form.color"
                  class="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
              </label>
              <!-- Hex text input -->
              <Input
                v-model="form.color"
                placeholder="#6366f1"
                class="font-mono flex-1"
                :error="!!formErrors.color"
                :error-message="formErrors.color"
              />
            </div>
            <!-- Gradient preview -->
            <div
              class="mt-2 h-8 rounded-lg w-full"
              :style="{ background: previewGradient }"
            />
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-5">
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            @click="showForm = false"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 text-sm font-medium text-white bg-gray-900 dark:bg-white dark:text-gray-900 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-100 transition-colors disabled:opacity-50"
            :disabled="saving"
          >
            {{ saving ? 'Saving...' : (editing ? 'Save changes' : 'Add category') }}
          </button>
        </div>
      </form>
    </Modal>

    <ConfirmModal
      v-model="showConfirm"
      title="Delete category"
      :message="`Are you sure you want to delete '${deleting?.name}'?`"
      :loading="deletingLoading"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAxios } from '@/composables/request'
import DataTable from '@/components/tables/DataTable.vue'
import Pagination from '@/components/tables/Pagination.vue'
import Modal from '@/components/modals/Modal.vue'
import ConfirmModal from '@/components/modals/ConfirmModal.vue'
import Input from '@/components/inputs/Input.vue'
import Label from '@/components/labels/Label.vue'

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'slug', label: 'Slug' },
  { key: 'color', label: 'Colour' },
]

const categories = ref([])
const meta = ref(null)
const currentPage = ref(1)

const showForm = ref(false)
const editing = ref(null)
const form = ref({ name: '', color: '#6366f1' })
const formErrors = ref({})
const saving = ref(false)

const showConfirm = ref(false)
const deleting = ref(null)
const deletingLoading = ref(false)

const previewGradient = computed(() => colorToGradient(form.value.color))

function colorToGradient(hex) {
  if (!hex || !/^#[0-9a-fA-F]{6}$/.test(hex)) return 'linear-gradient(135deg, #a5b4fc 0%, #6366f1 100%)'
  const num = parseInt(hex.replace('#', ''), 16)
  const r = (num >> 16) & 0xff
  const g = (num >> 8) & 0xff
  const b = num & 0xff
  const lr = Math.min(255, r + 80)
  const lg = Math.min(255, g + 80)
  const lb = Math.min(255, b + 80)
  const light = '#' + [lr, lg, lb].map(v => v.toString(16).padStart(2, '0')).join('')
  return `linear-gradient(135deg, ${light} 0%, ${hex} 100%)`
}

async function fetchPage(page = 1) {
  currentPage.value = page
  const res = await useAxios.get('/api/admin/categories', { params: { page, per_page: 50 } })
  if (res?.data) {
    categories.value = res.data.data
    meta.value = res.data.meta
  }
}

function openAdd() {
  editing.value = null
  form.value = { name: '', color: '#6366f1' }
  formErrors.value = {}
  showForm.value = true
}

function openEdit(cat) {
  editing.value = cat
  form.value = { name: cat.name, color: cat.color ?? '#6366f1' }
  formErrors.value = {}
  showForm.value = true
}

function openDelete(cat) {
  deleting.value = cat
  showConfirm.value = true
}

async function handleSubmit() {
  saving.value = true
  formErrors.value = {}

  let res
  if (editing.value) {
    res = await useAxios.patch(`/api/admin/categories/${editing.value.id}`, form.value)
  } else {
    res = await useAxios.post('/api/admin/categories', form.value)
  }

  if (res?.status === 200 || res?.status === 201) {
    showForm.value = false
    await fetchPage(currentPage.value)
  } else if (res?.response?.status === 422) {
    const errs = res.response.data?.errors ?? {}
    formErrors.value = Object.fromEntries(Object.entries(errs).map(([k, v]) => [k, v[0]]))
  }
  saving.value = false
}

async function handleDelete() {
  deletingLoading.value = true
  const res = await useAxios.delete(`/api/admin/categories/${deleting.value.id}`)
  if (res?.status === 200) {
    showConfirm.value = false
    deleting.value = null
    await fetchPage(currentPage.value)
  }
  deletingLoading.value = false
}

onMounted(() => fetchPage())
</script>
