<template>
  <div class="space-y-8">
    <!-- My Work section (tasks module) -->
    <div v-if="modulesStore.isEnabled('tasks')">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-base font-semibold text-gray-900 dark:text-white">My work</h2>
        <router-link :to="{ name: 'Tasks' }" class="text-xs text-indigo-500 hover:text-indigo-600 font-medium">View all →</router-link>
      </div>

      <div v-if="myTasksLoading" class="text-sm text-gray-400">Loading…</div>

      <div v-else-if="!myTasks.length" class="rounded-xl bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 px-6 py-8 text-center">
        <p class="text-sm text-gray-400">No tasks assigned to you.</p>
      </div>

      <div v-else class="rounded-xl bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
        <div
          v-for="task in myTasks"
          :key="task.id"
          class="flex items-center justify-between px-5 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          @click="selectedTask = task"
        >
          <div class="flex items-center gap-3 min-w-0">
            <span class="w-2 h-2 rounded-full flex-shrink-0" :style="{ background: task.status?.color ?? '#9ca3af' }" />
            <span class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ task.title }}</span>
            <span v-if="task.type" class="text-xs rounded-full px-2 py-0.5 flex-shrink-0" :style="{ background: task.type.color + '22', color: task.type.color }">{{ task.type.name }}</span>
          </div>
          <div class="flex items-center gap-3 flex-shrink-0 ml-3">
            <span
              class="text-xs font-medium rounded px-1.5 py-0.5"
              :class="priorityClass(task.priority)"
            >{{ task.priority }}</span>
            <span v-if="task.due_date" class="text-xs text-gray-400">{{ formatDate(task.due_date) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats placeholder -->
    <div>
      <h2 class="text-base font-semibold text-gray-900 dark:text-white mb-4">Overview</h2>
      <dl class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div
          v-for="item in stats"
          :key="item.name"
          class="overflow-hidden rounded-xl bg-white dark:bg-gray-800 px-5 py-5 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700"
        >
          <dt class="truncate text-sm font-medium text-gray-500 dark:text-gray-400">{{ item.name }}</dt>
          <dd class="mt-1 text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">{{ item.stat }}</dd>
        </div>
      </dl>
    </div>
  </div>

  <!-- Task detail panel -->
  <Teleport to="body">
    <div v-if="selectedTask" class="fixed inset-0 z-50 flex justify-end">
      <div class="absolute inset-0 bg-black/30" @click="selectedTask = null" />
      <div class="relative z-10 flex h-full w-full max-w-md flex-col bg-white dark:bg-gray-900 shadow-2xl overflow-y-auto">
        <!-- Header -->
        <div class="flex items-start justify-between border-b border-gray-100 dark:border-gray-700 px-6 py-4 gap-3">
          <div class="min-w-0">
            <h2 class="text-base font-semibold text-gray-900 dark:text-white leading-snug">{{ selectedTask.title }}</h2>
            <div class="mt-1.5 flex flex-wrap items-center gap-2">
              <span
                v-if="selectedTask.status"
                class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
                :style="{ background: (selectedTask.status.color ?? '#9ca3af') + '22', color: selectedTask.status.color ?? '#9ca3af' }"
              >
                <span class="w-1.5 h-1.5 rounded-full" :style="{ background: selectedTask.status.color ?? '#9ca3af' }" />
                {{ selectedTask.status.name }}
              </span>
              <span
                v-if="selectedTask.type"
                class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium"
                :style="{ background: selectedTask.type.color + '22', color: selectedTask.type.color }"
              >{{ selectedTask.type.name }}</span>
              <span
                class="inline-flex rounded px-1.5 py-0.5 text-xs font-medium"
                :class="priorityClass(selectedTask.priority)"
              >{{ selectedTask.priority }}</span>
            </div>
          </div>
          <button @click="selectedTask = null" class="flex-shrink-0 mt-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <XMarkIcon class="w-5 h-5" />
          </button>
        </div>

        <!-- Body -->
        <div class="flex-1 px-6 py-5 space-y-5">
          <!-- Meta grid -->
          <dl class="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
            <div v-if="selectedTask.due_date">
              <dt class="text-xs font-medium text-gray-400 mb-0.5">Due date</dt>
              <dd class="text-gray-900 dark:text-white font-medium">{{ formatDate(selectedTask.due_date) }}</dd>
            </div>
            <div v-if="selectedTask.assigned_admin">
              <dt class="text-xs font-medium text-gray-400 mb-0.5">Assigned to</dt>
              <dd class="text-gray-900 dark:text-white font-medium">{{ selectedTask.assigned_admin.name }}</dd>
            </div>
            <div v-if="selectedTask.consumer">
              <dt class="text-xs font-medium text-gray-400 mb-0.5">Consumer</dt>
              <dd class="text-gray-900 dark:text-white font-medium">{{ selectedTask.consumer.name }}</dd>
            </div>
            <div v-if="selectedTask.roadmap_item">
              <dt class="text-xs font-medium text-gray-400 mb-0.5">Roadmap item</dt>
              <dd class="text-gray-900 dark:text-white font-medium">{{ selectedTask.roadmap_item.title }}</dd>
            </div>
          </dl>

          <!-- Description -->
          <div v-if="selectedTask.description">
            <p class="text-xs font-medium text-gray-400 mb-1">Description</p>
            <p class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{{ selectedTask.description }}</p>
          </div>

          <!-- Notes -->
          <div v-if="selectedTask.notes">
            <p class="text-xs font-medium text-gray-400 mb-1">Notes</p>
            <p class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{{ selectedTask.notes }}</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="border-t border-gray-100 dark:border-gray-700 px-6 py-4">
          <router-link
            :to="{ name: 'Tasks' }"
            class="block w-full text-center rounded-lg bg-gray-900 dark:bg-white px-4 py-2 text-sm font-semibold text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-100 transition-colors"
            @click="selectedTask = null"
          >Open in Tasks</router-link>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { useAxios } from '@/composables/request'
import { useModulesStore } from '@/store/admin/modules'

const modulesStore = useModulesStore()

const myTasks = ref([])
const myTasksLoading = ref(true)
const stats = ref([])
const selectedTask = ref(null)

function priorityClass(p) {
  return {
    critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    high:     'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    medium:   'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    low:      'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
  }[p] ?? ''
}

function formatDate(d) {
  if (!d) return ''
  return new Date(d.slice(0, 10) + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

onMounted(async () => {
  if (modulesStore.isEnabled('tasks')) {
    const res = await useAxios.get('/api/admin/tasks?mine=1')
    myTasks.value = (res?.data ?? []).filter(t => !t.status?.is_closed)
    myTasksLoading.value = false
  } else {
    myTasksLoading.value = false
  }
})
</script>
