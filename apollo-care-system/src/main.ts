import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import http from './http/axios';
import VueClipboard from 'vue-clipboard2';

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import VueProgressBar from 'vue-progressbar';


Vue.prototype.$http = http;
Vue.prototype.baseURL = process.env.VUE_APP_ROOT_API;

const options = {
  color: 'blue', // '#bffaf3',∂
  failedColor: '#874b4b',
  thickness: '3px',
  transition: {
    speed: '0.1s',
    opacity: '0.3s',
    termination: 300
  },
  autoRevert: true,
  location: 'top',
  inverse: false
};

Vue.config.productionTip = false;

Vue.use(VueProgressBar, options);
Vue.use(VueClipboard)

library.add(fas);
Vue.component('v-awesome-icon', FontAwesomeIcon)
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app');
