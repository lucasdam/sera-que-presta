import 'font-awesome/css/font-awesome.css'
import Vue from 'vue'

import App from './App'

import './config/bootstrap'
import './config/msgs'
import './config/axios'
import './config/mq'
import store from './config/store'
import router from './config/router'

Vue.config.productionTip = false

// Token incorporado para qualquer requisição que o axios fizer
// TEMPORARIO!
// require('axios').defaults.headers.common['Authorization'] = 'bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MywibmFtZSI6Ikx1Y2FzIERhbWFzY2VubyIsImVtYWlsIjoibHVjYXNkYW1hc2Nlbm9AZ21haWwuY29tIiwiYWRtaW4iOiJ0cnVlIiwiaWF0IjoxNTg3MTM2NzE1LCJleHAiOjE1ODczOTU5MTV9.FNHdeia2LKwNBbPMKQhH-c8fMeOsLliK2qkMtzBpn6U'

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')