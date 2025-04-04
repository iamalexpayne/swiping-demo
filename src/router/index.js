import { rootPath, rootView, subView } from '@/composables/useWrapperSwipeBackVariables';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '',
      component: () => import('@/components/WrapperSwipeBack.vue'),
      meta: {
        rootRouteName: 'home',
      },
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/home/HomeRoot.vue'),
        },
        {
          path: 'sub-view',
          name: 'homeSub',
          component: () => import('@/views/home/HomeSub.vue'),
        },
        {
          path: 'other-sub-view',
          name: 'homeSub1',
          component: () => import('@/views/home/HomeSub1.vue'),
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
        rootRouteName: 'profileMenu',
      },
      children: [
        {
          path: '',
          name: 'profileMenu',
          component: () => import('@/views/profile/ProfileMenu.vue'),
        },

        {
          path: 'settings',
          name: 'settings',
          component: () => import('@/components/WrapperSwipeBack.vue'),
          meta: {
            rootRouteName: 'profileSettingsMenu',
          },
          children: [
            {
              path: '',
              name: 'profileSettingsMenu',
              component: () => import('@/views/profile/settings/SettingsMenu.vue'),
            },
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
          name: 'public',
          component: () => import('@/components/WrapperSwipeBack.vue'),
          meta: {
            rootRouteName: 'profilePublicDetails',
          },
          children: [
            {
              path: '',
              name: 'profilePublicDetails',
              component: () => import('@/views/profile/public/PublicDetails.vue'),
            },
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
});

router.beforeResolve(async (to, from, next) => {
  const matched = to.matched;

  if (matched.length === 1) {
    return next();
  }

  let newRootRouteName = null;
  for (let i = matched.length - 1; i >= 0; i--) {
    if (matched[i].meta.rootRouteName) {
      newRootRouteName = matched[i].meta.rootRouteName;
      break;
    }
  }

  const newRootPath = router.getRoutes().find((route) => route.name === newRootRouteName);
  const sub = matched.at(-1);

  if (to.name !== newRootPath.name) {
    setSubView(sub);
  }
  setRootView(newRootPath);

  rootPath.value = newRootPath;

  next();
});

async function setSubView(path) {
  console.log('setSubView', path);

  const subComponentDefinition = path.components.default;

  const subComponent = typeof subComponentDefinition === 'function' ? await subComponentDefinition() : subComponentDefinition;

  subView.value = subComponent.default || subComponent;
}

async function setRootView(path) {
  console.log('1) setRootView', path);
  const rootComponentDefinition = path.components.default;
  console.log('2) rootComponentDefinition', rootComponentDefinition);

  const isFunction = typeof rootComponentDefinition === 'function';
  console.log('isFunction', isFunction);

  const rootComponent = isFunction ? await rootComponentDefinition() : rootComponentDefinition;
  console.log('3) rootComponent', rootComponent);

  rootView.value = rootComponent.default || rootComponent;
}

export { router };
