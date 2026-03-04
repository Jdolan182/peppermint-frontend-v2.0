<template>
  <h2
    :class="[bold ? 'font-bold' : '', 'mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-white']"
  >
    {{ header }}
  </h2>
</template>

<script setup>
const { header, style, bold } = defineProps({
  header: {
    type: [String, Number],
    default: "",
  },
  bold: {
    type: Boolean,
    default: false,
  },
});
</script>