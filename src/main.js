import Vue from 'vue'
import App from './App.vue'
import router from '@/router/index';
import 'bootstrap/dist/css/bootstrap.min.css';
import vuetify from './plugins/vuetify';
import VueSignaturePad from 'vue-signature-pad';

Vue.config.productionTip = false
Vue.use(VueSignaturePad);

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')