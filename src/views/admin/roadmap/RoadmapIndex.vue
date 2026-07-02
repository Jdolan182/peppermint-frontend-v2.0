<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Roadmap</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Plan and track what's coming next</p>
      </div>
      <div class="flex items-center gap-2 flex-wrap">
        <div class="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <button
            @click="view = 'timeline'"
            class="px-3 py-1.5 text-xs font-medium transition-colors"
            :class="view === 'timeline' ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'"
          >Timeline</button>
          <button
            @click="view = 'list'"
            class="px-3 py-1.5 text-xs font-medium transition-colors"
            :class="view === 'list' ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'"
          >List</button>
          <button
            @click="view = 'kanban'"
            class="px-3 py-1.5 text-xs font-medium transition-colors"
            :class="view === 'kanban' ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'"
          >Kanban</button>
        </div>
        <button
          @click="openNew"
          class="rounded-lg bg-gray-900 dark:bg-white px-4 py-2 text-sm font-semibold text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-100 transition-colors"
        >New item</button>
      </div>
    </div>

    <!-- Category filter (list only) -->
    <div v-if="view === 'list' && categories.length" class="mt-5 flex flex-wrap gap-2">
      <button
        @click="filterCategory = null"
        class="rounded-full px-3 py-1 text-xs font-medium transition-colors"
        :class="filterCategory === null ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'"
      >All</button>
      <button
        v-for="cat in categories"
        :key="cat.id"
        @click="filterCategory = cat.id"
        class="rounded-full px-3 py-1 text-xs font-medium transition-colors flex items-center gap-1.5"
        :class="filterCategory === cat.id ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'"
      >
        <span class="w-2 h-2 rounded-full" :style="{ background: cat.color }" />
        {{ cat.name }}
      </button>
    </div>

    <div v-if="loading" class="mt-8 text-sm text-gray-400">Loading…</div>

    <!-- ─── HORIZONTAL GANTT TIMELINE ──────────────────────────────── -->
    <div v-else-if="view === 'timeline'" class="mt-6">
      <!-- Legend -->
      <div class="flex flex-wrap items-center gap-4 mb-3">
        <span v-for="(meta, key) in STATUS_META" :key="key" class="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <span class="w-2.5 h-2.5 rounded-sm flex-shrink-0" :style="{ background: meta.color }" />
          {{ meta.label }}
        </span>
        <span class="ml-auto flex items-center gap-1.5 text-xs text-gray-400">
          <span class="inline-block w-px h-3 bg-indigo-400" />
          Today
        </span>
      </div>

      <div v-if="!items.length" class="text-sm text-gray-400">No roadmap items yet.</div>

      <div v-else ref="ganttScroll" class="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <table class="border-collapse" style="min-width: max-content; width: 100%">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700">
              <th
                class="sticky left-0 z-30 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400"
                style="width:220px; min-width:220px"
              >Item</th>
              <th
                v-for="m in visibleMonths"
                :key="m.key"
                :ref="el => { if (m.isCurrentMonth && el) currentMonthEl = el }"
                class="px-2 py-3 text-center text-xs font-semibold border-r border-gray-100 dark:border-gray-800 last:border-r-0 whitespace-nowrap select-none"
                style="width:140px; min-width:140px"
                :class="m.isCurrentMonth
                  ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                  : 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400'"
              >{{ m.label }}</th>
            </tr>
          </thead>

          <tbody>
            <template v-for="group in ganttGroups" :key="group.label">
              <!-- Category header -->
              <tr class="border-b border-gray-100 dark:border-gray-800">
                <td
                  class="sticky left-0 z-20 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 px-4 py-1.5"
                  style="width:220px; min-width:220px"
                >
                  <span class="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    <span v-if="group.color" class="w-2 h-2 rounded-full flex-shrink-0" :style="{ background: group.color }" />
                    {{ group.label || 'Uncategorised' }}
                  </span>
                </td>
                <td
                  v-for="m in visibleMonths"
                  :key="m.key"
                  class="relative border-r border-gray-100 dark:border-gray-800 last:border-r-0 bg-gray-50 dark:bg-gray-800 overflow-hidden"
                  style="width:140px; min-width:140px"
                >
                  <div v-if="m.isCurrentMonth" class="absolute inset-y-0 w-px bg-indigo-400/40 pointer-events-none" :style="{ left: m.todayPercent + '%' }" />
                </td>
              </tr>

              <!-- One row per item -->
              <tr
                v-for="item in group.items"
                :key="item.id"
                class="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50/70 dark:hover:bg-gray-800/40 cursor-pointer transition-colors group/row"
                @click="openEdit(item)"
              >
                <!-- Sticky label -->
                <td
                  class="sticky left-0 z-20 bg-white dark:bg-gray-900 group-hover/row:bg-gray-50 dark:group-hover/row:bg-gray-800 border-r border-gray-200 dark:border-gray-700 px-4 py-2.5 transition-colors"
                  style="width:220px; min-width:220px"
                >
                  <div class="flex items-center gap-2.5">
                    <span class="w-2 h-2 rounded-full flex-shrink-0" :style="{ background: statusColor(item.status) }" />
                    <span class="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{{ item.title }}</span>
                  </div>
                  <div v-if="item.assigned_admin" class="mt-0.5 pl-[18px] text-xs text-gray-400 truncate">{{ item.assigned_admin.name }}</div>
                </td>

                <!-- Month cells -->
                <td
                  v-for="m in visibleMonths"
                  :key="m.key"
                  class="relative border-r border-gray-100 dark:border-gray-800 last:border-r-0 p-0 overflow-hidden"
                  style="width:140px; min-width:140px; height:46px"
                  :class="m.isCurrentMonth ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''"
                >
                  <!-- Today line -->
                  <div v-if="m.isCurrentMonth" class="absolute inset-y-0 w-px bg-indigo-400/50 z-0 pointer-events-none" :style="{ left: m.todayPercent + '%' }" />

                  <!-- Spanning bar -->
                  <div
                    v-if="barSegment(item, m)"
                    class="absolute top-1/2 -translate-y-1/2 z-10 flex items-center"
                    :style="barSegmentStyle(item, m)"
                  >
                    <div
                      class="h-7 w-full flex items-center px-1.5 overflow-hidden"
                      :class="[
                        barSegment(item, m).isStart ? 'rounded-l-md' : '',
                        barSegment(item, m).isEnd   ? 'rounded-r-md' : '',
                      ]"
                      :style="{
                        background: statusColor(item.status) + '30',
                        borderTop:    '1px solid ' + statusColor(item.status) + '60',
                        borderBottom: '1px solid ' + statusColor(item.status) + '60',
                        borderLeft:   barSegment(item, m).isStart ? '3px solid ' + statusColor(item.status) : 'none',
                        borderRight:  barSegment(item, m).isEnd   ? '1px solid ' + statusColor(item.status) + '60' : 'none',
                      }"
                    >
                      <!-- Show date label only in the start segment -->
                      <span
                        v-if="barSegment(item, m).isStart"
                        class="text-xs font-semibold truncate"
                        :style="{ color: statusColor(item.status) }"
                      >{{ item.start_date ? formatShortDate(item.start_date) : formatShortDate(item.date) }}</span>
                    </div>
                  </div>
                </td>
              </tr>
            </template>

            <!-- No-date row -->
            <tr v-if="undatedItems.length" class="border-t border-gray-200 dark:border-gray-700">
              <td
                class="sticky left-0 z-20 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 px-4 py-3"
                style="width:220px; min-width:220px"
              >
                <span class="text-xs italic text-gray-400">No dates set</span>
              </td>
              <td :colspan="visibleMonths.length" class="px-3 py-3">
                <div class="flex flex-wrap gap-2">
                  <div
                    v-for="item in undatedItems"
                    :key="item.id"
                    @click.stop="openEdit(item)"
                    class="flex items-center gap-1.5 rounded-md px-2.5 py-1 cursor-pointer text-xs font-medium hover:opacity-80 transition-opacity"
                    :style="{ background: statusColor(item.status) + '20', border: '1px solid ' + statusColor(item.status) + '50', color: statusColor(item.status) }"
                  >
                    <span class="w-1.5 h-1.5 rounded-full flex-shrink-0" :style="{ background: statusColor(item.status) }" />
                    {{ item.title }}
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ─── LIST VIEW ──────────────────────────────────────────────── -->
    <div v-else-if="view === 'list'" class="mt-6 space-y-8">
      <div v-if="!filteredItems.length" class="text-sm text-gray-400">No roadmap items yet.</div>

      <div v-for="group in listGroups" :key="group.label">
        <h2 class="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          <span v-if="group.color" class="w-2.5 h-2.5 rounded-full flex-shrink-0" :style="{ background: group.color }" />
          {{ group.label || 'Uncategorised' }}
        </h2>
        <div class="space-y-3">
          <div
            v-for="item in group.items"
            :key="item.id"
            @click="openEdit(item)"
            class="rounded-xl bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 px-5 py-4 cursor-pointer hover:ring-indigo-300 dark:hover:ring-indigo-600 transition-all flex items-start gap-4"
          >
            <div class="flex-shrink-0 mt-1">
              <span class="w-3 h-3 rounded-full block" :style="{ background: statusColor(item.status) }" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-2">
                <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ item.title }}</p>
                <span class="flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium" :style="{ background: statusColor(item.status) + '22', color: statusColor(item.status) }">{{ statusLabel(item.status) }}</span>
              </div>
              <p v-if="item.description" class="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{{ item.description }}</p>
              <div class="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-400">
                <span v-if="item.date">{{ formatDate(item.date) }}</span>
                <span v-if="item.assigned_admin">{{ item.assigned_admin.name }}</span>
                <span v-if="item.tasks?.length">{{ item.tasks.length }} task{{ item.tasks.length !== 1 ? 's' : '' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ─── KANBAN VIEW ────────────────────────────────────────────── -->
    <div v-else class="mt-6 flex gap-4 overflow-x-auto pb-4">
      <div v-for="col in kanbanColumns" :key="col.status" class="flex-shrink-0 w-80">
        <div class="flex items-center gap-2 mb-3 px-1">
          <span class="w-2.5 h-2.5 rounded-full" :style="{ background: statusColor(col.status) }" />
          <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">{{ statusLabel(col.status) }}</span>
          <span class="text-xs text-gray-400 ml-auto">{{ col.items.length }}</span>
        </div>
        <div class="space-y-2 min-h-[80px]">
          <div
            v-for="item in col.items"
            :key="item.id"
            @click="openEdit(item)"
            class="rounded-xl bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 p-4 cursor-pointer hover:ring-indigo-300 dark:hover:ring-indigo-600 transition-all"
          >
            <p class="text-sm font-medium text-gray-900 dark:text-white">{{ item.title }}</p>
            <p v-if="item.description" class="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{{ item.description }}</p>
            <div class="mt-2 flex flex-wrap gap-2 text-xs text-gray-400">
              <span v-if="item.category?.name" class="bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-0.5 flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full" :style="{ background: item.category.color }" />
                {{ item.category.name }}
              </span>
              <span v-if="item.date">{{ formatDate(item.date) }}</span>
              <span v-if="item.tasks?.length">{{ item.tasks.length }} tasks</span>
            </div>
          </div>
          <button
            @click="openNewWithStatus(col.status)"
            class="w-full rounded-xl border border-dashed border-gray-200 dark:border-gray-700 py-2 text-xs text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-colors"
          >+ Add item</button>
        </div>
      </div>
    </div>

    <RoadmapItemDrawer
      v-model="drawerOpen"
      :item="editingItem"
      :admins="admins"
      :categories="categories"
      @saved="onSaved"
      @deleted="onDeleted"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useAxios } from '@/composables/request'
import RoadmapItemDrawer from '@/components/tasks/RoadmapItemDrawer.vue'

const today = new Date()

const view = ref('timeline')
const loading = ref(true)
const items = ref([])
const admins = ref([])
const categories = ref([])
const filterCategory = ref(null)
const drawerOpen = ref(false)
const editingItem = ref(null)
const ganttScroll = ref(null)
let currentMonthEl = null

const STATUS_META = {
  planned:       { label: 'Planned',     color: '#6366f1' },
  'in-progress': { label: 'In Progress', color: '#3b82f6' },
  shipped:       { label: 'Shipped',     color: '#10b981' },
  cancelled:     { label: 'Cancelled',   color: '#ef4444' },
}

const statusColor = s => STATUS_META[s]?.color  ?? '#9ca3af'
const statusLabel = s => STATUS_META[s]?.label  ?? s

function formatDate(d) {
  if (!d) return ''
  return new Date(d.slice(0, 10) + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ── Month builder ─────────────────────────────────────────────────────────────

function buildMonthEntry(date) {
  const isCurrent = date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth()
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  return {
    key:            `${date.getFullYear()}-${date.getMonth()}`,
    year:           date.getFullYear(),
    month:          date.getMonth(),
    label:          date.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' }),
    isCurrentMonth: isCurrent,
    daysInMonth,
    todayPercent:   isCurrent ? Math.round((today.getDate() / daysInMonth) * 100) : null,
    // First/last day of month as Date objects for overlap checks
    first: new Date(date.getFullYear(), date.getMonth(), 1),
    last:  new Date(date.getFullYear(), date.getMonth() + 1, 0),
  }
}

const visibleMonths = computed(() => {
  const allDates = items.value.flatMap(i => [
    i.start_date ? new Date(i.start_date.slice(0, 10) + 'T00:00:00') : null,
    i.date       ? new Date(i.date.slice(0, 10)       + 'T00:00:00') : null,
  ]).filter(Boolean)

  let start = new Date(today.getFullYear(), today.getMonth() - 2, 1)
  let end   = new Date(today.getFullYear(), today.getMonth() + 9, 1)

  if (allDates.length) {
    const earliest = new Date(Math.min(...allDates))
    const latest   = new Date(Math.max(...allDates))
    start = new Date(Math.min(start, new Date(earliest.getFullYear(), earliest.getMonth() - 1, 1)))
    end   = new Date(Math.max(end,   new Date(latest.getFullYear(),   latest.getMonth()   + 2, 1)))
  }

  const result = []
  let curr = new Date(start)
  while (curr < end) {
    result.push(buildMonthEntry(curr))
    curr = new Date(curr.getFullYear(), curr.getMonth() + 1, 1)
  }
  return result
})

// ── Gantt bar helpers ─────────────────────────────────────────────────────────

// Returns overlap segment for an item in a given month, or null if no overlap.
// segment: { isStart, isEnd, leftPct, rightPct }
function barSegment(item, month) {
  const endDate   = item.date       ? new Date(item.date.slice(0, 10)       + 'T00:00:00') : null
  const startDate = item.start_date ? new Date(item.start_date.slice(0, 10) + 'T00:00:00') : endDate

  if (!startDate || !endDate) return null

  // No overlap
  if (endDate < month.first || startDate > month.last) return null

  const isStart = startDate >= month.first && startDate <= month.last
  const isEnd   = endDate   >= month.first && endDate   <= month.last

  // Left edge percentage within this month's cell
  const leftPct = isStart
    ? ((startDate.getDate() - 1) / month.daysInMonth) * 100
    : 0

  // Right edge percentage
  const rightPct = isEnd
    ? (endDate.getDate() / month.daysInMonth) * 100
    : 100

  return { isStart, isEnd, leftPct, rightPct }
}

// Converts segment to absolute-position inline style for the bar div
function barSegmentStyle(item, month) {
  const seg = barSegment(item, month)
  if (!seg) return {}
  return {
    left:  seg.leftPct  + '%',
    width: (seg.rightPct - seg.leftPct) + '%',
  }
}

function formatShortDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr.slice(0, 10) + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

// ── Grouping ──────────────────────────────────────────────────────────────────

const ganttGroups = computed(() => {
  const grouped = {}
  const sorted = [...items.value]
    .filter(i => i.start_date || i.date)
    .sort((a, b) => {
      const aDate = (a.start_date || a.date || '').slice(0, 10)
      const bDate = (b.start_date || b.date || '').slice(0, 10)
      return aDate.localeCompare(bDate)
    })
  sorted.forEach(item => {
    const key = item.category_id ?? 'none'
    if (!grouped[key]) grouped[key] = { label: item.category?.name ?? '', color: item.category?.color ?? null, items: [] }
    grouped[key].items.push(item)
  })
  return Object.values(grouped)
})

const undatedItems = computed(() => items.value.filter(i => !i.start_date && !i.date))

function scrollToToday() {
  nextTick(() => {
    if (ganttScroll.value && currentMonthEl) {
      const containerLeft = ganttScroll.value.getBoundingClientRect().left
      const elLeft = currentMonthEl.getBoundingClientRect().left
      ganttScroll.value.scrollLeft += elLeft - containerLeft - 240
    }
  })
}

// ── List / Kanban helpers ─────────────────────────────────────────────────────

const filteredItems = computed(() =>
  filterCategory.value != null ? items.value.filter(i => i.category_id === filterCategory.value) : items.value
)

const listGroups = computed(() => {
  const grouped = {}
  filteredItems.value.forEach(item => {
    const key = item.category_id ?? 'none'
    if (!grouped[key]) grouped[key] = { label: item.category?.name ?? '', color: item.category?.color ?? null, items: [] }
    grouped[key].items.push(item)
  })
  return Object.values(grouped)
})

const STATUSES = ['planned', 'in-progress', 'shipped', 'cancelled']
const kanbanColumns = computed(() =>
  STATUSES.map(status => ({
    status,
    items: filteredItems.value.filter(i => i.status === status),
  }))
)

// ── Actions ───────────────────────────────────────────────────────────────────

function openNew() {
  editingItem.value = null
  drawerOpen.value = true
}

function openNewWithStatus(status) {
  editingItem.value = { status }
  drawerOpen.value = true
}

function openEdit(item) {
  editingItem.value = item
  drawerOpen.value = true
}

function onSaved(item) {
  const idx = items.value.findIndex(i => i.id === item.id)
  if (idx >= 0) items.value[idx] = item
  else items.value.push(item)
}

function onDeleted(id) {
  items.value = items.value.filter(i => i.id !== id)
}

async function load() {
  loading.value = true
  const [itemsRes, adminsRes, catsRes] = await Promise.all([
    useAxios.get('/api/admin/roadmap'),
    useAxios.get('/api/admin/users'),
    useAxios.get('/api/admin/roadmap-categories'),
  ])
  items.value = itemsRes?.data ?? []
  admins.value = adminsRes?.data?.data ?? adminsRes?.data ?? []
  categories.value = catsRes?.data ?? []
  loading.value = false
  scrollToToday()
}

onMounted(load)
</script>
