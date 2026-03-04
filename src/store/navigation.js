import { defineStore } from 'pinia'

export const useNavigationStore = defineStore('navigation', {
  state: () => {
    return {
        navigation: []
    }
  },
  getters: {
    getNavigation: (state) => state.navigation,
  }, 
  actions: {
    setNav(nav) {
        //localStorage.setItem("breadcrumbs", val);
        this.navigation = nav;
    },
  }
})