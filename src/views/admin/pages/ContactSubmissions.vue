<template>
  <div class="p-6 max-w-5xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Contact Submissions</h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Messages submitted via the contact form.</p>
    </div>

    <div v-if="loading" class="text-sm text-gray-500 dark:text-gray-400">Loading…</div>

    <div v-else-if="!submissions.length" class="rounded-2xl border border-gray-200 dark:border-gray-700 p-12 text-center text-sm text-gray-500 dark:text-gray-400">
      No submissions yet.
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="s in submissions"
        :key="s.id"
        class="rounded-2xl border bg-white dark:bg-gray-800 p-5 transition-colors"
        :class="s.read_at ? 'border-gray-200 dark:border-gray-700' : 'border-indigo-300 dark:border-indigo-600'"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="font-semibold text-gray-900 dark:text-white">{{ s.name }}</span>
              <a :href="`mailto:${s.email}`" class="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">{{ s.email }}</a>
              <span v-if="!s.read_at" class="rounded-full bg-indigo-100 dark:bg-indigo-900/40 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:text-indigo-300">New</span>
              <span v-if="s.page_slug" class="text-xs text-gray-400 dark:text-gray-500">via /{{ s.page_slug }}</span>
            </div>
            <p class="mt-2 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{{ s.message }}</p>
            <p class="mt-2 text-xs text-gray-400 dark:text-gray-500">{{ formatDate(s.created_at) }}</p>
          </div>

          <div class="flex items-center gap-2 flex-shrink-0">
            <button
              v-if="!s.read_at"
              @click="markRead(s)"
              class="rounded-lg border border-gray-200 dark:border-gray-600 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >Mark read</button>
            <button
              @click="remove(s)"
              class="rounded-lg border border-red-200 dark:border-red-800 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >Delete</button>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="meta.last_page > 1" class="flex justify-between items-center pt-2 text-sm">
        <button
          :disabled="meta.current_page === 1"
          @click="load(meta.current_page - 1)"
          class="rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-gray-600 dark:text-gray-300 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >Previous</button>
        <span class="text-gray-500 dark:text-gray-400">Page {{ meta.current_page }} of {{ meta.last_page }}</span>
        <button
          :disabled="meta.current_page === meta.last_page"
          @click="load(meta.current_page + 1)"
          class="rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-gray-600 dark:text-gray-300 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >Next</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAxios } from '@/composables/request'

const submissions = ref([])
const meta = ref({ current_page: 1, last_page: 1 })
const loading = ref(true)

async function load(page = 1) {
  loading.value = true
  const res = await useAxios.get(`/api/admin/contact?page=${page}`)
  submissions.value = res.data.data
  meta.value = res.data
  loading.value = false
}

async function markRead(s) {
  const res = await useAxios.post(`/api/admin/contact/${s.id}/read`)
  Object.assign(s, res.data)
}

async function remove(s) {
  if (!confirm('Delete this submission?')) return
  const res = await useAxios.delete(`/api/admin/contact/${s.id}`)
  if (res?.status === 200 || res?.status === 204) {
    submissions.value = submissions.value.filter(x => x.id !== s.id)
  }
}

function formatDate(iso) {
  return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

onMounted(() => load())
</script>
