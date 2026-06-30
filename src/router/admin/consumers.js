import { UsersIcon } from '@heroicons/vue/24/outline'

export const ConsumerRoutes = [
  {
    path: '/' + import.meta.env.VITE_MODULE_ADMIN_NAME.toLowerCase() + '/consumers',
    meta: {
      requiresAuth: true,
      layout: 'admin',
      module: 'consumers',
      icon: UsersIcon,
      nav: 'Consumers',
    },
    children: [
      {
        path: '',
        name: 'Consumers',
        component: () => import('@/views/admin/consumers/ConsumersIndex.vue'),
      },
    ],
  },
]
