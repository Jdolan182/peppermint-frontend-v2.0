<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <div class="mx-auto max-w-2xl px-4 py-12 sm:px-6">

      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">My Tasks</h1>
        <p v-if="!loading && tasks.length" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ openTasks.length }} open · {{ closedTasks.length }} completed
        </p>
      </div>

      <div v-if="loading" class="space-y-3">
        <div v-for="i in 4" :key="i" class="h-20 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
      </div>

      <div v-else-if="!tasks.length" class="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 px-6 py-16 text-center">
        <div class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
          <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
        </div>
        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">No tasks assigned to you yet.</p>
      </div>

      <div v-else class="space-y-8">
        <!-- Open tasks -->
        <div v-if="openTasks.length">
          <h2 class="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">Open</h2>
          <div class="space-y-2">
            <div
              v-for="task in openTasks"
              :key="task.id"
              class="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 overflow-hidden transition-shadow hover:shadow-sm"
            >
              <!-- Main row -->
              <button
                class="w-full text-left px-5 py-4"
                @click="toggle(task.id)"
              >
                <div class="flex items-start gap-3">
                  <!-- Status dot -->
                  <span
                    class="mt-0.5 w-2.5 h-2.5 rounded-full flex-shrink-0"
                    :style="{ background: task.status?.color ?? '#9ca3af' }"
                  />
                  <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between gap-3">
                      <p class="text-sm font-semibold text-gray-900 dark:text-white leading-snug">{{ task.title }}</p>
                      <div class="flex items-center gap-2 flex-shrink-0">
                        <span
                          v-if="task.priority"
                          class="text-xs font-semibold rounded px-1.5 py-0.5 capitalize"
                          :class="priorityClass(task.priority)"
                        >{{ task.priority }}</span>
                        <span
                          v-if="task.status"
                          class="text-xs font-medium rounded-full px-2 py-0.5"
                          :style="{ background: task.status.color + '20', color: task.status.color }"
                        >{{ task.status.name }}</span>
                      </div>
                    </div>
                    <div class="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-gray-400">
                      <span v-if="task.type" :style="{ color: task.type.color }" class="font-medium">{{ task.type.name }}</span>
                      <span
                        v-if="task.due_date"
                        :class="isOverdue(task) ? 'text-red-500 font-semibold' : ''"
                      >{{ isOverdue(task) ? 'Overdue · ' : 'Due ' }}{{ formatDate(task.due_date) }}</span>
                    </div>
                  </div>
                  <svg
                    class="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5 transition-transform"
                    :class="expanded.has(task.id) ? 'rotate-180' : ''"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  ><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </button>

              <!-- Expanded detail -->
              <div v-if="expanded.has(task.id)" class="border-t border-gray-100 dark:border-gray-800 px-5 py-4 space-y-3 bg-gray-50/50 dark:bg-gray-900/50">
                <p v-if="task.description" class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{{ task.description }}</p>

                <dl class="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
                  <div v-if="task.assigned_admin">
                    <dt class="text-gray-400 mb-0.5">Assigned by</dt>
                    <dd class="text-gray-700 dark:text-gray-300 font-medium">{{ task.assigned_admin.name }}</dd>
                  </div>
                  <div v-if="task.roadmap_item">
                    <dt class="text-gray-400 mb-0.5">Linked to</dt>
                    <dd class="text-gray-700 dark:text-gray-300 font-medium">{{ task.roadmap_item.title }}</dd>
                  </div>
                </dl>

                <p v-if="task.notes" class="text-xs text-gray-400 italic border-t border-gray-100 dark:border-gray-800 pt-3">{{ task.notes }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Closed tasks -->
        <div v-if="closedTasks.length">
          <button
            @click="showClosed = !showClosed"
            class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg class="w-3.5 h-3.5 transition-transform" :class="showClosed ? 'rotate-90' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
            Completed ({{ closedTasks.length }})
          </button>
          <div v-if="showClosed" class="space-y-2">
            <div
              v-for="task in closedTasks"
              :key="task.id"
              class="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 px-5 py-4 opacity-60"
            >
              <div class="flex items-center gap-3">
                <span class="w-2.5 h-2.5 rounded-full flex-shrink-0" :style="{ background: task.status?.color ?? '#9ca3af' }" />
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400 line-through flex-1 truncate">{{ task.title }}</p>
                <span class="text-xs text-gray-400">{{ task.status?.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAxios } from '@/composables/request'

const tasks   = ref([])
const loading = ref(true)
const expanded = ref(new Set())
const showClosed = ref(false)

function toggle(id) {
  const s = new Set(expanded.value)
  if (s.has(id)) s.delete(id)
  else s.add(id)
  expanded.value = s
}

const openTasks   = computed(() => tasks.value.filter(t => !t.status?.is_closed))
const closedTasks = computed(() => tasks.value.filter(t => t.status?.is_closed))

function formatDate(d) {
  if (!d) return ''
  return new Date(d.slice(0, 10) + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function isOverdue(task) {
  if (!task.due_date) return false
  return new Date(task.due_date.slice(0, 10) + 'T00:00:00') < new Date(new Date().toDateString())
}

function priorityClass(p) {
  return {
    critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    high:     'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    medium:   'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    low:      'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
  }[p] ?? ''
}

onMounted(async () => {
  const res = await useAxios.get('/api/consumer/tasks')
  tasks.value = res?.data ?? []
  loading.value = false
})
</script>
