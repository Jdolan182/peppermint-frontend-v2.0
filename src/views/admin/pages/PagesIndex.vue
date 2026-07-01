<template>
  <div>
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Pages</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Build and manage your public pages</p>
      </div>
      <button
        @click="createPage"
        class="rounded-lg bg-gray-900 dark:bg-white px-4 py-2 text-sm font-semibold text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-100 transition-colors"
      >New page</button>
    </div>

    <div class="mt-8">
      <div v-if="loading" class="text-sm text-gray-400">Loading…</div>

      <template v-else-if="pages.length">
        <!-- Top-level pages are draggable to reorder nav -->
        <draggable
          v-model="pages"
          item-key="id"
          handle=".page-drag-handle"
          ghost-class="opacity-40"
          @end="saveNavOrder"
          class="space-y-3"
        >
          <template #item="{ element: page }">
            <div class="rounded-xl bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700">
              <!-- Parent page row -->
              <div class="flex items-center justify-between px-5 py-4">
                <div class="flex items-center gap-3 min-w-0">
                  <span class="page-drag-handle cursor-grab active:cursor-grabbing text-gray-300 dark:text-gray-600 hover:text-gray-400 select-none">⠿</span>
                  <button
                    v-if="page.children?.length"
                    @click="toggleExpanded(page.id)"
                    class="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <ChevronRightIcon
                      class="w-4 h-4 transition-transform duration-150"
                      :class="{ 'rotate-90': expanded[page.id] }"
                    />
                  </button>
                  <span v-else class="w-4 flex-shrink-0" />
                  <span
                    class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                    :class="page.is_published ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'"
                  >{{ page.is_published ? 'Live' : 'Draft' }}</span>
                  <span v-if="page.is_home" class="inline-flex items-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 px-2 py-0.5 text-xs font-medium">Home</span>
                  <span class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ page.title }}</span>
                  <span class="text-xs text-gray-400">/{{ page.slug }}</span>
                  <span v-if="page.children?.length && !expanded[page.id]" class="text-xs text-gray-400">({{ page.children.length }})</span>
                </div>
                <div class="flex items-center gap-2 flex-shrink-0">
                  <button
                    @click="router.push({ name: 'PageEditor', params: { id: page.id } })"
                    class="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >Edit</button>
                  <button
                    @click="deletePage(page)"
                    class="rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >Delete</button>
                </div>
              </div>

              <!-- Children — draggable within their parent only, collapsed by default -->
              <draggable
                v-if="page.children?.length && expanded[page.id]"
                v-model="page.children"
                item-key="id"
                handle=".child-drag-handle"
                ghost-class="opacity-40"
                @end="saveNavOrder"
              >
                <template #item="{ element: child }">
                  <div class="flex items-center justify-between px-5 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <div class="flex items-center gap-3 min-w-0 pl-4">
                      <span class="child-drag-handle cursor-grab active:cursor-grabbing text-gray-300 dark:text-gray-600 hover:text-gray-400 select-none text-xs">⠿</span>
                      <span class="text-gray-300 dark:text-gray-600 select-none">↳</span>
                      <span
                        class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                        :class="child.is_published ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'"
                      >{{ child.is_published ? 'Live' : 'Draft' }}</span>
                      <span class="text-sm text-gray-700 dark:text-gray-300 truncate">{{ child.title }}</span>
                      <span class="text-xs text-gray-400">/{{ child.slug }}</span>
                    </div>
                    <div class="flex items-center gap-2 flex-shrink-0">
                      <button
                        @click="router.push({ name: 'PageEditor', params: { id: child.id } })"
                        class="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >Edit</button>
                      <button
                        @click="deletePage(child)"
                        class="rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >Delete</button>
                    </div>
                  </div>
                </template>
              </draggable>
            </div>
          </template>
        </draggable>
      </template>

      <div v-else class="rounded-xl bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 px-6 py-12 text-center">
        <p class="text-sm text-gray-500 dark:text-gray-400">No pages yet. Create your first page to get started.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAxios } from '@/composables/request'
import draggable from 'vuedraggable'
import { ChevronRightIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const pages = ref([])
const loading = ref(true)
const expanded = ref({})

function toggleExpanded(id) {
  expanded.value = { ...expanded.value, [id]: !expanded.value[id] }
}

async function load() {
  loading.value = true
  const res = await useAxios.get('/api/admin/pages')
  pages.value = res?.data ?? []
  loading.value = false
}

async function createPage() {
  const res = await useAxios.post('/api/admin/pages', { title: 'New page', slug: '' })
  if (res?.data?.id) {
    router.push({ name: 'PageEditor', params: { id: res.data.id } })
  }
}

async function deletePage(page) {
  if (!confirm(`Delete "${page.title}"?`)) return
  await useAxios.delete(`/api/admin/pages/${page.id}`)
  await load()
}

async function saveNavOrder() {
  const items = []
  pages.value.forEach((page, i) => {
    items.push({ id: page.id, nav_order: i, parent_id: null })
    ;(page.children ?? []).forEach((child, j) => {
      items.push({ id: child.id, nav_order: j, parent_id: page.id })
    })
  })
  await useAxios.put('/api/admin/pages/nav-order', { items })
}

onMounted(load)
</script>
