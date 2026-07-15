<template>
  <div class="w-full">
    <!-- Hero: full-width gradient background, centered content -->
    <section class="w-full bg-gradient-to-b from-emerald-50 to-white">
      <div class="mx-auto max-w-screen-2xl px-8 lg:px-16 py-24 lg:py-32">
        <div class="text-center max-w-3xl mx-auto">
          <span class="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
            Now on Laravel 13 + Vue 3
          </span>
          <h1 class="mt-6 text-5xl font-bold tracking-tight text-gray-900 lg:text-6xl">
            Content management
            <span class="text-emerald-600"> made simple</span>
          </h1>
          <p class="mt-6 text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            {{ siteName }} is a modern CMS built for teams who move fast. Manage your content, users, and pages from one clean interface.
          </p>
          <div class="mt-10 flex items-center justify-center gap-4">
            <router-link
              v-if="publicLoginEnabled"
              :to="{ name: 'ConsumerLogin' }"
              class="rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition-colors"
            >
              Get started
            </router-link>
            <a href="#features" class="rounded-lg px-6 py-3 text-sm font-semibold text-gray-700 ring-1 ring-gray-300 hover:bg-gray-50 transition-colors">
              Learn more
            </a>
          </div>
        </div>

        <!-- Browser mockup -->
        <div class="mt-16 max-w-5xl mx-auto rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200 overflow-hidden">
          <div class="bg-gray-50 px-4 py-3 flex items-center gap-2 border-b border-gray-200">
            <div class="w-3 h-3 rounded-full bg-red-400"></div>
            <div class="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div class="w-3 h-3 rounded-full bg-green-400"></div>
            <div class="ml-4 flex-1 bg-white rounded-md px-3 py-1 text-xs text-gray-400 ring-1 ring-gray-200">
              peppermint.app/admin
            </div>
          </div>
          <div class="h-64 bg-gradient-to-br from-emerald-50 via-white to-purple-50 flex items-center justify-center">
            <div class="text-center">
              <div class="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <span class="text-white font-bold text-2xl">P</span>
              </div>
              <p class="mt-4 text-gray-400 text-sm">Your admin dashboard</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features: full-width white background, centered content -->
    <section id="features" class="w-full bg-white">
      <div class="mx-auto max-w-screen-2xl px-8 lg:px-16 py-24">
        <div class="text-center mb-16 max-w-2xl mx-auto">
          <h2 class="text-3xl font-bold text-gray-900">Everything you need</h2>
          <p class="mt-4 text-gray-500">Built on a solid foundation so you can focus on your content, not your infrastructure.</p>
        </div>
        <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="feature in features" :key="feature.title" class="rounded-2xl bg-gray-50 p-8 hover:bg-emerald-50 transition-colors group">
            <div class="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center group-hover:bg-emerald-700 transition-colors">
              <component :is="feature.icon" class="w-5 h-5 text-white" />
            </div>
            <h3 class="mt-4 text-base font-semibold text-gray-900">{{ feature.title }}</h3>
            <p class="mt-2 text-sm text-gray-500 leading-relaxed">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA: full-width gray background -->
    <section class="w-full bg-gray-50 py-16">
      <div class="mx-auto max-w-screen-2xl px-8 lg:px-16">
        <div class="bg-emerald-600 rounded-3xl px-8 py-16 text-center">
          <h2 class="text-3xl font-bold text-white">Ready to get started?</h2>
          <p class="mt-4 text-emerald-200">Join and start managing your content today.</p>
          <router-link
            v-if="publicLoginEnabled"
            :to="{ name: 'ConsumerLogin' }"
            class="mt-8 inline-flex items-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-emerald-600 shadow-sm hover:bg-emerald-50 transition-colors"
          >
            Sign in now
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  RectangleStackIcon,
  UsersIcon,
  ShieldCheckIcon,
  BoltIcon,
  CubeTransparentIcon,
  ArrowPathIcon,
} from '@heroicons/vue/24/outline'
import { usePublicModules } from '@/composables/publicModules'

const { isPublicModuleEnabled, siteName } = usePublicModules()
const publicLoginEnabled = computed(() => isPublicModuleEnabled('public_login'))

const features = [
  {
    title: 'Content Management',
    description: 'Create, edit, and publish content with an intuitive interface designed for speed.',
    icon: RectangleStackIcon,
  },
  {
    title: 'User Management',
    description: 'Separate admin and consumer authentication with independent user tables and guards.',
    icon: UsersIcon,
  },
  {
    title: 'Secure by Default',
    description: 'Built on Laravel Sanctum with CSRF protection, session auth, and module-level access control.',
    icon: ShieldCheckIcon,
  },
  {
    title: 'Blazing Fast',
    description: 'Vue 3 with Vite and Laravel 13 on PHP 8.5 — a modern stack from top to bottom.',
    icon: BoltIcon,
  },
  {
    title: 'Modular Architecture',
    description: 'Toggle admin, public, and consumer modules independently via environment flags.',
    icon: CubeTransparentIcon,
  },
  {
    title: 'Always Up to Date',
    description: 'Built to upgrade gracefully. Laravel 13, Vue 3, Tailwind v4 — no legacy baggage.',
    icon: ArrowPathIcon,
  },
]
</script>
