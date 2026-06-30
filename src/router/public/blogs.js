export const PublicBlogRoutes = [
  {
    path: '/blogs',
    name: 'PublicBlogs',
    component: () => import('@/views/public/blogs/BlogsPage.vue'),
    meta: { layout: 'public', module: 'blogs' },
  },
  {
    path: '/blogs/:slug',
    name: 'PublicBlogPost',
    component: () => import('@/views/public/blogs/BlogPost.vue'),
    meta: { layout: 'public', module: 'blogs' },
  },
]
