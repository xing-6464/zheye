<template>
  <div class='container'>
    <global-header :user="user"></global-header>
    <home></home>
    <!-- <login></login> -->
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'

import 'bootstrap/dist/css/bootstrap.min.css'

import GlobalHeader, { UserProps } from './components/GlobalHeader.vue'
import Home from './views/Home.vue'
import Login from './views/Login.vue'

const testUser: UserProps = {
  isLogin: false,
  name: 'xing',
  id: '1'
}

export default defineComponent({
  name: 'App',
  components: {
    GlobalHeader,
    Home
    // Login
  },
  setup () {
    return {
      user: testUser
    }
  }
})
</script>
