import { clearSwipeBackStack, handleSwipeBackStack } from '@/composables/useSwipeBackStack';
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    component: () => import('@/components/SwipeBackStack.vue'),
    meta: {
      swipeBackStack: true,
    },
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/home/HomeRoot.vue'),
        children: [
          {
            path: 'child-view',
            name: 'homeSub',
            component: () => import('@/views/home/HomeSub.vue'),
          },
          {
            path: 'other-child-view',
            name: 'homeSub1',
            component: () => import('@/views/home/HomeSub1.vue'),
          },
        ],
      },
    ],
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/ViewAbout.vue'),
  },
  {
    path: '/profile',
    component: () => import('@/components/SwipeBackStack.vue'),
    meta: {
      swipeBackStack: true,
    },
    children: [
      {
        path: '',
        name: 'profileMenu',
        component: () => import('@/views/profile/ProfileMenu.vue'),
        children: [
          {
            path: 'settings',
            name: 'profileSettingsMenu',
            component: () => import('@/views/profile/settings/SettingsMenu.vue'),
            children: [
              {
                path: 'notifications',
                name: 'profileSettingsNotifications',
                component: () => import('@/views/profile/settings/SettingsNotifications.vue'),
              },
              {
                path: 'security',
                name: 'profileSettingsSecurity',
                component: () => import('@/views/profile/settings/SettingsSecurity.vue'),
              },
            ],
          },
          {
            path: 'public',
            name: 'profilePublicDetails',
            component: () => import('@/views/profile/public/PublicDetails.vue'),
            children: [
              {
                path: 'edit',
                name: 'profilePublicDetailsEdit',
                component: () => import('@/views/profile/public/PublicDetailsEdit.vue'),
              },
            ],
          },
        ],
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeResolve(async (to) => {
  const isSwipeBackStack = !!to.matched.at(0).meta.swipeBackStack;

  if (isSwipeBackStack) {
    await handleSwipeBackStack(to);
  } else {
    clearSwipeBackStack();
  }
});

export { router };
