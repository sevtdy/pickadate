import datepicker from './components/datepicker.vue'
import hello from './components/hello.vue'
import pickeddate from './components/pickeddate.vue'

export default [
  { path: '/hello', component: hello },
  { path: '/', component: datepicker },
  { path: '*', component: pickeddate }
]