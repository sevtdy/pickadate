import Vue from 'vue'
import VueRouter from 'vue-router'
import wildDog from 'wilddog'
import App from './App.vue'


import routes from './routes.js'
Vue.use(VueRouter)
const router = new VueRouter({
  routes // （缩写）相当于 routes: routes
})

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
// new Vue({
//   router,
//   render: h => h(App)
// }).$mount('#app')
