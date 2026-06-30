<template>
  <div>
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Blogs</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your blog posts</p>
      </div>
      <router-link
        :to="{ name: 'BlogCreate' }"
        class="rounded-lg bg-gray-900 dark:bg-white px-4 py-2 text-sm font-semibold text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-100 transition-colors"
      >
        New post
      </router-link>
    </div>

    <div class="mt-8">
      <DataTable :columns="columns" :rows="blogs" empty-message="No posts yet.">
        <template #actions="{ row }">
          <router-link :to="{ name: 'BlogEdit', params: { id: row.id } }" class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium mr-4">
            Edit
          </router-link>
          <button class="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium" @click="openDelete(row)">
            Delete
          </button>
        </template>
      </DataTable>
      <Pagination :meta="meta" class="mt-3" @change="fetchPage" />
    </div>

    <ConfirmModal
      v-model="showConfirm"
      title="Delete post"
      :message="`Are you sure you want to delete '${deleting?.title}'?`"
      :loading="deletingLoading"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAxios } from '@/composables/request'
import { formatDate } from '@/helpers/date'
import DataTable from '@/components/tables/DataTable.vue'
import Pagination from '@/components/tables/Pagination.vue'
import ConfirmModal from '@/components/modals/ConfirmModal.vue'

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'author', label: 'Author', format: (v) => v?.name ?? '—' },
  { key: 'published_at', label: 'Status', format: (v) => v ? 'Published' : 'Draft' },
  { key: 'created_at', label: 'Created', format: formatDate },
]

const blogs = ref([])
const meta = ref(null)
const currentPage = ref(1)

const showConfirm = ref(false)
const deleting = ref(null)
const deletingLoading = ref(false)

async function fetchPage(page = 1) {
  currentPage.value = page
  const res = await useAxios.get('/api/admin/blogs', { params: { page, per_page: 15 } })
  if (res?.data) {
    blogs.value = res.data.data
    meta.value = res.data.meta
  }
}

function openDelete(blog) {
  deleting.value = blog
  showConfirm.value = true
}

async function handleDelete() {
  deletingLoading.value = true
  const res = await useAxios.delete(`/api/admin/blogs/${deleting.value.id}`)
  if (res?.status === 200) {
    showConfirm.value = false
    deleting.value = null
    await fetchPage(currentPage.value)
  }
  deletingLoading.value = false
}

onMounted(() => fetchPage())
</script>
