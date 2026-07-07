import { config } from '@/config'

export const PagesRoutes = [
  {
    path: '/' + config.admin.slug + '/pages',
    meta: {
      requiresAuth: true,
      layout: 'admin',
      module: 'pages',
    },
    children: [
      {
        path: '',
        name: 'Pages',
        component: () => import('@/views/admin/pages/PagesIndex.vue'),
      },
      {
        path: ':id',
        name: 'PageEditor',
        component: () => import('@/views/admin/pages/PageEditor.vue'),
      },
      {
        path: 'footer',
        name: 'FooterEditor',
        component: () => import('@/views/admin/pages/FooterEditor.vue'),
      },
      {
        path: 'contact',
        name: 'ContactSubmissions',
        component: () => import('@/views/admin/pages/ContactSubmissions.vue'),
      },
    ],
  },
]
