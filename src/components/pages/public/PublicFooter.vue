<template>
  <footer v-if="sections.length" class="bg-gray-950 border-t border-gray-800 py-12 px-6">
    <div class="max-w-5xl mx-auto">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <component
          v-for="section in sections"
          :key="section.id"
          :is="footerComponent(section.type)"
          :data="section.data ?? {}"
        />
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { useAxios } from '@/composables/request'

const FOOTER_MAP = {
  'footer-brand':      defineAsyncComponent(() => import('@/components/pages/footer/FooterBrand.vue')),
  'footer-links':      defineAsyncComponent(() => import('@/components/pages/footer/FooterLinks.vue')),
  'footer-social':     defineAsyncComponent(() => import('@/components/pages/footer/FooterSocial.vue')),
  'footer-newsletter': defineAsyncComponent(() => import('@/components/pages/footer/FooterNewsletter.vue')),
  'footer-text':       defineAsyncComponent(() => import('@/components/pages/footer/FooterText.vue')),
}

function footerComponent(type) {
  return FOOTER_MAP[type] ?? null
}

const sections = ref([])

onMounted(async () => {
  const res = await useAxios.get('/api/public/footer')
  sections.value = res?.data ?? []
})
</script>
