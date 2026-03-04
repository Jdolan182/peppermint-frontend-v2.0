/**
 * @param {ref|reactive|object} form
 * @param {ref|reactive|object} errors
 * @returns
 */
export const displayFormErrors = (form = {}, errors = {}) => {
  
  // Remove any previous errors
  for (let input in form.value) {
    form.value[input].error = false;
    form.value[input].errorMessage = '';
  }

  // Loop over errors in response and display them
  for (let error in errors.response.data.errors) {
    
    if (form.value[error]) {
      let errorMessage = `${errors.response.data.errors[error][0]}`;
      form.value[error].error = true;
      form.value[error].errorMessage = errorMessage;
    }
  }

  return;
};

export const removeErrors = (form = {}, errors = {}) => {
  
  // Remove error
  for (let input in form.value) {
    form.value[input].error = false;
    form.value[input].errorMessage = '';
  }

  return;
};