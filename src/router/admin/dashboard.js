import { HomeIcon } from '@heroicons/vue/24/outline'

export const DashboardRoutes = [
  {
    path: '/' + import.meta.env.VITE_MODULE_ADMIN_NAME.toLowerCase() + '/dashboard',
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
