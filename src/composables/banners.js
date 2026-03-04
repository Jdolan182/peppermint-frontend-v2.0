import { useBannerStore } from "@/store/banners";
const bannerStore = useBannerStore();

/**
 *
 * Shows the banner component for a short time.
 *
 * @param {boolean} show
 * @param {int} status
 * @param {string} message
 */
export const setBanner = (show = false, status = 404, title="Error", message = "error") => {
  bannerStore.setBanner(show, status, title, message);
};

export const showSuccessBanner = (title, message) => {
  bannerStore.setBanner(true, 200, title, message);
}

export const showErrorBanner = (title, message) => {
  bannerStore.setBanner(true, 500, title,  message);  
}