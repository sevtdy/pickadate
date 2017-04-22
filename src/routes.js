import datepicker from './components/datepicker.vue'
import hello from './components/hello.vue'
import showdate from './components/showdate.vue'
import errorpage from './components/errorpage.vue'

export default [
  { path: '/', component: hello },
  { path: '/create', component: datepicker },
  { path: '/error', component: errorpage },
  { path: '*', component: showdate }
]