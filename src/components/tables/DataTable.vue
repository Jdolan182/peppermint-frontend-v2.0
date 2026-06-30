<template>
  <div class="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead class="bg-gray-50 dark:bg-gray-800">
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            :class="col.class"
          >
            {{ col.label }}
          </th>
          <th v-if="$slots.actions" class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
        <tr v-if="rows.length === 0">
          <td :colspan="columns.length + ($slots.actions ? 1 : 0)" class="px-4 py-10 text-center text-sm text-gray-400 dark:text-gray-500">
            {{ emptyMessage }}
          </td>
        </tr>
        <tr v-for="row in rows" :key="row.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
          <td
            v-for="col in columns"
            :key="col.key"
            class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap"
          >
            <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">
              {{ col.format ? col.format(row[col.key]) : row[col.key] }}
            </slot>
          </td>
          <td v-if="$slots.actions" class="px-4 py-3 text-right whitespace-nowrap">
            <slot name="actions" :row="row" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  columns: { type: Array, required: true },
  rows: { type: Array, default: () => [] },
  emptyMessage: { type: String, default: 'No records found.' },
})
</script>
