import { HomeIcon } from '@heroicons/vue/24/outline'
import { config } from '@/config'

export const DashboardRoutes = [
  {
    path: '/' + config.admin.slug + '/dashboard',
    meta: { 
      requiresAuth: true,
      layout: 'admin',
      icon: HomeIcon,
      nav: 'Dashboard',
      breadcrumb: true
    },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/admin/dashboard/Dashboard.vue'),
        meta: {
          breadcrumbs: () => ([
              {title: 'Dashboard', current: true},
          ])
        }
      },
    ],
  },
];
