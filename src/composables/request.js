import axios from 'axios'
import { displayFormErrors } from "@/composables/errors";
//import { useAuthStore } from "@/store/admin/auth";
//import { useConsumerAuthStore } from "@/store/frontend/consumerAuth";


// Axios requests
const useAxios = {

    /**
     *
     * @param {string} url
     * @param {object} data
     * @returns
     */
  
    get: async (url, data = {}) => {
      try {
        let res = [];
        if (data) {
          res = await axios.get(url, data);
        } else {
          res = await axios.get(url, {});
        }
        return res;
      } catch (error) {
        useAxios.processError(error)
        return error;
      }
    },
  
    /**
     *
     * Make a post request
     *
     * @param {string} url
     * @param {object} data
     * @param {ref|reactive|object} form
     * @returns
     */
    post: async (
      url,
      data = {},
      form = null,
    ) => {
      try {
        return  await axios.post(url, data);
      } catch (error) {
        if (form) {
            displayFormErrors(form, error);
        }
        useAxios.processError(error)
        return error
      }
    },

        /**
     *
     * Make a post request
     *
     * @param {string} url
     * @param {object} data
     * @param {ref|reactive|object} form
     * @returns
     */
        postImage: async (
          url,
          data = {},
          config,
        ) => {
          try {
            return  await axios.post(
              url, 
              data, 
              config
            );
          } catch (error) {
            if (form) {
                displayFormErrors(form, error);
            }
            useAxios.processError(error)
            return error
          }
        },
  
    /**
     *
     * Make a delete request
     *
     * @param {string} url
     * @param {object} data
     * @param {ref|reactive|object} form
     * @returns
     */
    delete: async (
      url,
      data = {},
      form = null,
    ) => {
      try {
        return await axios.delete(url, data);
      } catch (error) {
        if (form) {
            displayFormErrors(form, error);
        }
        useAxios.processError(error)
        return error
      }
    },
  
    /**
     *      
     * Make a patch request
     * 
     * @param {string} url
     * @param {object} data
     * @param {ref|reactive|object} form
     * @returns
     */
    patch: async (
      url,
      data = {},
      form = null,
    ) => {
      try {
        return await axios.patch(url, data);
      } catch (error) {
        if (form) {
          displayFormErrors(form, error);
        }
      }
      useAxios.processError(error)
      return error
    },

    processError: async (
      error
    ) => {

      if(error.response.request.status == 401){
       // const authStore = useAuthStore();
       // const consumerAuthStore = useConsumerAuthStore();

       // if(authStore.getIsLoggedIn){
       //   authStore.logout()
      //  }
       // else if(consumerAuthStore.getIsLoggedIn){
       //   consumerAuthStore.logoutConsumer()
      //  }
      }

    }
  };
  
  export {
    useAxios,
  };
  