import Vue from 'vue'
import VueRouter from 'vue-router'
import wildDog from 'wilddog'
import App from './App.vue'


import routes from './routes.js'
Vue.use(VueRouter)
const router = new VueRouter({
  //  mode: 'history',
  routes // ES6缩写语法，相当于routes:routes
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
