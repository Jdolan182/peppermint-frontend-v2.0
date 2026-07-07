import { UsersIcon } from '@heroicons/vue/24/outline'
import { config } from '@/config'

export const ConsumerRoutes = [
  {
    path: '/' + config.admin.slug + '/consumers',
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
