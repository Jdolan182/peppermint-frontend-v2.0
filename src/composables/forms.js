import { ref } from 'vue'


/**
 * @param { array } fields
 * @returns { array } 
 */
export const createForm = (fields) => {

    const form = ref({});

    fields.forEach ((value, index) => {
          form.value[value.key] = {
            value: value.default,
            error: false,
            errorMessage: "",
        }
      })
    
    return form
};

/**
 * @param { array } form
 * @param { array } data
 */
export const populateForm = (form, data) => {

    for (let key in data) {
        if (form.value[key]) {
            form.value[key].value = data[key]
            form.value[key].error = null
        };
    }
};