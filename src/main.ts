import { createApp } from 'vue'

import axios from 'axios'
import store from './store'
import router from './router'

import App from './App.vue'

axios.defaults.baseURL = 'http://apis.imooc.com/api'
axios.interceptors.request.use(config => {
  config.params = { ...config.params, icode: 'A2D7D59EB2DF04B2' }
  return config
})
axios.get('/columns', { params: { key: 'hello' } }).then(resp => {
  console.log(resp.data)
})
const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')
