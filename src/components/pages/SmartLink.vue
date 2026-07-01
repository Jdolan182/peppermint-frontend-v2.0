<template>
  <router-link v-if="isInternal" :to="href" v-bind="$attrs">
    <slot />
  </router-link>
  <a v-else :href="href" target="_blank" rel="noopener noreferrer" v-bind="$attrs">
    <slot />
  </a>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  href: { type: String, default: '#' },
})

const isInternal = computed(() => props.href && props.href.startsWith('/'))
</script>
