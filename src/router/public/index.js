import { HomeRoutes } from "./home"

export function getPublicRoutes() {
  if (import.meta.env.VITE_MODULE_PUBLIC !== 'true') return []

  const routes = [
    ...HomeRoutes,
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