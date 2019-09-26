// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import 'normalize.css/normalize.css'; // A modern alternative to CSS resets
import 'element-ui/lib/theme-chalk/index.css';
import 'vuejs-dialog/dist/vuejs-dialog.min.css';
import 'vuejs-dialog/dist/vuejs-dialog-mixin.min.js';
import '@/util/prototypes.js';
import '@/config/config';
import '@/styles/index.css'; // global css
import Vue from 'vue';
import './registerServiceWorker';
import vuetify from './plugins/vuetify';
import VueNotification from 'vue-notification'
import veeValidate from 'vee-validate';
import Toasted from 'vue-toasted';
import VuejsDialog from 'vuejs-dialog';
import moment from 'moment';
import ElementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/pt-br';
import store from '@/store/index';
import App from '@/App';
import router from '@/router';
import money from 'v-money';
import VueTheMask from 'vue-the-mask'


    
if (process.env.NODE_ENV === 'development') {
  console.log(' Vuex.Store.modules: ', store)
}

moment.locale('pt-br')
Vue.prototype.moment = moment

Vue.use(veeValidate)
Vue.use(ElementUI, { locale })
Vue.use(Toasted);
Vue.use(VueNotification);
Vue.use(VuejsDialog, {
  html: true,
  reverse: true,
  okText: 'OK',
  cancelText: 'Cancelar',
  animation: 'fade',
});
Vue.use(money, {
  precision: 2,
  decimal: ',',
  thousands: '.',
  prefix: 'R$ '
})
Vue.use(VueTheMask)

Vue.config.productionTip = false
store.dispatch('app/setStartingApp', true, { root: true })

/* eslint-disable no-new */
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
  created () {
    this.$store.dispatch('app/initialize', this.$router.options.routes, { root: true })
  }
}).$mount('#app')
