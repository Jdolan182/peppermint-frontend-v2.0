import { HomeRoutes } from "./home"
import { ConsumerAuthRoutes } from "./auth"
import { PublicBlogRoutes } from "./blogs"

export function getPublicRoutes() {
  if (import.meta.env.VITE_MODULE_PUBLIC !== 'true') return []

  const routes = [
    ...HomeRoutes,
    ...ConsumerAuthRoutes,
  ]

  if (import.meta.env.VITE_MODULE_BLOGS === 'true') {
    routes.push(...PublicBlogRoutes)
  }


  // Catch-all dynamic CMS page
//   routes.push({
//     path: '/:slug',
//     name: 'DynamicPage',
//     component: () => import('@/views/frontend/pages/PageTemplate.vue'),
//     meta: {
//       layout: 'frontend'
//     }
//   })

  return routes
}