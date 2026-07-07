import { config } from '@/config'
const base = '/' + config.admin.slug

export const BlogRoutes = [
  {
    path: base + '/blogs',
    meta: { requiresAuth: true, layout: 'admin', module: 'blogs' },
    children: [
      {
        path: '',
        name: 'Blogs',
        component: () => import('@/views/admin/blogs/BlogsIndex.vue'),
      },
    ],
  },
  {
    path: base + '/blogs/create',
    name: 'BlogCreate',
    meta: { requiresAuth: true, layout: 'admin', module: 'blogs' },
    component: () => import('@/views/admin/blogs/BlogEditor.vue'),
  },
  {
    path: base + '/blogs/:id/edit',
    name: 'BlogEdit',
    meta: { requiresAuth: true, layout: 'admin', module: 'blogs' },
    component: () => import('@/views/admin/blogs/BlogEditor.vue'),
  },
  {
    path: base + '/blogs/categories',
    meta: { requiresAuth: true, layout: 'admin', module: 'blogs' },
    children: [
      {
        path: '',
        name: 'BlogCategories',
        component: () => import('@/views/admin/blogs/CategoriesIndex.vue'),
      },
    ],
  },
]
