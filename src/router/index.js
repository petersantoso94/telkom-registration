import Vue from 'vue';
import Router from 'vue-router';
import Vuex from 'vuex';
import Cookies from "js-cookie";

Vue.use(Router);
Vue.use(Vuex);
const routes = [{
    path: '/',
    name: 'registration',
    component: () => import('@/views/Registration.vue'),
}, {
    path: '/Login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
}, {
    path: '/Admin',
    name: 'admin',
    component: () => import('@/views/Admin.vue'),
}];
const router = new Router({
    mode: 'history',
    routes,
});

router.beforeEach((to, from, next) => {
    if (to.name === 'login' && !!Cookies.get('token')) {
        router.push({
            name: "admin"
        });
    }
    if (to.name === 'admin' && !Cookies.get('token')) {
        router.push({
            name: "login"
        });
    }
    next();
});

export default router;