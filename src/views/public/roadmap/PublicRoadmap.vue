<template>
  <div class="min-h-screen bg-white dark:bg-gray-950">
    <div class="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">

      <!-- Header -->
      <div class="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Roadmap</h1>
          <p class="mt-2 text-lg text-gray-500 dark:text-gray-400">What we're working on and what's coming next.</p>
        </div>

        <!-- View + filter controls -->
        <div class="flex items-center gap-3 flex-wrap">
          <!-- Status filter tabs (list only) -->
          <div v-if="view === 'list'" class="flex gap-1.5 flex-wrap">
            <button
              v-for="tab in TABS"
              :key="tab.value"
              @click="activeTab = tab.value"
              class="rounded-full px-3 py-1 text-xs font-medium transition-colors"
              :class="activeTab === tab.value
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'"
            >{{ tab.label }}</button>
          </div>

          <!-- View toggle -->
          <div class="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden text-xs">
            <button
              @click="view = 'timeline'"
              class="px-3 py-1.5 font-medium transition-colors"
              :class="view === 'timeline' ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'"
            >Timeline</button>
            <button
              @click="view = 'list'"
              class="px-3 py-1.5 font-medium transition-colors"
              :class="view === 'list' ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'"
            >List</button>
          </div>
        </div>
      </div>

      <div v-if="loading" class="space-y-3">
        <div v-for="i in 5" :key="i" class="h-16 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
      </div>

      <!-- ─── TIMELINE VIEW ───────────────────────────────────────────── -->
      <div v-else-if="view === 'timeline'">
        <!-- Legend -->
        <div class="flex flex-wrap items-center gap-4 mb-3">
          <span v-for="(meta, key) in STATUS_META" :key="key" class="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <span class="w-2.5 h-2.5 rounded-sm" :style="{ background: meta.color }" />
            {{ meta.label }}
          </span>
          <span class="ml-auto flex items-center gap-1.5 text-xs text-gray-400">
            <span class="inline-block w-px h-3 bg-emerald-400" />
            Today
          </span>
        </div>

        <div v-if="!items.length" class="text-sm text-gray-400">Nothing here yet.</div>

        <div v-else ref="ganttScroll" class="overflow-x-auto rounded-2xl border border-gray-100 dark:border-gray-800">
          <table class="border-collapse" style="min-width: max-content; width: 100%">
            <thead>
              <tr class="border-b border-gray-100 dark:border-gray-800">
                <th
                  class="sticky left-0 z-30 bg-gray-50 dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400"
                  style="width:180px; min-width:180px"
                >Item</th>
                <th
                  v-for="m in visibleMonths"
                  :key="m.key"
                  :ref="el => { if (m.isCurrentMonth && el) currentMonthEl = el }"
                  class="px-2 py-3 text-center text-xs font-semibold border-r border-gray-100 dark:border-gray-800 last:border-r-0 whitespace-nowrap"
                  style="width:140px; min-width:140px"
                  :class="m.isCurrentMonth
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 dark:text-emerald-400'
                    : 'bg-gray-50 dark:bg-gray-900 text-gray-400'"
                >{{ m.label }}</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="group in ganttGroups" :key="group.label">
                <!-- Category header -->
                <tr class="border-b border-gray-100 dark:border-gray-800">
                  <td
                    class="sticky left-0 z-20 bg-gray-50 dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 px-5 py-1.5"
                    style="width:180px; min-width:180px"
                  >
                    <span class="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
                      <span v-if="group.color" class="w-2 h-2 rounded-full flex-shrink-0" :style="{ background: group.color }" />
                      {{ group.label || 'Uncategorised' }}
                    </span>
                  </td>
                  <td
                    v-for="m in visibleMonths"
                    :key="m.key"
                    class="relative border-r border-gray-100 dark:border-gray-800 last:border-r-0 bg-gray-50 dark:bg-gray-900 overflow-hidden"
                    style="width:140px; min-width:140px"
                  >
                    <div v-if="m.isCurrentMonth" class="absolute inset-y-0 w-px bg-emerald-400/40 pointer-events-none" :style="{ left: m.todayPercent + '%' }" />
                  </td>
                </tr>

                <!-- Item rows -->
                <tr
                  v-for="item in group.items"
                  :key="item.id"
                  class="border-b border-gray-100 dark:border-gray-800"
                >
                  <td
                    class="sticky left-0 z-20 bg-white dark:bg-gray-950 border-r border-gray-100 dark:border-gray-800 px-5 py-3"
                    style="width:180px; min-width:180px"
                  >
                    <div class="flex items-center gap-2.5">
                      <span class="w-2 h-2 rounded-full flex-shrink-0" :style="{ background: statusColor(item.status) }" />
                      <span class="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{{ item.title }}</span>
                    </div>
                  </td>

                  <td
                    v-for="m in visibleMonths"
                    :key="m.key"
                    class="relative border-r border-gray-100 dark:border-gray-800 last:border-r-0 p-0 overflow-hidden"
                    style="width:140px; min-width:140px; height:46px"
                    :class="m.isCurrentMonth ? 'bg-emerald-50/30 dark:bg-emerald-900/10' : ''"
                  >
                    <div v-if="m.isCurrentMonth" class="absolute inset-y-0 w-px bg-emerald-400/50 z-0 pointer-events-none" :style="{ left: m.todayPercent + '%' }" />

                    <div
                      v-if="barSegment(item, m)"
                      class="absolute top-1/2 -translate-y-1/2"
                      :style="barSegmentStyle(item, m)"
                    >
                      <div
                        class="h-7 w-full flex items-center px-1.5 overflow-hidden"
                        :class="[
                          barSegment(item, m).isStart ? 'rounded-l-md' : '',
                          barSegment(item, m).isEnd   ? 'rounded-r-md' : '',
                        ]"
                        :style="{
                          background:   statusColor(item.status) + '25',
                          borderTop:    '1px solid ' + statusColor(item.status) + '50',
                          borderBottom: '1px solid ' + statusColor(item.status) + '50',
                          borderLeft:   barSegment(item, m).isStart ? '3px solid ' + statusColor(item.status) : 'none',
                          borderRight:  barSegment(item, m).isEnd   ? '1px solid ' + statusColor(item.status) + '50' : 'none',
                        }"
                      >
                        <span
                          v-if="barSegment(item, m).isStart"
                          class="text-xs font-semibold truncate"
                          :style="{ color: statusColor(item.status) }"
                        >{{ formatShortDate(item.date) }}</span>
                      </div>
                    </div>
                  </td>
                </tr>
              </template>

              <!-- No-date items -->
              <tr v-if="undatedItems.length" class="border-t border-gray-100 dark:border-gray-800">
                <td
                  class="sticky left-0 z-20 bg-gray-50 dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 px-5 py-3"
                  style="width:180px; min-width:180px"
                >
                  <span class="text-xs italic text-gray-400">No dates set</span>
                </td>
                <td :colspan="visibleMonths.length" class="px-4 py-3">
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="item in undatedItems"
                      :key="item.id"
                      class="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium"
                      :style="{ background: statusColor(item.status) + '20', border: '1px solid ' + statusColor(item.status) + '40', color: statusColor(item.status) }"
                    >{{ item.title }}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ─── LIST VIEW ──────────────────────────────────────────────── -->
      <div v-else>
        <div v-if="!filteredItems.length && !archivedItems.length" class="text-sm text-gray-400">Nothing here yet.</div>

        <div class="space-y-10">
          <div v-for="group in listGroups" :key="group.label">
            <h2 v-if="group.label" class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
              <span v-if="group.color" class="w-2.5 h-2.5 rounded-full flex-shrink-0" :style="{ background: group.color }" />
              {{ group.label }}
            </h2>
            <div class="space-y-4">
              <div
                v-for="item in group.items"
                :key="item.id"
                class="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6"
              >
                <div class="flex items-start justify-between gap-4">
                  <h3 class="text-base font-semibold text-gray-900 dark:text-white">{{ item.title }}</h3>
                  <span
                    class="flex-shrink-0 rounded-full px-3 py-0.5 text-xs font-semibold"
                    :style="{ background: statusColor(item.status) + '22', color: statusColor(item.status) }"
                  >{{ statusLabel(item.status) }}</span>
                </div>
                <p v-if="item.description" class="mt-2 text-sm text-gray-500 dark:text-gray-400">{{ item.description }}</p>
                <p v-if="item.date" class="mt-3 text-xs text-gray-400">Target: {{ formatDate(item.date) }}</p>
              </div>
            </div>
          </div>

          <!-- Archived: shipped items older than 1 year -->
          <div v-if="archivedItems.length">
            <button
              @click="archiveOpen = !archiveOpen"
              class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors mb-4"
            >
              <svg class="w-3 h-3 transition-transform" :class="archiveOpen ? 'rotate-90' : ''" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
              Archived ({{ archivedItems.length }})
            </button>
            <div v-if="archiveOpen" class="space-y-4 opacity-60">
              <div
                v-for="item in archivedItems"
                :key="item.id"
                class="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6"
              >
                <div class="flex items-start justify-between gap-4">
                  <h3 class="text-base font-semibold text-gray-500 dark:text-gray-400 line-through">{{ item.title }}</h3>
                  <span
                    class="flex-shrink-0 rounded-full px-3 py-0.5 text-xs font-semibold"
                    :style="{ background: statusColor(item.status) + '22', color: statusColor(item.status) }"
                  >{{ statusLabel(item.status) }}</span>
                </div>
                <p v-if="item.description" class="mt-2 text-sm text-gray-500 dark:text-gray-400">{{ item.description }}</p>
                <p v-if="item.date" class="mt-3 text-xs text-gray-400">Shipped: {{ formatDate(item.date) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useAxios } from '@/composables/request'

const TABS = [
  { label: 'All',         value: '' },
  { label: 'Planned',     value: 'planned' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Shipped',     value: 'shipped' },
]

const STATUS_META = {
  planned:       { label: 'Planned',     color: '#6366f1' },
  'in-progress': { label: 'In Progress', color: '#3b82f6' },
  shipped:       { label: 'Shipped',     color: '#10b981' },
}

const statusColor = s => STATUS_META[s]?.color ?? '#9ca3af'
const statusLabel = s => STATUS_META[s]?.label ?? s

function formatDate(d) {
  if (!d) return null
  return new Date(d.slice(0, 10) + 'T00:00:00').toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
}

function formatShortDate(d) {
  if (!d) return ''
  return new Date(d.slice(0, 10) + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

// ── State ─────────────────────────────────────────────────────────────────────
const today    = new Date()
const loading  = ref(true)
const items    = ref([])
// The month-grid timeline needs horizontal room — phones get the card list
// by default (the toggle still offers the timeline if wanted)
const view     = ref(window.matchMedia('(max-width: 767px)').matches ? 'list' : 'timeline')
const activeTab = ref('')
const ganttScroll  = ref(null)
let   currentMonthEl = null

// ── Timeline helpers ──────────────────────────────────────────────────────────

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
    first:          new Date(date.getFullYear(), date.getMonth(), 1),
    last:           new Date(date.getFullYear(), date.getMonth() + 1, 0),
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

function barSegment(item, month) {
  const endDate   = item.date       ? new Date(item.date.slice(0, 10)       + 'T00:00:00') : null
  const startDate = item.start_date ? new Date(item.start_date.slice(0, 10) + 'T00:00:00') : endDate

  if (!startDate || !endDate) return null
  if (endDate < month.first || startDate > month.last) return null

  const isStart = startDate >= month.first && startDate <= month.last
  const isEnd   = endDate   >= month.first && endDate   <= month.last

  const leftPct  = isStart ? ((startDate.getDate() - 1) / month.daysInMonth) * 100 : 0
  const rightPct = isEnd   ? (endDate.getDate() / month.daysInMonth) * 100 : 100

  return { isStart, isEnd, leftPct, rightPct }
}

function barSegmentStyle(item, month) {
  const seg = barSegment(item, month)
  if (!seg) return {}
  return { left: seg.leftPct + '%', width: (seg.rightPct - seg.leftPct) + '%' }
}

const ganttGroups = computed(() => {
  const grouped = {}
  const sorted = [...items.value]
    .filter(i => i.start_date || i.date)
    .sort((a, b) => ((a.start_date || a.date || '')).localeCompare((b.start_date || b.date || '')))
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

// ── List helpers ──────────────────────────────────────────────────────────────
const ONE_YEAR_AGO = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate())
const archiveOpen  = ref(false)

const archivedItems = computed(() =>
  items.value.filter(i =>
    i.status === 'shipped' && i.date && new Date(i.date.slice(0, 10) + 'T00:00:00') < ONE_YEAR_AGO
  )
)

const archivedIds = computed(() => new Set(archivedItems.value.map(i => i.id)))

const activeItems = computed(() => items.value.filter(i => !archivedIds.value.has(i.id)))

const filteredItems = computed(() =>
  activeTab.value ? activeItems.value.filter(i => i.status === activeTab.value) : activeItems.value
)

const listGroups = computed(() => {
  const map = {}
  filteredItems.value.forEach(item => {
    const key = item.category_id ?? 'none'
    if (!map[key]) map[key] = { label: item.category?.name ?? '', color: item.category?.color ?? null, items: [] }
    map[key].items.push(item)
  })
  return Object.values(map)
})

// ── Data ──────────────────────────────────────────────────────────────────────
onMounted(async () => {
  const res = await useAxios.get('/api/public/roadmap')
  items.value = res?.data ?? []
  loading.value = false
  scrollToToday()
})
</script>
