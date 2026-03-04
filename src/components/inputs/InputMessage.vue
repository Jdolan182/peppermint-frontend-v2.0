<script setup>
defineProps({
  error: Boolean,
  errorMessage: {
    type: String,
    default: "",
  },
});
</script>

<template>
  <p v-if="error" class="mt-2 mb-1 text-sm text-red-600">
    {{ errorMessage }}
  </p>
</template>