export const ConsumerAuthRoutes = [
  {
    path: '/login',
    name: 'ConsumerLogin',
    component: () => import('@/views/public/auth/Login.vue'),
    meta: {
      skipIfConsumerAuth: true,
      module: 'public_login',
    },
  },
]
