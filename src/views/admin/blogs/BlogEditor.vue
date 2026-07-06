<template>
  <div class="max-w-4xl">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center gap-3">
        <router-link :to="{ name: 'Blogs' }" class="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
          ← Blogs
        </router-link>
        <span class="text-gray-300 dark:text-gray-600">/</span>
        <h1 class="text-lg font-semibold text-gray-900 dark:text-white">{{ isEdit ? 'Edit post' : 'New post' }}</h1>
      </div>
      <div class="flex items-center gap-3">
        <button
          type="button"
          class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          :disabled="saving"
          @click="save(false)"
        >
          Save draft
        </button>
        <button
          type="button"
          class="px-4 py-2 text-sm font-medium text-white bg-gray-900 dark:bg-white dark:text-gray-900 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-100 transition-colors disabled:opacity-50"
          :disabled="saving"
          @click="save(true)"
        >
          {{ saving ? 'Saving...' : (form.published_at ? 'Update' : 'Publish') }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-6">
      <!-- Main content -->
      <div class="col-span-2 space-y-5">
        <div>
          <Label label="Title" />
          <input
            v-model="form.title"
            type="text"
            placeholder="Post title"
            class="mt-1 block w-full rounded-md bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-2 focus:outline-indigo-600 dark:focus:outline-indigo-500 sm:text-sm"
          />
          <p v-if="errors.title" class="mt-1 text-sm text-red-600">{{ errors.title }}</p>
        </div>

        <div>
          <Label label="Content" />
          <div class="mt-1">
            <WysiwygEditor v-model="form.content" />
          </div>
          <p v-if="errors.content" class="mt-1 text-sm text-red-600">{{ errors.content }}</p>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-5">
        <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 space-y-4">
          <div>
            <Label label="Excerpt" />
            <textarea
              v-model="form.excerpt"
              rows="3"
              placeholder="Short summary (optional)"
              class="mt-1 block w-full rounded-md bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-2 focus:outline-indigo-600 dark:focus:outline-indigo-500 sm:text-sm resize-none"
            />
          </div>

          <div>
            <Label label="Categories" />
            <div class="mt-1 space-y-1.5 max-h-40 overflow-y-auto">
              <label
                v-for="cat in categories"
                :key="cat.id"
                class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
              >
                <input
                  type="checkbox"
                  :value="cat.id"
                  v-model="form.category_ids"
                  class="rounded border-gray-300 dark:border-gray-600 text-indigo-600"
                />
                {{ cat.name }}
              </label>
              <p v-if="categories.length === 0" class="text-sm text-gray-400 dark:text-gray-500">No categories yet.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAxios } from '@/composables/request'
import WysiwygEditor from '@/components/editor/WysiwygEditor.vue'
import Label from '@/components/labels/Label.vue'
import { useToast } from '@/composables/useToast'

const toast = useToast()

const route = useRoute()
const router = useRouter()

const isEdit = computed(() => !!route.params.id)

const form = ref({
  title: '',
  content: '',
  excerpt: '',
  category_ids: [],
  published_at: null,
})

const errors = ref({})
const saving = ref(false)
const categories = ref([])

async function fetchCategories() {
  const res = await useAxios.get('/api/admin/categories', { params: { per_page: 50 } })
  if (res?.data) categories.value = res.data.data
}

async function fetchBlog() {
  const res = await useAxios.get(`/api/admin/blogs/${route.params.id}`)
  if (res?.data) {
    const b = res.data.data
    form.value = {
      title: b.title,
      content: b.content,
      excerpt: b.excerpt ?? '',
      category_ids: b.categories.map(c => c.id),
      published_at: b.published_at,
    }
  }
}

async function save(publish) {
  saving.value = true
  errors.value = {}

  const payload = {
    ...form.value,
    published_at: publish ? (form.value.published_at ?? new Date().toISOString()) : null,
  }

  let res
  if (isEdit.value) {
    res = await useAxios.patch(`/api/admin/blogs/${route.params.id}`, payload)
  } else {
    res = await useAxios.post('/api/admin/blogs', payload)
  }

  if (res?.status === 200 || res?.status === 201) {
    toast.success(isEdit.value ? 'Post updated' : 'Post published')
    router.push({ name: 'Blogs' })
  } else if (res?.response?.status === 422) {
    const errs = res.response.data?.errors ?? {}
    errors.value = Object.fromEntries(Object.entries(errs).map(([k, v]) => [k, v[0]]))
    toast.error('Please fix the highlighted errors')
  } else {
    toast.error('Failed to save post')
  }

  saving.value = false
}

onMounted(async () => {
  await fetchCategories()
  if (isEdit.value) await fetchBlog()
})
</script>
