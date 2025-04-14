import { childView, currentView, getView, isGoingBack, parentView, routeStack } from '@/composables/useWrapperSwipeBack';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '',
      component: () => import('@/components/WrapperSwipeBack.vue'),
      meta: {
        handlesSwipeBack: true,
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
      component: () => import('@/components/WrapperSwipeBack.vue'),
      meta: {
        handlesSwipeBack: true,
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
  ],
});

router.beforeResolve(async (to) => {
  const handlesSwipeBack = to.matched.some((route) => route.meta.handlesSwipeBack);

  if (handlesSwipeBack) {
    const targetRouteIndex = routeStack.value.indexOf(to.name);

    // if not in the same stack, reset the stack
    if (to.matched[1].name !== routeStack.value[0]) {
      routeStack.value = [];
      parentView.value = null;
      currentView.value = null;
      childView.value = null;
    }

    // if stack is empty, build the stack
    if (routeStack.value.length < 1) {
      for (let i = 0; i < to.matched.length; i++) {
        const route = to.matched[i];
        if (route.name) {
          routeStack.value.push(route.name);
        }
      }
      currentView.value = await getView(to.name, router);
      if (routeStack.value.length > 1) {
        parentView.value = await getView(routeStack.value.at(-2), router);
      }
    }
    // if the target route is not in the stack, add target route to the stack
    else if (targetRouteIndex === -1) {
      childView.value = await getView(to.name, router);
      routeStack.value.push(to.name);
    }
    // if the target route is in the stack, remove all routes after it
    else if (targetRouteIndex > -1) {
      parentView.value = await getView(routeStack.value.at(targetRouteIndex), router);
      isGoingBack.value = true;
      routeStack.value.splice(targetRouteIndex + 1);
    }
  } else {
    routeStack.value = [];
    parentView.value = null;
    currentView.value = null;
    childView.value = null;
  }
});

export { router };
