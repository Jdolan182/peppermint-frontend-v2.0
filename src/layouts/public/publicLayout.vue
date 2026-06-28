<template>
  <div class="min-h-screen bg-white w-full">
    <publicHeader />

    <main class="w-full">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import publicHeader from "./publicHeader.vue";
import { RouterView } from "vue-router";
</script>
