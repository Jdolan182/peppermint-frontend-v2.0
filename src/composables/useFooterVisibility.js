import { ref } from 'vue'

// Shared between publicLayout (which renders the footer) and CMS page
// views (which hide it when the page's show_footer toggle is off).
const footerVisible = ref(true)

export function useFooterVisibility() {
  return footerVisible
}
