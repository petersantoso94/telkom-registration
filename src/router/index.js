import Vue from 'vue';
import Router from 'vue-router';
import Vuex from 'vuex';

Vue.use(Router);
Vue.use(Vuex);
const routes = [{
    path: '/Login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
}, ];
const router = new Router({
    mode: 'history',
    routes,
});

router.beforeEach((to, from, next) => {
    next();
});

export default router;