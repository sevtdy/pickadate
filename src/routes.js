import datepicker from './components/datepicker.vue'
import hello from './components/hello.vue'
import pickeddate from './components/pickeddate.vue'

export default [
  { path: '/', component: datepicker },
  { path: '/test', component: pickeddate },
  { path: '*', component: hello }
]