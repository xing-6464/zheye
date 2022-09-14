<template>
  <div class='container'>
    <global-header :user="user"></global-header>
    <router-view></router-view>
    <global-footer></global-footer>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'

import 'bootstrap/dist/css/bootstrap.min.css'

import GlobalHeader, { UserProps } from './components/GlobalHeader.vue'
import GlobalFooter from './components/GlobalFooter.vue'

const testUser: UserProps = {
  isLogin: false,
  name: 'xing',
  id: '1'
}

export default defineComponent({
  name: 'App',
  components: {
    GlobalHeader,
    GlobalFooter
    // Login
  },
  setup () {
    return {
      user: testUser
    }
  }
})
</script>
