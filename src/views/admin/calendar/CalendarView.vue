<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between flex-wrap gap-3">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Calendar</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Tasks and roadmap items by date</p>
      </div>
      <div class="flex items-center gap-3 flex-wrap">
        <!-- View toggle -->
        <div class="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden text-xs">
          <button @click="view = 'month'" class="px-3 py-1.5 font-medium transition-colors" :class="view === 'month' ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'">Month</button>
          <button @click="switchToDay(selectedDay)" class="px-3 py-1.5 font-medium transition-colors" :class="view === 'day' ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'">Day</button>
        </div>

        <!-- Type filter -->
        <div class="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden text-xs">
          <button @click="showTasks = !showTasks" class="px-3 py-1.5 font-medium transition-colors" :class="showTasks ? 'bg-indigo-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'">Tasks</button>
          <button @click="showRoadmap = !showRoadmap" class="px-3 py-1.5 font-medium transition-colors" :class="showRoadmap ? 'bg-indigo-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'">Roadmap</button>
        </div>

        <!-- Nav -->
        <div class="flex items-center gap-2">
          <button @click="view === 'month' ? prevMonth() : prevDay()" class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ChevronLeftIcon class="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </button>
          <span class="text-sm font-semibold text-gray-900 dark:text-white min-w-[200px] text-center">
            {{ view === 'month' ? monthLabel : dayLabel }}
          </span>
          <button @click="view === 'month' ? nextMonth() : nextDay()" class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ChevronRightIcon class="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </button>
          <button @click="goToday" class="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Today</button>
        </div>
      </div>
    </div>

    <!-- ─── MONTH VIEW ─────────────────────────────────────────────── -->
    <div v-if="view === 'month'" class="mt-6 rounded-xl bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 overflow-hidden relative">
      <div v-if="calendarLoading" class="absolute inset-0 z-10 bg-white/60 dark:bg-gray-800/60 flex items-center justify-center">
        <div class="w-6 h-6 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
      </div>
      <!-- Day of week headers -->
      <div class="grid grid-cols-7 border-b border-gray-100 dark:border-gray-700">
        <div v-for="d in DAYS" :key="d" class="py-2.5 text-center text-xs font-semibold text-gray-500 dark:text-gray-400">{{ d }}</div>
      </div>
      <!-- Weeks -->
      <div class="grid grid-cols-7">
        <div
          v-for="(cell, i) in calendarCells"
          :key="i"
          class="min-h-[110px] border-b border-r border-gray-100 dark:border-gray-700 p-2 group/cell cursor-pointer"
          :class="[
            cell.isCurrentMonth ? '' : 'bg-gray-50/60 dark:bg-gray-900/40',
            i % 7 === 6 ? 'border-r-0' : '',
          ]"
          @click.self="openNewTask(cell.date)"
        >
          <!-- Day number — click to switch to day view -->
          <button
            @click="switchToDay(cell.date)"
            class="inline-flex w-6 h-6 items-center justify-center rounded-full text-xs font-semibold mb-1 transition-colors"
            :class="[
              cell.isToday
                ? 'bg-indigo-600 text-white'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300',
              cell.isCurrentMonth ? '' : 'opacity-40',
            ]"
          >{{ cell.day }}</button>

          <div class="space-y-0.5">
            <button
              v-for="event in cell.events"
              :key="event._key"
              @click.stop="openEventModal(event)"
              class="w-full truncate rounded px-1.5 py-0.5 text-xs font-medium text-left transition-opacity hover:opacity-75"
              :style="{ background: event._color + '22', color: event._color }"
              :title="event.title"
            >{{ event.title }}</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ─── DAY VIEW ───────────────────────────────────────────────── -->
    <div v-else class="mt-6">
      <!-- Empty state -->
      <div v-if="!dayEvents.length" class="rounded-xl bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 px-6 py-16 text-center">
        <CalendarDaysIcon class="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Nothing scheduled</p>
        <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">No tasks or roadmap items due on this day.</p>
      </div>

      <!-- Event list -->
      <div v-else class="space-y-3">
        <!-- Tasks group -->
        <template v-if="showTasks && dayTasks.length">
          <p class="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 px-1">Tasks</p>
          <div
            v-for="event in dayTasks"
            :key="event._key"
            @click="openEventModal(event)"
            class="rounded-xl bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 px-5 py-4 cursor-pointer hover:ring-indigo-300 dark:hover:ring-indigo-600 transition-all flex items-start gap-4"
          >
            <div class="w-1 self-stretch rounded-full flex-shrink-0 mt-0.5" :style="{ background: event._color }" />
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-3">
                <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ event.title }}</p>
                <div class="flex items-center gap-2 flex-shrink-0">
                  <span v-if="event._priority" class="text-xs font-semibold rounded px-1.5 py-0.5 capitalize" :class="priorityClass(event._priority)">{{ event._priority }}</span>
                  <span class="inline-flex items-center gap-1 text-xs rounded-full px-2 py-0.5 font-medium" :style="{ background: event._color + '22', color: event._color }">
                    {{ event._typeLabel }}
                  </span>
                </div>
              </div>
              <p v-if="event._description" class="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{{ event._description }}</p>
              <div class="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-400">
                <span v-if="event._status" class="flex items-center gap-1.5">
                  <span class="w-1.5 h-1.5 rounded-full" :style="{ background: event._statusColor }" />
                  {{ event._status }}
                </span>
                <span v-if="event._assignee">{{ event._assignee }}</span>
                <span v-if="event._consumer">{{ event._consumer }}</span>
              </div>
            </div>
          </div>
        </template>

        <!-- Roadmap group -->
        <template v-if="showRoadmap && dayRoadmap.length">
          <p class="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 px-1 mt-4">Roadmap</p>
          <div
            v-for="event in dayRoadmap"
            :key="event._key"
            @click="openEventModal(event)"
            class="rounded-xl bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 px-5 py-4 cursor-pointer hover:ring-indigo-300 dark:hover:ring-indigo-600 transition-all flex items-start gap-4"
          >
            <div class="w-1 self-stretch rounded-full flex-shrink-0 mt-0.5" :style="{ background: event._color }" />
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-3">
                <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ event.title }}</p>
                <span class="flex-shrink-0 text-xs font-semibold rounded-full px-2 py-0.5" :style="{ background: event._statusColor + '22', color: event._statusColor }">{{ event._status }}</span>
              </div>
              <p v-if="event._description" class="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{{ event._description }}</p>
              <div class="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-400">
                <span v-if="event._category">{{ event._category }}</span>
                <span v-if="event._assignee">{{ event._assignee }}</span>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- ─── EVENT DETAIL MODAL ─────────────────────────────────────── -->
    <Teleport to="body">
      <div v-if="selectedEvent" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" @click="selectedEvent = null" />

        <div class="relative z-10 w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
          <div class="h-1.5 w-full" :style="{ background: selectedEvent._color }" />

          <div class="px-6 py-5">
            <div class="flex items-center justify-between mb-3">
              <span
                class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
                :style="{ background: selectedEvent._color + '22', color: selectedEvent._color }"
              >
                <span class="w-1.5 h-1.5 rounded-full" :style="{ background: selectedEvent._color }" />
                {{ selectedEvent._typeLabel }}
              </span>
              <button @click="selectedEvent = null" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <XMarkIcon class="w-4 h-4" />
              </button>
            </div>

            <h3 class="text-base font-semibold text-gray-900 dark:text-white leading-snug">{{ selectedEvent.title }}</h3>

            <p v-if="selectedEvent._description" class="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-3">{{ selectedEvent._description }}</p>

            <dl class="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
              <div v-if="selectedEvent._status">
                <dt class="text-xs font-medium text-gray-400 mb-0.5">Status</dt>
                <dd class="flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full" :style="{ background: selectedEvent._statusColor }" />
                  <span class="text-sm text-gray-700 dark:text-gray-300">{{ selectedEvent._status }}</span>
                </dd>
              </div>
              <div v-if="selectedEvent._priority">
                <dt class="text-xs font-medium text-gray-400 mb-0.5">Priority</dt>
                <dd><span class="text-xs font-semibold rounded px-1.5 py-0.5 capitalize" :class="priorityClass(selectedEvent._priority)">{{ selectedEvent._priority }}</span></dd>
              </div>
              <div v-if="selectedEvent._date">
                <dt class="text-xs font-medium text-gray-400 mb-0.5">{{ selectedEvent._type === 'task' ? 'Due date' : 'Target date' }}</dt>
                <dd class="text-sm text-gray-700 dark:text-gray-300">{{ selectedEvent._date }}</dd>
              </div>
              <div v-if="selectedEvent._assignee">
                <dt class="text-xs font-medium text-gray-400 mb-0.5">Assigned to</dt>
                <dd class="text-sm text-gray-700 dark:text-gray-300 truncate">{{ selectedEvent._assignee }}</dd>
              </div>
              <div v-if="selectedEvent._consumer">
                <dt class="text-xs font-medium text-gray-400 mb-0.5">Consumer</dt>
                <dd class="text-sm text-gray-700 dark:text-gray-300 truncate">{{ selectedEvent._consumer }}</dd>
              </div>
              <div v-if="selectedEvent._category">
                <dt class="text-xs font-medium text-gray-400 mb-0.5">Category</dt>
                <dd class="text-sm text-gray-700 dark:text-gray-300">{{ selectedEvent._category }}</dd>
              </div>
            </dl>
          </div>

          <div class="border-t border-gray-100 dark:border-gray-700 px-6 py-4 flex items-center justify-end gap-3">
            <button @click="selectedEvent = null" class="px-4 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Close</button>
            <router-link
              :to="selectedEvent._type === 'task' ? { name: 'Tasks' } : { name: 'Roadmap' }"
              @click="selectedEvent = null"
              class="px-4 py-2 rounded-lg bg-gray-900 dark:bg-white text-sm font-semibold text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-100 transition-colors"
            >View in {{ selectedEvent._type === 'task' ? 'Tasks' : 'Roadmap' }} →</router-link>
          </div>
        </div>
      </div>
    </Teleport>

    <TaskDrawer
      v-model="taskDrawerOpen"
      :task="newTaskDraft"
      :types="taskTypes"
      :statuses="taskStatuses"
      :admins="taskAdmins"
      :consumers="taskConsumers"
      :roadmap-items="taskRoadmapItems"
      @saved="onTaskSaved"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon, CalendarDaysIcon } from '@heroicons/vue/24/outline'
import { useAxios } from '@/composables/request'
import TaskDrawer from '@/components/tasks/TaskDrawer.vue'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const today = new Date()

// ── View state ────────────────────────────────────────────────────────────────
const view = ref('month')
const currentYear  = ref(today.getFullYear())
const currentMonth = ref(today.getMonth())
const selectedDay  = ref(new Date(today))

const showTasks   = ref(true)
const showRoadmap = ref(true)
const selectedEvent = ref(null)

const tasks          = ref([])
const roadmapItems   = ref([])
const calendarLoading = ref(false)

// ── Task creation ─────────────────────────────────────────────────────────────
const taskDrawerOpen    = ref(false)
const newTaskDraft      = ref(null)
const taskTypes         = ref([])
const taskStatuses      = ref([])
const taskAdmins        = ref([])
const taskConsumers     = ref([])
const taskRoadmapItems  = ref([])

function openNewTask(date) {
  newTaskDraft.value = { due_date: dateStr(date) }
  taskDrawerOpen.value = true
}

function onTaskSaved(task) {
  tasks.value.push(task)
}

// ── Status meta ───────────────────────────────────────────────────────────────
const ROADMAP_STATUS = {
  planned:       { label: 'Planned',     color: '#6366f1' },
  'in-progress': { label: 'In Progress', color: '#3b82f6' },
  shipped:       { label: 'Shipped',     color: '#10b981' },
  cancelled:     { label: 'Cancelled',   color: '#ef4444' },
}

// ── Labels ────────────────────────────────────────────────────────────────────
const monthLabel = computed(() =>
  new Date(currentYear.value, currentMonth.value, 1)
    .toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
)

const dayLabel = computed(() =>
  selectedDay.value.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
)

// ── Month navigation ──────────────────────────────────────────────────────────
function prevMonth() {
  if (currentMonth.value === 0) { currentMonth.value = 11; currentYear.value-- }
  else currentMonth.value--
}

function nextMonth() {
  if (currentMonth.value === 11) { currentMonth.value = 0; currentYear.value++ }
  else currentMonth.value++
}

// ── Day navigation ────────────────────────────────────────────────────────────
function prevDay() {
  const d = new Date(selectedDay.value)
  d.setDate(d.getDate() - 1)
  switchToDay(d)
}

function nextDay() {
  const d = new Date(selectedDay.value)
  d.setDate(d.getDate() + 1)
  switchToDay(d)
}

function switchToDay(date) {
  selectedDay.value = new Date(date)
  view.value = 'day'
  // If the selected day is in a different month, update month context to re-fetch
  if (date.getFullYear() !== currentYear.value || date.getMonth() !== currentMonth.value) {
    currentYear.value  = date.getFullYear()
    currentMonth.value = date.getMonth()
  }
}

function goToday() {
  if (view.value === 'month') {
    currentYear.value  = today.getFullYear()
    currentMonth.value = today.getMonth()
  } else {
    switchToDay(new Date(today))
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function priorityClass(p) {
  return {
    critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    high:     'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    medium:   'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    low:      'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
  }[p] ?? ''
}

function formatDate(d) {
  if (!d) return null
  return new Date(d.slice(0, 10) + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function dateStr(d) {
  const pad = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function buildEvent(t) {
  return {
    _key:         'task-' + t.id,
    _type:        'task',
    _typeLabel:   t.type?.name ?? 'Task',
    _color:       t.type?.color ?? '#6366f1',
    _description: t.description,
    _status:      t.status?.name,
    _statusColor: t.status?.color ?? '#9ca3af',
    _priority:    t.priority,
    _date:        formatDate(t.due_date),
    _assignee:    t.assigned_admin?.name ?? null,
    _consumer:    t.consumer?.name ?? null,
    _category:    null,
    title:        t.title,
  }
}

function buildRoadmapEvent(r) {
  const meta = ROADMAP_STATUS[r.status]
  return {
    _key:         'roadmap-' + r.id,
    _type:        'roadmap',
    _typeLabel:   'Roadmap',
    _color:       '#10b981',
    _description: r.description,
    _status:      meta?.label ?? r.status,
    _statusColor: meta?.color ?? '#10b981',
    _priority:    null,
    _date:        formatDate(r.date),
    _assignee:    r.assigned_admin?.name ?? null,
    _consumer:    null,
    _category:    r.category?.name ?? null,
    title:        r.title,
  }
}

function eventsForDate(date) {
  const ds = dateStr(date)
  const events = []
  if (showTasks.value) {
    tasks.value.filter(t => t.due_date?.slice(0, 10) === ds).forEach(t => events.push(buildEvent(t)))
  }
  if (showRoadmap.value) {
    roadmapItems.value.filter(r => r.date?.slice(0, 10) === ds).forEach(r => events.push(buildRoadmapEvent(r)))
  }
  return events
}

// ── Month grid ────────────────────────────────────────────────────────────────
const calendarCells = computed(() => {
  const year  = currentYear.value
  const month = currentMonth.value
  const firstDay    = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrev  = new Date(year, month, 0).getDate()
  const cells = []

  for (let i = firstDay - 1; i >= 0; i--) {
    const d = new Date(year, month - 1, daysInPrev - i)
    cells.push({ day: daysInPrev - i, isCurrentMonth: false, isToday: false, date: d, events: [] })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d)
    cells.push({ day: d, isCurrentMonth: true, isToday: date.toDateString() === today.toDateString(), date, events: eventsForDate(date) })
  }
  let next = 1
  while (cells.length % 7 !== 0) {
    const d = new Date(year, month + 1, next)
    cells.push({ day: next++, isCurrentMonth: false, isToday: false, date: d, events: [] })
  }
  return cells
})

// ── Day view events ───────────────────────────────────────────────────────────
const dayEvents  = computed(() => eventsForDate(selectedDay.value))
const dayTasks   = computed(() => dayEvents.value.filter(e => e._type === 'task'))
const dayRoadmap = computed(() => dayEvents.value.filter(e => e._type === 'roadmap'))

function openEventModal(event) {
  selectedEvent.value = event
}

// ── Data loading ──────────────────────────────────────────────────────────────
async function load() {
  calendarLoading.value = true
  const year  = currentYear.value
  const month = currentMonth.value
  const from  = new Date(year, month, 1).toISOString().slice(0, 10)
  const to    = new Date(year, month + 1, 0).toISOString().slice(0, 10)
  const res = await useAxios.get(`/api/admin/calendar?from=${from}&to=${to}`)
  tasks.value        = res?.data?.tasks ?? []
  roadmapItems.value = res?.data?.roadmap_items ?? []
  calendarLoading.value = false
}

watch([currentYear, currentMonth], load)
onMounted(async () => {
  await load()
  const [typesRes, statusesRes, adminsRes, consumersRes, roadmapRes] = await Promise.all([
    useAxios.get('/api/admin/task-types'),
    useAxios.get('/api/admin/task-statuses'),
    useAxios.get('/api/admin/users'),
    useAxios.get('/api/admin/consumers'),
    useAxios.get('/api/admin/roadmap'),
  ])
  taskTypes.value        = typesRes?.data ?? []
  taskStatuses.value     = statusesRes?.data ?? []
  taskAdmins.value       = adminsRes?.data?.data ?? adminsRes?.data ?? []
  taskConsumers.value    = consumersRes?.data?.data ?? consumersRes?.data ?? []
  taskRoadmapItems.value = roadmapRes?.data ?? []
})
</script>
