
export const HomeRoutes = [
  {
    path: '/',
    meta: {
      layout: 'public',
      nav: 'Home'
    },
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/public/HomeView.vue'),
      },
    ],
  },
];
