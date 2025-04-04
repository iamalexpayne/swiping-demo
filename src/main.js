import './assets/base.css';

import { createApp } from 'vue';
import Vue3TouchEvents from 'vue3-touch-events';
import App from './App.vue';
import { router } from './router';

const app = createApp(App);
app.use(router);
app.use(Vue3TouchEvents);
app.mount('#app');
