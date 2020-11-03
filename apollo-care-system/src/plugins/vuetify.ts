/* eslint-disable */
// @ts-ignore
import Vue from 'vue';
import Vuetify from 'vuetify/lib';
// import colors from 'vuetify/lib/util/colors';
import 'vuetify/dist/vuetify.min.css'
// import '@mdi/font/css/materialdesignicons.css'
import { preset } from 'vue-cli-plugin-vuetify-preset-fortnightly/preset';
import '@fortawesome/fontawesome-free/css/all.css';

Vue.use(Vuetify);


export default new Vuetify({
  preset,
  icons: {
    iconfont: 'fa',
  },
  options: {
    customProperties: true
  },
  theme: {
    dark: false,
    default: 'light'
  },
  themes: {
    dark: {
      background: '#00a86b'
    },
    light: {
      background: '#EEEEF3'
    }
  }
});
