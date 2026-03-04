<template>
  <div class="min-h-full">
    <publicHeader />

    <main>
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import publicHeader from "./publicHeader.vue";
import { RouterView } from "vue-router";
</script>
