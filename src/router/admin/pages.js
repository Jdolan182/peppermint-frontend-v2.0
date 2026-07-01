export const PagesRoutes = [
  {
    path: '/' + import.meta.env.VITE_MODULE_ADMIN_NAME.toLowerCase() + '/pages',
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
