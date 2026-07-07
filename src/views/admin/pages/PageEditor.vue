<template>
  <div v-if="page" class="flex gap-6 h-full min-h-0">

    <!-- Sections (main) -->
    <div class="flex-1 min-w-0 space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-semibold text-gray-900 dark:text-white">{{ meta.title }}</h1>
          <p class="text-sm text-gray-400">/{{ meta.slug }}</p>
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="openPreview"
            class="rounded-lg border border-gray-200 dark:border-gray-600 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >Preview ↗</button>
          <button
            @click="router.push({ name: 'Pages' })"
            class="rounded-lg px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >← Back</button>
        </div>
      </div>

      <!-- Block list -->
      <draggable
        v-model="sections"
        item-key="id"
        handle=".drag-handle"
        ghost-class="opacity-40"
        @end="saveSectionOrder"
        class="space-y-3"
      >
        <template #item="{ element: section }">
          <div class="rounded-xl bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 overflow-hidden">
            <!-- Section header -->
            <div
              class="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-gray-700 cursor-pointer select-none"
              @click="toggleCollapse(section.id)"
            >
              <div class="flex items-center gap-3">
                <span
                  class="drag-handle cursor-grab active:cursor-grabbing text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 px-0.5"
                  @click.stop
                >⠿</span>
                <ChevronRightIcon
                  class="w-4 h-4 text-gray-400 transition-transform duration-150"
                  :class="{ 'rotate-90': !collapsed[section.id] }"
                />
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{{ blockLabel(section.type) }}</span>
              </div>
              <button
                @click.stop="deleteSection(section)"
                class="text-xs text-red-500 hover:text-red-700 transition-colors"
              >Remove</button>
            </div>

            <!-- Block editor -->
            <div v-show="!collapsed[section.id]" class="px-5 py-4">
              <BlockEditor
                :section="section"
                @update="(data) => updateSection(section, data)"
              />
            </div>
          </div>
        </template>
      </draggable>

      <!-- Empty state -->
      <div
        v-if="!sections.length"
        class="rounded-xl bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 px-6 py-12 text-center"
      >
        <p class="text-sm text-gray-400">No blocks yet. Add one below.</p>
      </div>

      <!-- Add block -->
      <div class="rounded-xl bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 px-5 py-4">
        <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Add block</p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="block in PAGE_BLOCKS"
            :key="block.type"
            @click="addSection(block)"
            class="rounded-lg border border-gray-200 dark:border-gray-600 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >{{ block.label }}</button>
        </div>
      </div>
    </div>

    <!-- Settings sidebar -->
    <div class="w-72 flex-shrink-0 space-y-4">
      <div class="rounded-xl bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 p-5 space-y-4">
        <h2 class="text-sm font-semibold text-gray-900 dark:text-white">Page settings</h2>

        <div>
          <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Title</label>
          <input
            v-model="meta.title"
            type="text"
            class="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Slug</label>
          <input
            v-model="meta.slug"
            type="text"
            class="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Nav label <span class="font-normal">(overrides title in nav)</span></label>
          <input
            v-model="meta.nav_label"
            type="text"
            class="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Parent page</label>
          <select
            v-model="meta.parent_id"
            class="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option :value="null">None (top level)</option>
            <option v-for="p in allPages.filter(p => p.id !== page.id)" :key="p.id" :value="p.id">{{ p.title }}</option>
          </select>
        </div>

        <div class="space-y-3 pt-1">
          <label class="flex items-center justify-between">
            <span class="text-sm text-gray-700 dark:text-gray-300">Show in nav</span>
            <Toggle v-model="meta.show_in_nav" />
          </label>
          <label class="flex items-center justify-between">
            <span class="text-sm text-gray-700 dark:text-gray-300">Show footer</span>
            <Toggle v-model="meta.show_footer" />
          </label>
          <label class="flex items-center justify-between">
            <span class="text-sm text-gray-700 dark:text-gray-300">Published</span>
            <Toggle v-model="meta.is_published" />
          </label>
        </div>

        <button
          @click="saveMeta"
          :disabled="savingMeta"
          class="w-full rounded-lg bg-gray-900 dark:bg-white px-4 py-2 text-sm font-semibold text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-100 transition-colors disabled:opacity-50"
        >{{ savingMeta ? 'Saving…' : 'Save settings' }}</button>

        <button
          v-if="!page.is_home"
          @click="setHome"
          class="w-full rounded-lg border border-gray-200 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >Set as home page</button>
        <p v-else class="text-xs text-center text-indigo-600 dark:text-indigo-400 font-medium">✓ This is the home page</p>
      </div>

      <!-- SEO -->
      <div class="rounded-xl bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 p-5 space-y-4">
        <h2 class="text-sm font-semibold text-gray-900 dark:text-white">SEO</h2>
        <div>
          <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Meta title</label>
          <input
            v-model="meta.meta_title"
            type="text"
            class="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Meta description</label>
          <textarea
            v-model="meta.meta_description"
            rows="3"
            class="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>
      </div>
    </div>
  </div>

  <div v-else-if="loading" class="text-sm text-gray-400">Loading…</div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAxios } from '@/composables/request'
import { PAGE_BLOCKS, getPageBlock } from '@/composables/blockRegistry'
import BlockEditor from '@/components/pages/BlockEditor.vue'
import Toggle from '@/components/inputs/Toggle.vue'
import draggable from 'vuedraggable'
import { ChevronRightIcon } from '@heroicons/vue/24/outline'
import { useToast } from '@/composables/useToast'

const toast = useToast()

const route = useRoute()
const router = useRouter()

const page = ref(null)
const sections = ref([])
const allPages = ref([])
const loading = ref(true)
const savingMeta = ref(false)
const collapsed = ref({})

function toggleCollapse(id) {
  collapsed.value = { ...collapsed.value, [id]: !collapsed.value[id] }
}

const meta = reactive({
  title: '',
  slug: '',
  nav_label: '',
  parent_id: null,
  show_in_nav: false,
  show_footer: true,
  is_published: false,
  is_home: false,
  meta_title: '',
  meta_description: '',
})

function blockLabel(type) {
  return getPageBlock(type)?.label ?? type
}

async function load() {
  loading.value = true
  const [pageRes, allRes] = await Promise.all([
    useAxios.get(`/api/admin/pages/${route.params.id}`),
    useAxios.get('/api/admin/pages'),
  ])
  if (pageRes?.data) {
    page.value = pageRes.data
    sections.value = pageRes.data.sections ?? []
    Object.assign(meta, {
      title: pageRes.data.title,
      slug: pageRes.data.slug,
      nav_label: pageRes.data.nav_label ?? '',
      parent_id: pageRes.data.parent_id ?? null,
      show_in_nav: pageRes.data.show_in_nav,
      show_footer: pageRes.data.show_footer,
      is_published: pageRes.data.is_published,
      is_home: pageRes.data.is_home,
      meta_title: pageRes.data.meta_title ?? '',
      meta_description: pageRes.data.meta_description ?? '',
    })
  }
  allPages.value = allRes?.data?.pages ?? []
  loading.value = false
}

async function saveMeta() {
  savingMeta.value = true
  const res = await useAxios.put(`/api/admin/pages/${page.value.id}`, meta)
  if (res?.data) {
    page.value = { ...page.value, ...res.data }
    Object.assign(meta, {
      title:            res.data.title,
      slug:             res.data.slug,
      nav_label:        res.data.nav_label ?? '',
      parent_id:        res.data.parent_id ?? null,
      show_in_nav:      res.data.show_in_nav,
      show_footer:      res.data.show_footer,
      is_published:     res.data.is_published,
      is_home:          res.data.is_home,
      meta_title:       res.data.meta_title ?? '',
      meta_description: res.data.meta_description ?? '',
    })
    toast.success('Page settings saved')
  } else {
    toast.error('Failed to save settings')
  }
  savingMeta.value = false
}

function openPreview() {
  const url = router.resolve({ name: 'PagePreview', params: { id: page.value.id } }).href
  window.open(url, '_blank')
}

async function setHome() {
  await useAxios.post(`/api/admin/pages/${page.value.id}/home`)
  page.value.is_home = true
  meta.is_home = true
  toast.success('Set as home page')
}

async function addSection(block) {
  const res = await useAxios.post(`/api/admin/pages/${page.value.id}/sections`, {
    type: block.type,
    data: { ...block.defaultData },
  })
  if (res?.data) {
    sections.value.push(res.data)
  }
}

async function updateSection(section, data) {
  await useAxios.put(`/api/admin/sections/${section.id}`, { data })
  section.data = data
}

async function deleteSection(section) {
  if (!confirm('Remove this block?')) return
  await useAxios.delete(`/api/admin/sections/${section.id}`)
  sections.value = sections.value.filter(s => s.id !== section.id)
}

async function saveSectionOrder() {
  const payload = sections.value.map((s, i) => ({ id: s.id, order: i }))
  await useAxios.put('/api/admin/sections/order', { items: payload })
}

onMounted(load)
</script>
