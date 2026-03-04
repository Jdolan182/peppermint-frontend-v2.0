<template>
    <label class="block text-sm/6 font-medium text-gray-900 dark:text-gray-100">{{ props.label }}</label>
</template>

<script setup>
    const props = defineProps({
        label: {
            type: [String, Number],
            default: () => "",
        },
    });
</script>