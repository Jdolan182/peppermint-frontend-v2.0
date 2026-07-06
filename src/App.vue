<script setup>
import { RouterView, useRoute } from "vue-router";

import adminLayout from "./layouts/admin/adminLayout.vue";
import publicLayout from "./layouts/public/publicLayout.vue";
import Banner from "@/components/banners/Banner.vue";
import ToastContainer from "@/components/ui/ToastContainer.vue";
import { onMounted, onUnmounted } from "vue";
import { useThemeStore } from "@/store/theme";

const route = useRoute();

const themeStore = useThemeStore()

const systemMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
const onSystemChange = () => {
  if (themeStore.preference === 'system') themeStore.apply()
}

onMounted(() => {
  themeStore.apply()
  systemMediaQuery.addEventListener('change', onSystemChange)
})

onUnmounted(() => {
  systemMediaQuery.removeEventListener('change', onSystemChange)
})
</script>

<template>
  <!-- Admin layout -->
  <adminLayout v-if="route.meta.layout === 'admin'" class="w-full bg-gray-100" />

  <!-- Frontend layout -->
  <publicLayout v-else-if="route.meta.layout === 'public'" class="w-full" />

  <!-- No specific layout -->
  <RouterView v-else class="w-full bg-gray-100" />

  <!-- Banner always rendered -->
  <Banner class="z-50" />
  <ToastContainer />
</template>
