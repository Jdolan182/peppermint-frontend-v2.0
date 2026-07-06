<template>
  <div>
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Admin Users</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage who has access to the admin panel</p>
      </div>
      <button
        class="rounded-lg bg-gray-900 dark:bg-white px-4 py-2 text-sm font-semibold text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-100 transition-colors"
        @click="openAdd"
      >
        Add user
      </button>
    </div>

    <div class="mt-8">
      <DataTable :columns="columns" :rows="users" empty-message="No admin users yet.">
        <template #actions="{ row }">
          <button class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium mr-4" @click="openEdit(row)">Edit</button>
          <button v-if="String(row.id) !== String(userStore.userId)" class="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium" @click="openDelete(row)">Delete</button>
        </template>
      </DataTable>
      <Pagination :meta="meta" class="mt-3" @change="fetchPage" />
    </div>

    <AdminUserFormModal
      v-model="showForm"
      :user="editing"
      :loading="saving"
      :errors="formErrors"
      @submit="handleSubmit"
    />

    <ConfirmModal
      v-model="showConfirm"
      title="Delete admin user"
      :message="`Are you sure you want to delete ${deleting?.name}? This cannot be undone.`"
      :loading="deletingLoading"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAxios } from '@/composables/request'
import { useUserStore } from '@/store/admin/user'
import { useToast } from '@/composables/useToast'

const toast = useToast()

const userStore = useUserStore()
import { formatDateTime } from '@/helpers/date'
import DataTable from '@/components/tables/DataTable.vue'
import Pagination from '@/components/tables/Pagination.vue'
import AdminUserFormModal from '@/components/modals/AdminUserFormModal.vue'
import ConfirmModal from '@/components/modals/ConfirmModal.vue'

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'created_at', label: 'Created', format: formatDateTime },
]

const users = ref([])
const meta = ref(null)
const currentPage = ref(1)

const showForm = ref(false)
const editing = ref(null)
const saving = ref(false)
const formErrors = ref({})

const showConfirm = ref(false)
const deleting = ref(null)
const deletingLoading = ref(false)

async function fetchPage(page = 1) {
  currentPage.value = page
  const res = await useAxios.get('/api/admin/users', { params: { page, per_page: 15 } })
  if (res?.data) {
    users.value = res.data.data
    meta.value = res.data.meta
  }
}

function openAdd() {
  editing.value = null
  formErrors.value = {}
  showForm.value = true
}

function openEdit(user) {
  editing.value = user
  formErrors.value = {}
  showForm.value = true
}

function openDelete(user) {
  deleting.value = user
  showConfirm.value = true
}

async function handleSubmit(data) {
  saving.value = true
  formErrors.value = {}
  let res
  if (editing.value) {
    res = await useAxios.patch(`/api/admin/users/${editing.value.id}`, data)
  } else {
    res = await useAxios.post('/api/admin/users', data)
  }

  if (res?.status === 200 || res?.status === 201) {
    toast.success(editing.value ? 'User updated' : 'User created')
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
  const res = await useAxios.delete(`/api/admin/users/${deleting.value.id}`)
  if (res?.status === 200) {
    toast.success('User deleted')
    showConfirm.value = false
    deleting.value = null
    await fetchPage(currentPage.value)
  } else {
    toast.error(res?.response?.data?.message ?? 'Failed to delete user')
  }
  deletingLoading.value = false
}

onMounted(() => fetchPage())
</script>
