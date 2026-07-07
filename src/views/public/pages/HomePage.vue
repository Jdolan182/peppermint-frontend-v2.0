<template>
  <!-- CMS home page -->
  <div v-if="cmsPage">
    <component
      v-for="section in cmsPage.sections"
      :key="section.id"
      :is="blockComponent(section.type)"
      :data="section.data ?? {}"
    />
    <PublicFooter v-if="cmsPage.show_footer" />
  </div>

  <!-- Fallback to static home -->
  <HomeView v-else-if="!loading" />
</template>

<script setup>
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { useAxios } from '@/composables/request'
import HomeView from '@/views/public/HomeView.vue'
import PublicFooter from '@/components/pages/public/PublicFooter.vue'

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

const cmsPage = ref(null)
const loading = ref(true)

onMounted(async () => {
  const res = await useAxios.get('/api/public/pages/home')
  cmsPage.value = res?.data ?? null
  loading.value = false
  if (cmsPage.value) {
    document.title = cmsPage.value.meta_title || cmsPage.value.title || ''
    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.setAttribute('name', 'description')
      document.head.appendChild(metaDesc)
    }
    metaDesc.setAttribute('content', cmsPage.value.meta_description || '')
  }
})
</script>
