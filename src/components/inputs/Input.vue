<template>
    <input
    v-model.trim="value"
    :disabled="disabled"
    class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
    :class="[
        error ? 'border-red-500 placeholder-red-500' : 'border-gray-300',
        disabled ? 'text-gray-500' : 'text-gray-900',
        icon ? 'pl-10' : 'focus:border-indigo-600 focus:ring-indigo-600'
    ]"
    />

    <InputMessage
    v-if="error"
    :error="error"
    :error-message="errorMessage"
    />
</template>

<script setup>
    import { computed } from "vue";
    import InputMessage from "@/components/inputs/InputMessage.vue";

    const props = defineProps({
    modelValue: {
        type: [String, Number],
        default: "",
    },
    disabled: Boolean,
    icon: Boolean,
    error: Boolean,
    errorMessage: String,
    });

    const emit = defineEmits(["update:modelValue"]);

    const value = computed({
    get: () => props.modelValue,
    set: (val) => emit("update:modelValue", val),
    });
</script>