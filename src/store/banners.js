import { defineStore } from "pinia";

export const useBannerStore = defineStore('banners', {
    state: () => {
        return {
            show: false,
            status: 404,
            title: "",
            message: "",
        }
    },
    getters: {
        getShow: (state) => state.show,
        getStatus: (state) => state.status,
        getTitle: (state) => state.title,
        getMessage: (state) => state.message,
    }, 
    actions: {
        setBanner(show = false, status = 404, title = "", message = "") {
            this.show = show;
            this.status = status;
            this.title = title;
            this.message = message;
            setTimeout(()=>{      
                this.hideBanner()
            }, 2000);
        },
        hideBanner() {
            this.show = false;
            this.status = 404;
            this.title = "";
            this.message = "";
        }
    }
  })

