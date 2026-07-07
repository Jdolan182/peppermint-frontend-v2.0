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
  {
    path: '/forgot-password',
    name: 'ConsumerForgotPassword',
    component: () => import('@/views/public/auth/ForgotPassword.vue'),
    meta: { module: 'public_login' },
  },
  {
    path: '/reset-password',
    name: 'ConsumerResetPassword',
    component: () => import('@/views/public/auth/ResetPassword.vue'),
    meta: { module: 'public_login' },
  },
]
