<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <div class="mx-auto max-w-4xl px-4 py-10 sm:px-6">

      <!-- Header -->
      <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">My Calendar</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Tasks by due date</p>
        </div>
        <!-- Month nav -->
        <div class="flex items-center gap-2">
          <button @click="prevMonth" class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <svg class="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span class="text-sm font-semibold text-gray-900 dark:text-white min-w-[160px] text-center">{{ monthLabel }}</span>
          <button @click="nextMonth" class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <svg class="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button
            @click="goToday"
            class="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >Today</button>
        </div>
      </div>

      <!-- Calendar grid -->
      <div class="rounded-xl bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 overflow-hidden">
        <!-- Day headers -->
        <div class="grid grid-cols-7 border-b border-gray-100 dark:border-gray-700">
          <div v-for="d in DAYS" :key="d" class="py-2.5 text-center text-xs font-semibold text-gray-500 dark:text-gray-400">{{ d }}</div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="p-16 text-center">
          <div class="w-6 h-6 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin mx-auto" />
        </div>

        <!-- Cells -->
        <div v-else class="grid grid-cols-7">
          <div
            v-for="(cell, i) in calendarCells"
            :key="i"
            class="min-h-[100px] border-b border-r border-gray-100 dark:border-gray-700 p-2"
            :class="[
              cell.isCurrentMonth ? '' : 'bg-gray-50/60 dark:bg-gray-900/40',
              i % 7 === 6 ? 'border-r-0' : '',
            ]"
          >
            <span
              class="inline-flex w-6 h-6 items-center justify-center rounded-full text-xs font-semibold mb-1"
              :class="[
                cell.isToday ? 'bg-indigo-600 text-white' : 'text-gray-700 dark:text-gray-300',
                cell.isCurrentMonth ? '' : 'opacity-40',
              ]"
            >{{ cell.day }}</span>

            <div class="space-y-0.5">
              <button
                v-for="task in cell.tasks"
                :key="task.id"
                @click="selected = selected === task.id ? null : task.id"
                class="w-full truncate rounded px-1.5 py-0.5 text-xs font-medium text-left transition-opacity hover:opacity-75"
                :style="{ background: (task.status?.color ?? '#6366f1') + '22', color: task.status?.color ?? '#6366f1' }"
                :title="task.title"
              >{{ task.title }}</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Selected task detail panel -->
      <div v-if="selectedTask" class="mt-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 px-6 py-5 space-y-3">
        <div class="flex items-start justify-between gap-4">
          <div class="flex items-center gap-3 flex-1 min-w-0">
            <span class="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-0.5" :style="{ background: selectedTask.status?.color ?? '#9ca3af' }" />
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white leading-snug">{{ selectedTask.title }}</h3>
          </div>
          <button @click="selected = null" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 flex-shrink-0">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p v-if="selectedTask.description" class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{{ selectedTask.description }}</p>

        <dl class="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
          <div v-if="selectedTask.status">
            <dt class="text-gray-400 mb-0.5">Status</dt>
            <dd class="font-medium" :style="{ color: selectedTask.status.color }">{{ selectedTask.status.name }}</dd>
          </div>
          <div v-if="selectedTask.priority">
            <dt class="text-gray-400 mb-0.5">Priority</dt>
            <dd class="text-gray-700 dark:text-gray-300 font-medium capitalize">{{ selectedTask.priority }}</dd>
          </div>
          <div v-if="selectedTask.due_date">
            <dt class="text-gray-400 mb-0.5">Due date</dt>
            <dd class="font-medium" :class="isOverdue(selectedTask) ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'">
              {{ formatDate(selectedTask.due_date) }}
            </dd>
          </div>
          <div v-if="selectedTask.assigned_admin">
            <dt class="text-gray-400 mb-0.5">Assigned by</dt>
            <dd class="text-gray-700 dark:text-gray-300 font-medium">{{ selectedTask.assigned_admin.name }}</dd>
          </div>
        </dl>

        <p v-if="selectedTask.notes" class="text-xs text-gray-400 italic border-t border-gray-100 dark:border-gray-800 pt-3">{{ selectedTask.notes }}</p>
      </div>

      <!-- Empty state for this month -->
      <div v-else-if="!loading && tasksThisMonth.length === 0" class="mt-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 px-6 py-10 text-center">
        <p class="text-sm text-gray-400">No tasks due this month.</p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAxios } from '@/composables/request'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const tasks = ref([])
const loading = ref(true)
const selected = ref(null)

const today = new Date()
const currentYear = ref(today.getFullYear())
const currentMonth = ref(today.getMonth())

const monthLabel = computed(() => {
  return new Date(currentYear.value, currentMonth.value, 1)
    .toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
})

function prevMonth() {
  if (currentMonth.value === 0) { currentMonth.value = 11; currentYear.value-- }
  else currentMonth.value--
  selected.value = null
}

function nextMonth() {
  if (currentMonth.value === 11) { currentMonth.value = 0; currentYear.value++ }
  else currentMonth.value++
  selected.value = null
}

function goToday() {
  currentYear.value = today.getFullYear()
  currentMonth.value = today.getMonth()
  selected.value = null
}

const calendarCells = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrev = new Date(year, month, 0).getDate()
  const todayStr = today.toISOString().slice(0, 10)

  const cells = []

  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: daysInPrev - i, isCurrentMonth: false, tasks: [], isToday: false })
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    cells.push({
      day: d,
      isCurrentMonth: true,
      isToday: dateStr === todayStr,
      tasks: tasks.value.filter(t => t.due_date?.slice(0, 10) === dateStr),
    })
  }

  let next = 1
  while (cells.length % 7 !== 0) {
    cells.push({ day: next++, isCurrentMonth: false, tasks: [], isToday: false })
  }

  return cells
})

const tasksThisMonth = computed(() => {
  const prefix = `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, '0')}`
  return tasks.value.filter(t => t.due_date?.slice(0, 7) === prefix)
})

const selectedTask = computed(() => tasks.value.find(t => t.id === selected.value) ?? null)

function formatDate(d) {
  if (!d) return ''
  return new Date(d.slice(0, 10) + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function isOverdue(task) {
  if (!task.due_date) return false
  return new Date(task.due_date.slice(0, 10) + 'T00:00:00') < new Date(new Date().toDateString())
}

onMounted(async () => {
  const res = await useAxios.get('/api/consumer/tasks')
  tasks.value = res?.data ?? []
  loading.value = false
})
</script>
