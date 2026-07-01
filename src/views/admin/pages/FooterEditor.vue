<template>
  <div>
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Footer</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage the global footer shown across all pages</p>
      </div>
    </div>

    <draggable
      v-model="sections"
      item-key="id"
      handle=".drag-handle"
      ghost-class="opacity-40"
      @end="saveOrder"
      class="mt-8 space-y-3"
    >
      <template #item="{ element: section }">
        <div class="rounded-xl bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 overflow-hidden">
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
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ footerLabel(section.type) }}</span>
            </div>
            <button
              @click.stop="remove(section)"
              class="text-xs text-red-500 hover:text-red-700"
            >Remove</button>
          </div>
          <div v-show="!collapsed[section.id]" class="px-5 py-4">
            <BlockEditor :section="section" :footer="true" @update="(data) => update(section, data)" />
          </div>
        </div>
      </template>
    </draggable>

    <div
      v-if="!sections.length"
      class="mt-3 rounded-xl bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 px-6 py-12 text-center"
    >
      <p class="text-sm text-gray-400">No footer blocks yet.</p>
    </div>

    <!-- Add footer block -->
    <div class="mt-3 rounded-xl bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 px-5 py-4">
      <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Add block</p>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="block in FOOTER_BLOCKS"
          :key="block.type"
          @click="add(block)"
          class="rounded-lg border border-gray-200 dark:border-gray-600 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >{{ block.label }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAxios } from '@/composables/request'
import { FOOTER_BLOCKS, getFooterBlock } from '@/composables/blockRegistry'
import BlockEditor from '@/components/pages/BlockEditor.vue'
import draggable from 'vuedraggable'
import { ChevronRightIcon } from '@heroicons/vue/24/outline'

const sections = ref([])
const collapsed = ref({})

function footerLabel(type) {
  return getFooterBlock(type)?.label ?? type
}

function toggleCollapse(id) {
  collapsed.value = { ...collapsed.value, [id]: !collapsed.value[id] }
}

async function load() {
  const res = await useAxios.get('/api/admin/footer')
  sections.value = res?.data ?? []
}

async function add(block) {
  const res = await useAxios.post('/api/admin/footer/sections', {
    type: block.type,
    data: { ...block.defaultData },
  })
  if (res?.data) sections.value.push(res.data)
}

async function update(section, data) {
  await useAxios.put(`/api/admin/footer/sections/${section.id}`, { data })
  section.data = data
}

async function remove(section) {
  if (!confirm('Remove this footer block?')) return
  await useAxios.delete(`/api/admin/footer/sections/${section.id}`)
  sections.value = sections.value.filter(s => s.id !== section.id)
}

async function saveOrder() {
  const payload = sections.value.map((s, i) => ({ id: s.id, order: i }))
  await useAxios.put('/api/admin/footer/sections/order', { items: payload })
}

onMounted(load)
</script>
