<template>
  <!-- Styled directly: the "prose" classes need the Tailwind typography plugin, which isn't installed,
       so they left this text the default dark colour on the dark footer. Matches the footer's other text. -->
  <div
    class="space-y-2 text-sm text-gray-400 [&_a]:text-gray-300 [&_a]:underline [&_a:hover]:text-white [&_strong]:text-gray-200"
    v-html="data.body"
  />
</template>

<script setup>
defineProps({ data: { type: Object, default: () => ({}) } })
</script>
