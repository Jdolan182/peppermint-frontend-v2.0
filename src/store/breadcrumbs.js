import { defineStore } from 'pinia'

export const useBreadcrumbStore = defineStore('breadcrumbs', {
  state: () => {
    return {
        breadcrumbs: []
    }
  },
  getters: {
    getBreadcrumbs: (state) => state.breadcrumbs,
  }, 
  actions: {
    setCrumbs(crumbs) {
        //localStorage.setItem("breadcrumbs", val);
        this.breadcrumbs = crumbs;
    },
  }
})