export const HomeRoutes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/public/HomeView.vue'),
    meta: {
      layout: 'public',
      module: 'public',
      nav: 'Home',
    },
  },
]
