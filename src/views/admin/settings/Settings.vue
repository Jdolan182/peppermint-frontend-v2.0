<template>
  <div>
    <div>
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Settings</h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your application settings</p>
    </div>

    <div class="mt-8 space-y-6">

      <!-- General -->
      <div class="rounded-xl bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700">
        <div class="px-6 py-5 border-b border-gray-100 dark:border-gray-700">
          <h2 class="text-sm font-semibold text-gray-900 dark:text-white">General</h2>
          <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">Basic site settings</p>
        </div>
        <div class="px-6 py-5 space-y-5">
          <div>
            <Label label="Site name" />
            <Input v-model="form.site_name" placeholder="Peppermint" />
          </div>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-900 dark:text-white">Maintenance mode</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Shows a "we'll be back" page to all public visitors</p>
            </div>
            <button
              type="button"
              role="switch"
              :aria-checked="form.maintenance_enabled"
              class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none"
              :class="form.maintenance_enabled ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-600'"
              @click="form.maintenance_enabled = !form.maintenance_enabled"
            >
              <span
                class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200"
                :class="form.maintenance_enabled ? 'translate-x-5' : 'translate-x-0'"
              />
            </button>
          </div>
          <div v-if="form.maintenance_enabled">
            <Label label="Maintenance message" />
            <Input v-model="form.maintenance_message" placeholder="We'll be back soon." />
          </div>
        </div>
      </div>

      <!-- Modules -->
      <div v-if="licensedModules.length" class="rounded-xl bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700">
        <div class="px-6 py-5 border-b border-gray-100 dark:border-gray-700">
          <h2 class="text-sm font-semibold text-gray-900 dark:text-white">Modules</h2>
          <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">Turn licensed modules on or off</p>
        </div>
        <div class="divide-y divide-gray-100 dark:divide-gray-700">
          <div v-for="mod in licensedModules" :key="mod.key" class="flex items-center justify-between px-6 py-4">
            <div>
              <p class="text-sm font-medium text-gray-900 dark:text-white">{{ mod.label }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ mod.description }}</p>
            </div>
            <!-- Toggle switch -->
            <button
              type="button"
              role="switch"
              :aria-checked="form[mod.key]"
              class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none"
              :class="form[mod.key] ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-600'"
              @click="form[mod.key] = !form[mod.key]"
            >
              <span
                class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200"
                :class="form[mod.key] ? 'translate-x-5' : 'translate-x-0'"
              />
            </button>
          </div>
        </div>
      </div>

      <!-- Blog settings -->
      <div v-if="form.module_blogs !== false" class="rounded-xl bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700">
        <div class="px-6 py-5 border-b border-gray-100 dark:border-gray-700">
          <h2 class="text-sm font-semibold text-gray-900 dark:text-white">Blog</h2>
          <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">Displayed on the public blog page header</p>
        </div>
        <div class="px-6 py-5 space-y-4">
          <div>
            <Label label="Title" />
            <Input v-model="form.blog_title" placeholder="Our Blog" />
          </div>
          <div>
            <Label label="Description" />
            <Input v-model="form.blog_description" placeholder="Ideas, updates, and the occasional deep dive." />
          </div>
        </div>
      </div>

      <!-- Save -->
      <div class="flex items-center justify-end gap-3">
        <span v-if="saved" class="text-sm text-green-600 dark:text-green-400">Saved</span>
        <button
          class="rounded-lg bg-gray-900 dark:bg-white px-5 py-2 text-sm font-semibold text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-100 transition-colors disabled:opacity-50"
          :disabled="saving"
          @click="handleSave"
        >
          {{ saving ? 'Saving...' : 'Save changes' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAxios } from '@/composables/request'
import { useModulesStore } from '@/store/admin/modules'
import { usePublicModules } from '@/composables/publicModules'
import Input from '@/components/inputs/Input.vue'
import Label from '@/components/labels/Label.vue'

const modulesStore = useModulesStore()
const { invalidatePublicModulesCache } = usePublicModules()

// All possible toggleable modules — only shown if licensed (env var set)
const allModules = [
  { key: 'module_blogs',        envKey: 'VITE_MODULE_BLOGS',        label: 'Blogs',        description: 'Blog posts, categories, and the public blog pages.' },
  { key: 'module_consumers',    envKey: 'VITE_MODULE_CONSUMERS',    label: 'Consumers',    description: 'Consumer accounts and data.' },
  { key: 'module_public_login', envKey: 'VITE_MODULE_PUBLIC_LOGIN', label: 'Public login', description: 'Lets visitors sign in or sign up on the public site.' },
  { key: 'module_team',         envKey: 'VITE_MODULE_TEAM',         label: 'Team',         description: 'Admin user management and team roles.' },
  { key: 'module_public',       envKey: 'VITE_MODULE_PUBLIC',       label: 'Public',       description: 'The consumer-facing public site.' },
]

const licensedModules = computed(() =>
  allModules.filter(m => import.meta.env[m.envKey] === 'true')
)

const form = ref({
  site_name: '',
  maintenance_enabled: false,
  maintenance_message: '',
  blog_title: '',
  blog_description: '',
  module_blogs: true,
  module_consumers: true,
  module_public_login: true,
  module_team: true,
  module_public: true,
})

const saving = ref(false)
const saved = ref(false)

onMounted(async () => {
  const res = await useAxios.get('/api/admin/settings')
  if (res?.data) {
    const s = res.data
    form.value.site_name            = s.site_name            ?? ''
    form.value.maintenance_enabled  = s.maintenance_enabled  === 'true'
    form.value.maintenance_message  = s.maintenance_message  ?? ''
    form.value.blog_title           = s.blog_title           ?? ''
    form.value.blog_description     = s.blog_description     ?? ''
    // DB stores 'true'/'false' strings; absent means default on
    form.value.module_blogs         = s.module_blogs         !== 'false'
    form.value.module_consumers     = s.module_consumers     !== 'false'
    form.value.module_public_login  = s.module_public_login  !== 'false'
    form.value.module_team          = s.module_team          !== 'false'
    form.value.module_public        = s.module_public        !== 'false'
  }
})

async function handleSave() {
  saving.value = true
  saved.value = false
  const res = await useAxios.put('/api/admin/settings', form.value)
  if (res?.status === 200) {
    saved.value = true
    await modulesStore.fetch()
    invalidatePublicModulesCache()
    setTimeout(() => (saved.value = false), 3000)
  }
  saving.value = false
}
</script>
