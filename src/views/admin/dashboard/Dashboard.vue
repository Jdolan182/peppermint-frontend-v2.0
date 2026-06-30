<template>
  <div>
    <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">Stats</h3>
    <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
      <div v-for="item in stats" :key="item.name" class="overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 py-5 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 sm:p-6">
        <dt class="truncate text-sm font-medium text-gray-500 dark:text-gray-400">{{ item.name }}</dt>
        <dd class="mt-1 text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">{{ item.stat }}</dd>
      </div>
    </dl>
  </div>
</template>

<script setup>

  import { useAxios } from "@/composables/request.js";
  import { ref, onMounted } from 'vue'

  const stats = ref({})

  onMounted(async () => {
      getData()
  })

  const getData = async () => {
      try {

      const res = await useAxios.get(`/api/stats`)

      if(res.status == 200){


        // stats.value = [
        //     { name: 'Total Consumers', stat: res.data.data.consumers },
        //     { name: 'Admin Users', stat: res.data.data.users },
        //     { name: 'Published Blogs', stat: res.data.data.blogs },
        // ]
      }

      } catch (e) {
      }
  }

</script>
