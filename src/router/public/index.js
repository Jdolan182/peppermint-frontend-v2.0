import { HomeRoutes } from "./home"
import { ConsumerAuthRoutes } from "./auth"

export function getPublicRoutes() {
  if (import.meta.env.VITE_MODULE_PUBLIC !== 'true') return []

  const routes = [
    ...HomeRoutes,
    ...ConsumerAuthRoutes,
  ]


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