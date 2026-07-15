<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 w-full flex flex-col">
    <publicHeader />

    <main class="w-full flex-1">
      <RouterView />
    </main>

    <PublicFooter v-if="footerVisible" />
  </div>
</template>

<script setup>
import publicHeader from "./publicHeader.vue";
import PublicFooter from "@/components/pages/public/PublicFooter.vue";
import { RouterView } from "vue-router";
import { useFooterVisibility } from "@/composables/useFooterVisibility";

const footerVisible = useFooterVisibility();
</script>
