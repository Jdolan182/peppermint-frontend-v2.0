<template>
  <div class="w-full min-h-screen bg-gray-50">
    <!-- Loading -->
    <template v-if="loading">
      <div class="h-64 bg-gray-200 animate-pulse" />
      <div class="mx-auto max-w-3xl px-6 lg:px-10 py-12 space-y-5 animate-pulse">
        <div class="h-4 bg-gray-200 rounded w-1/3" />
        <div class="h-4 bg-gray-200 rounded w-1/2" />
        <div class="space-y-3 mt-10">
          <div v-for="n in 10" :key="n" class="h-4 bg-gray-200 rounded" :style="{ width: n % 4 === 0 ? '75%' : '100%' }" />
        </div>
      </div>
    </template>

    <!-- Not found -->
    <div v-else-if="!post" class="flex items-center justify-center min-h-[60vh]">
      <div class="text-center">
        <p class="text-6xl font-bold text-gray-200 mb-4">404</p>
        <p class="text-gray-500 text-lg mb-6">Post not found.</p>
        <router-link :to="{ name: 'PublicBlogs' }" class="text-indigo-600 hover:text-indigo-500 font-medium">
          ← Back to blog
        </router-link>
      </div>
    </div>

    <template v-else>
      <!-- Hero gradient banner -->
      <div class="w-full h-64 lg:h-80" :style="{ background: heroGradient }">
        <div class="mx-auto max-w-3xl px-6 lg:px-10 h-full flex flex-col justify-end pb-10">
          <div class="flex flex-wrap gap-2 mb-4">
            <span
              v-for="cat in post.categories"
              :key="cat.id"
              class="px-4 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-sm"
            >
              {{ cat.name }}
            </span>
          </div>
          <h1 class="text-4xl lg:text-5xl font-bold text-white leading-tight">
            {{ post.title }}
          </h1>
        </div>
      </div>

      <!-- Body -->
      <div class="mx-auto max-w-3xl px-6 lg:px-10">
        <!-- Meta strip -->
        <div class="flex items-center gap-6 text-sm text-gray-500 py-5 border-b border-gray-200 mb-10">
          <router-link
            :to="{ name: 'PublicBlogs' }"
            class="inline-flex items-center gap-1.5 text-gray-400 hover:text-gray-700 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            All posts
          </router-link>
          <span v-if="post.author?.name" class="font-medium text-gray-700">{{ post.author.name }}</span>
          <span>{{ formatDate(post.published_at) }}</span>
        </div>

        <!-- Excerpt lead -->
        <p v-if="post.excerpt" class="text-xl text-gray-600 leading-relaxed mb-10 font-medium border-l-4 border-indigo-400 pl-5">
          {{ post.excerpt }}
        </p>

        <!-- Body content -->
        <div class="blog-content pb-24" v-html="post.content" />
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAxios } from '@/composables/request'
import { formatDate } from '@/helpers/date'

const route = useRoute()
const post = ref(null)
const loading = ref(true)

function colorToGradient(hex) {
  if (!hex || !/^#[0-9a-fA-F]{6}$/.test(hex)) return 'linear-gradient(135deg, #a5b4fc 0%, #6366f1 100%)'
  const num = parseInt(hex.replace('#', ''), 16)
  const r = (num >> 16) & 0xff
  const g = (num >> 8) & 0xff
  const b = num & 0xff
  const lr = Math.min(255, r + 80)
  const lg = Math.min(255, g + 80)
  const lb = Math.min(255, b + 80)
  const light = '#' + [lr, lg, lb].map(v => v.toString(16).padStart(2, '0')).join('')
  return `linear-gradient(135deg, ${light} 0%, ${hex} 100%)`
}

const heroGradient = computed(() => colorToGradient(post.value?.categories?.[0]?.color))

onMounted(async () => {
  const res = await useAxios.get(`/api/public/blogs/${route.params.slug}`)
  if (res?.data?.data) {
    post.value = res.data.data
  }
  loading.value = false
})
</script>

<style scoped>
.blog-content {
  font-size: 1.125rem;
  line-height: 1.85;
  color: #1f2937;
}

.blog-content :deep(h1),
.blog-content :deep(h2),
.blog-content :deep(h3),
.blog-content :deep(h4) {
  font-weight: 700;
  color: #111827;
  line-height: 1.25;
  margin-top: 2.5em;
  margin-bottom: 0.75em;
}
.blog-content :deep(h1) { font-size: 2.25rem; }
.blog-content :deep(h2) { font-size: 1.75rem; }
.blog-content :deep(h3) { font-size: 1.375rem; }
.blog-content :deep(h4) { font-size: 1.125rem; }

.blog-content :deep(> *:first-child) { margin-top: 0; }

.blog-content :deep(p) { margin-bottom: 1.5em; }

.blog-content :deep(ul),
.blog-content :deep(ol) {
  padding-left: 1.75rem;
  margin-bottom: 1.5em;
}
.blog-content :deep(ul) { list-style-type: disc; }
.blog-content :deep(ol) { list-style-type: decimal; }
.blog-content :deep(li) { margin-bottom: 0.5em; }
.blog-content :deep(li::marker) { color: #6b7280; }

.blog-content :deep(blockquote) {
  border-left: 4px solid #c7d2fe;
  background: #eef2ff;
  margin: 2em 0;
  padding: 1em 1.5em;
  border-radius: 0 8px 8px 0;
  color: #4338ca;
  font-style: italic;
  font-size: 1.05rem;
}

.blog-content :deep(hr) {
  border: none;
  border-top: 2px solid #e5e7eb;
  margin: 3em auto;
  width: 40%;
}

.blog-content :deep(strong) { font-weight: 700; color: #111827; }
.blog-content :deep(em) { font-style: italic; }

.blog-content :deep(a) {
  color: #4f46e5;
  text-decoration: underline;
  text-underline-offset: 3px;
}
.blog-content :deep(a:hover) { color: #3730a3; }

.blog-content :deep(code) {
  background: #f3f4f6;
  color: #4f46e5;
  padding: 0.15em 0.4em;
  border-radius: 5px;
  font-size: 0.875em;
  font-family: ui-monospace, 'Cascadia Code', 'Fira Code', monospace;
}

.blog-content :deep(pre) {
  background: #0f172a;
  color: #e2e8f0;
  padding: 1.5em 1.75em;
  border-radius: 12px;
  overflow-x: auto;
  margin: 2em 0;
  font-size: 0.9em;
  font-family: ui-monospace, 'Cascadia Code', 'Fira Code', monospace;
  line-height: 1.7;
}
.blog-content :deep(pre code) {
  background: transparent;
  color: inherit;
  padding: 0;
  font-size: inherit;
}
</style>
