import { defineStore } from 'pinia'

export const useMaintenanceStore = defineStore('maintenance', {
  state: () => {
    return {
        showMaintenanceMode: localStorage.getItem("showMaintenanceMode") ?? 1,
    }
  },
  getters: {
    getShowMaintenanceMode: (state) => state.showMaintenanceMode,
  }, 
  actions: {
    setMode(mode) {
        
        localStorage.setItem("showMaintenanceMode", mode)
        this.showMaintenanceMode = mode;
    }
  }
})