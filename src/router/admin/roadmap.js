export const RoadmapRoutes = [
  {
    path: '/' + import.meta.env.VITE_MODULE_ADMIN_NAME.toLowerCase() + '/roadmap',
    meta: {
      requiresAuth: true,
      layout: 'admin',
      module: 'roadmap',
    },
    children: [
      {
        path: '',
        name: 'Roadmap',
        component: () => import('@/views/admin/roadmap/RoadmapIndex.vue'),
      },
      {
        path: 'categories',
        name: 'RoadmapCategories',
        component: () => import('@/views/admin/roadmap/RoadmapCategoriesSettings.vue'),
      },
    ],
  },
]
