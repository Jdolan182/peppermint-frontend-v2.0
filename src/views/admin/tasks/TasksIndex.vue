<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Tasks</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage and track all tasks</p>
      </div>
      <div class="flex items-center gap-2">
        <!-- View toggle -->
        <div class="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <button
            @click="view = 'kanban'"
            class="px-3 py-1.5 text-xs font-medium transition-colors"
            :class="view === 'kanban' ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'"
          >Kanban</button>
          <button
            @click="view = 'list'"
            class="px-3 py-1.5 text-xs font-medium transition-colors"
            :class="view === 'list' ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'"
          >List</button>
        </div>
        <button
          @click="openNew"
          class="rounded-lg bg-gray-900 dark:bg-white px-4 py-2 text-sm font-semibold text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-100 transition-colors"
        >New task</button>
      </div>
    </div>

    <!-- Filters -->
    <div class="mt-5 flex flex-wrap items-center gap-3">
      <input
        v-model="filters.search"
        type="text"
        placeholder="Search…"
        class="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48"
      />
      <select v-model="filters.type_id" class="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
        <option value="">All types</option>
        <option v-for="t in types" :key="t.id" :value="t.id">{{ t.name }}</option>
      </select>
      <select v-model="filters.priority" class="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
        <option value="">All priorities</option>
        <option value="critical">Critical</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      <label class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
        <input type="checkbox" v-model="filters.mine" class="rounded" />
        Mine only
      </label>
    </div>

    <div v-if="loading" class="mt-8 text-sm text-gray-400">Loading…</div>

    <!-- Kanban view -->
    <div v-else-if="view === 'kanban'" class="mt-6 flex gap-4 overflow-x-auto pb-4">
      <div
        v-for="col in kanbanColumns"
        :key="col.id"
        class="flex-shrink-0 w-72"
      >
        <!-- Column header -->
        <div class="flex items-center gap-2 mb-3 px-1">
          <span class="w-2.5 h-2.5 rounded-full flex-shrink-0" :style="{ background: col.color }" />
          <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">{{ col.name }}</span>
          <span class="text-xs text-gray-400 ml-auto">{{ col.tasks.length }}</span>
        </div>

        <!-- Cards -->
        <div class="space-y-2 min-h-[80px]">
          <div
            v-for="task in col.tasks"
            :key="task.id"
            @click="openEdit(task)"
            class="rounded-xl bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 p-4 cursor-pointer hover:ring-indigo-300 dark:hover:ring-indigo-600 transition-all"
          >
            <div class="flex items-start justify-between gap-2">
              <p class="text-sm font-medium text-gray-900 dark:text-white leading-snug">{{ task.title }}</p>
              <span
                class="flex-shrink-0 rounded px-1.5 py-0.5 text-xs font-medium"
                :class="priorityClass(task.priority)"
              >{{ task.priority }}</span>
            </div>
            <div class="mt-2 flex flex-wrap gap-1.5">
              <span v-if="task.type" class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs" :style="{ background: task.type.color + '22', color: task.type.color }">
                {{ task.type.name }}
              </span>
              <span v-if="task.due_date" class="text-xs text-gray-400">Due {{ formatDate(task.due_date) }}</span>
            </div>
            <div v-if="task.assigned_admin || task.consumer" class="mt-2 flex items-center gap-1 text-xs text-gray-400">
              <span v-if="task.assigned_admin">{{ task.assigned_admin.name }}</span>
              <span v-if="task.assigned_admin && task.consumer">·</span>
              <span v-if="task.consumer">{{ task.consumer.name }}</span>
            </div>
          </div>

          <button
            @click="openNewInStatus(col.id)"
            class="w-full rounded-xl border border-dashed border-gray-200 dark:border-gray-700 py-2 text-xs text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-colors"
          >+ Add task</button>
        </div>
      </div>
    </div>

    <!-- List view -->
    <div v-else class="mt-6 rounded-xl bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 overflow-hidden">
      <div v-if="!filteredTasks.length" class="px-6 py-12 text-center text-sm text-gray-400">No tasks found.</div>
      <table v-else class="w-full text-sm">
        <thead class="border-b border-gray-100 dark:border-gray-700">
          <tr>
            <th class="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400">Title</th>
            <th class="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400">Type</th>
            <th class="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400">Status</th>
            <th class="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400">Priority</th>
            <th class="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400">Due</th>
            <th class="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400">Assigned</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
          <tr
            v-for="task in filteredTasks"
            :key="task.id"
            @click="openEdit(task)"
            class="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <td class="px-5 py-3 font-medium text-gray-900 dark:text-white">{{ task.title }}</td>
            <td class="px-5 py-3">
              <span v-if="task.type" class="rounded-full px-2 py-0.5 text-xs" :style="{ background: task.type.color + '22', color: task.type.color }">
                {{ task.type.name }}
              </span>
            </td>
            <td class="px-5 py-3">
              <span v-if="task.status" class="inline-flex items-center gap-1.5 text-xs text-gray-700 dark:text-gray-300">
                <span class="w-2 h-2 rounded-full" :style="{ background: task.status.color }" />
                {{ task.status.name }}
              </span>
            </td>
            <td class="px-5 py-3">
              <span class="rounded px-1.5 py-0.5 text-xs font-medium" :class="priorityClass(task.priority)">{{ task.priority }}</span>
            </td>
            <td class="px-5 py-3 text-xs text-gray-500 dark:text-gray-400">{{ task.due_date ? formatDate(task.due_date) : '—' }}</td>
            <td class="px-5 py-3 text-xs text-gray-500 dark:text-gray-400">{{ task.assigned_admin?.name ?? '—' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <TaskDrawer
      v-model="drawerOpen"
      :task="editingTask"
      :types="types"
      :statuses="statuses"
      :admins="admins"
      :consumers="consumers"
      :roadmap-items="roadmapItems"
      @saved="onSaved"
      @deleted="onDeleted"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAxios } from '@/composables/request'
import TaskDrawer from '@/components/tasks/TaskDrawer.vue'

const view = ref('kanban')
const loading = ref(true)
const tasks = ref([])
const types = ref([])
const statuses = ref([])
const admins = ref([])
const consumers = ref([])
const roadmapItems = ref([])

const filters = ref({ search: '', type_id: '', priority: '', mine: false })
const drawerOpen = ref(false)
const editingTask = ref(null)

const filteredTasks = computed(() => {
  return tasks.value.filter(t => {
    if (filters.value.search && !t.title.toLowerCase().includes(filters.value.search.toLowerCase())) return false
    if (filters.value.type_id && t.type_id !== filters.value.type_id) return false
    if (filters.value.priority && t.priority !== filters.value.priority) return false
    return true
  })
})

const kanbanColumns = computed(() =>
  statuses.value.map(s => ({
    ...s,
    tasks: filteredTasks.value.filter(t => t.status_id === s.id),
  }))
)

function priorityClass(p) {
  return {
    critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    low: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
  }[p] ?? ''
}

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function openNew() {
  editingTask.value = null
  drawerOpen.value = true
}

function openNewInStatus(statusId) {
  editingTask.value = { status_id: statusId }
  drawerOpen.value = true
}

function openEdit(task) {
  editingTask.value = task
  drawerOpen.value = true
}

function onSaved(task) {
  const idx = tasks.value.findIndex(t => t.id === task.id)
  if (idx >= 0) tasks.value[idx] = task
  else tasks.value.unshift(task)
}

function onDeleted(id) {
  tasks.value = tasks.value.filter(t => t.id !== id)
}

async function load() {
  loading.value = true
  const [tasksRes, typesRes, statusesRes, adminsRes, consumersRes, roadmapRes] = await Promise.all([
    useAxios.get('/api/admin/tasks'),
    useAxios.get('/api/admin/task-types'),
    useAxios.get('/api/admin/task-statuses'),
    useAxios.get('/api/admin/users'),
    useAxios.get('/api/admin/consumers'),
    useAxios.get('/api/admin/roadmap'),
  ])
  tasks.value = tasksRes?.data ?? []
  types.value = typesRes?.data ?? []
  statuses.value = statusesRes?.data ?? []
  admins.value = adminsRes?.data?.data ?? adminsRes?.data ?? []
  consumers.value = consumersRes?.data?.data ?? consumersRes?.data ?? []
  roadmapItems.value = roadmapRes?.data ?? []
  loading.value = false
}

onMounted(load)
</script>
