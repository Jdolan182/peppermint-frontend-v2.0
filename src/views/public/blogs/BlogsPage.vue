<template>
  <div class="w-full min-h-screen bg-gray-50">
    <!-- Hero header -->
    <div class="bg-white border-b border-gray-100">
      <div class="mx-auto max-w-6xl px-6 lg:px-10 py-16 lg:py-24">
        <p class="text-sm font-semibold tracking-widest text-indigo-600 uppercase mb-3">The Blog</p>
        <h1 class="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
          {{ blogTitle }}
        </h1>
        <p v-if="blogDescription" class="mt-4 text-xl text-gray-500 max-w-xl">
          {{ blogDescription }}
        </p>
      </div>
    </div>

    <div class="mx-auto max-w-6xl px-6 lg:px-10 py-10">
      <!-- Category filter -->
      <div class="flex flex-wrap gap-2.5">
        <button
          class="px-5 py-2 rounded-full text-sm font-medium transition-all border"
          :class="activeCategory === null
            ? 'bg-gray-900 text-white border-gray-900'
            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-900'"
          @click="setCategory(null)"
        >
          All posts
        </button>
        <button
          v-for="cat in categories"
          :key="cat.id"
          class="px-5 py-2 rounded-full text-sm font-medium transition-all border"
          :class="activeCategory === cat.slug
            ? 'bg-gray-900 text-white border-gray-900'
            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-900'"
          @click="setCategory(cat.slug)"
        >
          {{ cat.name }}
        </button>
      </div>

      <!-- Loading skeletons -->
      <template v-if="loading">
        <div class="mt-16 rounded-2xl bg-white border border-gray-100 animate-pulse h-60 mb-6" />
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="n in 8" :key="n" class="rounded-2xl bg-white border border-gray-100 animate-pulse h-48" />
        </div>
      </template>

      <!-- Empty -->
      <div v-else-if="posts.length === 0" class="mt-16 py-24 text-center">
        <p class="text-gray-400 text-lg">No posts yet in this category.</p>
      </div>

      <template v-else>
        <!-- Featured post (first) -->
        <router-link
          :to="{ name: 'PublicBlogPost', params: { slug: posts[0].slug } }"
          class="group block mt-16 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all overflow-hidden mb-6"
        >
          <div
            class="h-48 lg:h-64 w-full flex items-end p-6 lg:p-8"
            :style="{ background: gradientFor(posts[0]) }"
          >
            <div class="flex flex-wrap gap-2">
              <span
                v-for="cat in posts[0].categories"
                :key="cat.id"
                class="px-4 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-sm"
              >
                {{ cat.name }}
              </span>
            </div>
          </div>

          <div class="p-6 lg:p-8">
            <h2 class="text-2xl lg:text-3xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors leading-tight mb-3">
              {{ posts[0].title }}
            </h2>
            <p v-if="posts[0].excerpt" class="text-base text-gray-500 leading-relaxed mb-5 max-w-3xl">
              {{ posts[0].excerpt }}
            </p>
            <div class="flex items-center gap-4 text-sm text-gray-400">
              <span v-if="posts[0].author?.name" class="font-medium text-gray-600">{{ posts[0].author.name }}</span>
              <span>{{ formatDate(posts[0].published_at) }}</span>
              <span class="ml-auto text-indigo-600 font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                Read more
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </div>
          </div>
        </router-link>

        <!-- Rest of posts grid -->
        <div v-if="posts.length > 1" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <router-link
            v-for="post in posts.slice(1)"
            :key="post.id"
            :to="{ name: 'PublicBlogPost', params: { slug: post.slug } }"
            class="group flex flex-col rounded-xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all overflow-hidden"
          >
            <!-- Gradient header -->
            <div
              class="h-16 w-full flex items-end px-3 pb-2"
              :style="{ background: gradientFor(post) }"
            >
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="cat in post.categories"
                  :key="cat.id"
                  class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/25 text-white"
                >
                  {{ cat.name }}
                </span>
              </div>
            </div>

            <div class="flex flex-col flex-1 px-3 py-3">
              <h2 class="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors leading-snug mb-1.5 line-clamp-2">
                {{ post.title }}
              </h2>

              <div class="mt-auto pt-2 flex items-center justify-between text-xs text-gray-400">
                <span class="font-medium text-gray-500 truncate">{{ post.author?.name }}</span>
                <span class="flex-shrink-0 ml-2">{{ formatDate(post.published_at) }}</span>
              </div>
            </div>
          </router-link>
        </div>
      </template>

      <!-- Pagination -->
      <Pagination :meta="meta" class="mt-10" @change="fetchPage" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAxios } from '@/composables/request'
import { formatDate } from '@/helpers/date'
import Pagination from '@/components/tables/Pagination.vue'

const posts = ref([])
const categories = ref([])
const meta = ref(null)
const loading = ref(true)
const activeCategory = ref(null)
const currentPage = ref(1)
const blogTitle = ref('Our Blog')
const blogDescription = ref('')

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

function gradientFor(post) {
  const cats = post.categories ?? []
  const active = activeCategory.value && cats.find(c => c.slug === activeCategory.value)
  return colorToGradient((active || cats[0])?.color)
}

async function fetchPage(page = 1) {
  loading.value = true
  currentPage.value = page
  const params = { page, per_page: 13 }
  if (activeCategory.value) params.category = activeCategory.value

  const res = await useAxios.get('/api/public/blogs', { params })
  if (res?.data) {
    posts.value = res.data.data
    meta.value = res.data.meta
    categories.value = res.data.categories ?? []
    if (page === 1) {
      blogTitle.value = res.data.settings?.blog_title || 'Our Blog'
      blogDescription.value = res.data.settings?.blog_description || ''
    }
  }
  loading.value = false
}

function setCategory(slug) {
  activeCategory.value = slug
  fetchPage(1)
}

onMounted(() => fetchPage())
</script>
