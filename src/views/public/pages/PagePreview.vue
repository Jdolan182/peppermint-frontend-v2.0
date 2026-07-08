<template>
  <!-- Draft banner -->
  <div class="sticky top-0 z-50 flex items-center justify-between bg-amber-400 px-4 py-2 text-sm font-medium text-amber-900">
    <span>Draft preview — this page is not published</span>
    <button @click="close" class="rounded px-2 py-0.5 hover:bg-amber-500 transition-colors text-xs">Close</button>
  </div>

  <div v-if="page">
    <component
      v-for="section in page.sections"
      :key="section.id"
      :is="blockComponent(section.type)"
      :data="section.data ?? {}"
    />
  </div>

  <div v-else-if="loading" class="flex min-h-screen items-center justify-center">
    <p class="text-sm text-gray-400">Loading preview…</p>
  </div>

  <div v-else class="flex min-h-screen items-center justify-center">
    <p class="text-sm text-gray-500">Page not found or you are not logged in.</p>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import { useAxios } from '@/composables/request'
import { useFooterVisibility } from '@/composables/useFooterVisibility'

const footerVisible = useFooterVisibility()
onUnmounted(() => { footerVisible.value = true })

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

const route = useRoute()
const page = ref(null)
const loading = ref(true)

function close() {
  window.close()
}

onMounted(async () => {
  try {
    const res = await useAxios.get(`/api/admin/pages/${route.params.id}/preview`)
    page.value = res?.data ?? null
  } catch {
    page.value = null
  }
  loading.value = false
  footerVisible.value = page.value ? page.value.show_footer !== false : true
})
</script>
