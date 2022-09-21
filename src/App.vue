<template>
  <div class='container'>
    <global-header :user="user"></global-header>
    <loader v-if="isLoading"></loader>
    <router-view></router-view>
    <global-footer></global-footer>
  </div>
</template>

<script lang='ts'>
import { defineComponent, computed, onMounted } from 'vue'
import { useStore } from 'vuex'

import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios'

import { GlobalDataProps } from './store'
import GlobalHeader from './components/GlobalHeader.vue'
import GlobalFooter from './components/GlobalFooter.vue'
import Loader from './components/Loader.vue'

export default defineComponent({
  name: 'App',
  components: {
    GlobalHeader,
    GlobalFooter,
    Loader
  },
  setup () {
    const store = useStore<GlobalDataProps>()
    const currentUser = computed(() => store.state.user)
    const isLoading = computed(() => store.state.loading)
    const token = computed(() => store.state.token)
    onMounted(() => {
      if (!currentUser.value.isLogin && token.value) {
        axios.defaults.headers.common.Authorization = `Bearer ${token.value}`
        store.dispatch('fetchCurrentUser')
      }
    })

    return {
      user: currentUser,
      isLoading
    }
  }
})
</script>
