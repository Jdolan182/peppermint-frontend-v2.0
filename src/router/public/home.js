export const HomeRoutes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/public/pages/HomePage.vue'),
    meta: {
      layout: 'public',
      module: 'public',
      nav: 'Home',
    },
  },
]
