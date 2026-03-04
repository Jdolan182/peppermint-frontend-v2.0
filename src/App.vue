<script setup>
import { RouterView, useRoute } from "vue-router";

import adminLayout from "./layouts/admin/adminLayout.vue";
import maintenanceLayout from "./layouts/maintenance/maintenanceLayout.vue";
import publicLayout from "./layouts/public/publicLayout.vue";
import Banner from "@/components/banners/Banner.vue";
import { ref, computed } from "vue";

const route = useRoute();

const maintenanceMode = import.meta.env.VITE_MAINTENANCE_MODE;

const showMaintenanceMode = ref(0);

if (maintenanceMode === "true") {
  const maintenanceStore = useMaintenanceStore();
  const maintenanceMode = computed(() => maintenanceStore.getShowMaintenanceMode);

  showMaintenanceMode.value = maintenanceMode.value;
} else {
  showMaintenanceMode.value = 0;
}

const updateMaintenanceMode = async () => {
  showMaintenanceMode.value = 0;
};

</script>

<template>
  <!-- Admin layout -->
  <adminLayout v-if="route.meta.layout === 'admin'" class="w-full bg-gray-100" />

  <!-- Frontend layout -->
  <publicLayout v-else-if="route.meta.layout === 'public'" class="w-full bg-gray-100" />

  <!-- No specific layout -->
  <RouterView v-else class="w-full bg-gray-100" />

  <!-- Banner always rendered -->
  <Banner class="z-50" />
</template>
