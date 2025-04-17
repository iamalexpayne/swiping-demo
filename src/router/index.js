import { swipeBackStack, transitionBack } from '@/composables/useSwipeBackStack';
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
    const targetRouteIndex = swipeBackStack.value.indexOf(to.name);
    const rootRouteName = to.matched[1].name;

    // if not in the same stack, reset the stack
    if (rootRouteName !== swipeBackStack.value[0]) {
      swipeBackStack.value = [];
    }

    // if stack is empty, build the stack
    if (swipeBackStack.value.length < 1) {
      for (let i = 1; i < to.matched.length; i++) {
        const route = to.matched[i];
        if (route.name) {
          swipeBackStack.value.push(route.name);
        } else {
          console.error('Route name is missing for route:', route);
        }
      }
    }

    // if the target route is not in the stack, add target route to the stack
    else if (targetRouteIndex === -1) {
      swipeBackStack.value.push(to.name);
    }

    // if the target route is in the stack, remove all routes after it
    else if (targetRouteIndex > -1) {
      const stepsBack = swipeBackStack.value.length - (targetRouteIndex + 1);
      swipeBackStack.value.splice(targetRouteIndex + 1);
      await transitionBack(stepsBack);
    }
  } else {
    swipeBackStack.value = [];
  }
});

export { router };
