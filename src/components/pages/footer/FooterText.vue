<template>
  <div class="prose prose-sm prose-invert" v-html="data.body" />
</template>

<script setup>
defineProps({ data: { type: Object, default: () => ({}) } })
</script>
