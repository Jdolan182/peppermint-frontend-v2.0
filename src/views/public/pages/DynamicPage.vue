<template>
  <div v-if="page">
    <component
      v-for="section in page.sections"
      :key="section.id"
      :is="blockComponent(section.type)"
      :data="section.data ?? {}"
    />

    <PublicFooter v-if="page.show_footer" />
  </div>

  <div v-else-if="notFound" class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white">404</h1>
      <p class="mt-2 text-gray-500">Page not found</p>
      <router-link :to="{ name: 'Home' }" class="mt-4 inline-block text-indigo-600 hover:underline text-sm">Go home</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import { useAxios } from '@/composables/request'
import PublicFooter from '@/components/pages/public/PublicFooter.vue'

function applyMeta(page) {
  document.title = page?.meta_title || page?.title || ''
  let metaDesc = document.querySelector('meta[name="description"]')
  if (!metaDesc) {
    metaDesc = document.createElement('meta')
    metaDesc.setAttribute('name', 'description')
    document.head.appendChild(metaDesc)
  }
  metaDesc.setAttribute('content', page?.meta_description || '')
}

const route = useRoute()
const page = ref(null)
const notFound = ref(false)

const BLOCK_MAP = {
  'hero':         defineAsyncComponent(() => import('@/components/pages/blocks/HeroBlock.vue')),
  'features':     defineAsyncComponent(() => import('@/components/pages/blocks/FeaturesBlock.vue')),
  'cta':          defineAsyncComponent(() => import('@/components/pages/blocks/CtaBlock.vue')),
  'bento':        defineAsyncComponent(() => import('@/components/pages/blocks/BentoBlock.vue')),
  'pricing':      defineAsyncComponent(() => import('@/components/pages/blocks/PricingBlock.vue')),
  'page-header':  defineAsyncComponent(() => import('@/components/pages/blocks/PageHeaderBlock.vue')),
  'stats':        defineAsyncComponent(() => import('@/components/pages/blocks/StatsBlock.vue')),
  'testimonials': defineAsyncComponent(() => import('@/components/pages/blocks/TestimonialsBlock.vue')),
  'contact':      defineAsyncComponent(() => import('@/components/pages/blocks/ContactBlock.vue')),
  'team':         defineAsyncComponent(() => import('@/components/pages/blocks/TeamBlock.vue')),
  'content':      defineAsyncComponent(() => import('@/components/pages/blocks/ContentBlock.vue')),
  'logo-cloud':   defineAsyncComponent(() => import('@/components/pages/blocks/LogoCloudBlock.vue')),
  'faq':          defineAsyncComponent(() => import('@/components/pages/blocks/FaqBlock.vue')),
}

function blockComponent(type) {
  return BLOCK_MAP[type] ?? null
}

async function load(slug) {
  page.value = null
  notFound.value = false
  try {
    const res = await useAxios.get(`/api/public/pages/${slug}`)
    page.value = res?.data ?? null
    if (!page.value) notFound.value = true
    else applyMeta(page.value)
  } catch {
    notFound.value = true
  }
}

watch(() => route.params.slug, (slug) => { if (slug) load(slug) }, { immediate: true })
</script>
