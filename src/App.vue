<template>
  <div class='container'>
    <global-header :user="user"></global-header>
    <loader v-if="isLoading"></loader>
    <router-view></router-view>
    <global-footer></global-footer>
  </div>
</template>

<script lang='ts'>
import { defineComponent, computed, watch } from 'vue'
import { useStore } from 'vuex'

import 'bootstrap/dist/css/bootstrap.min.css'

import { GlobalDataProps } from './store'
import GlobalHeader from './components/GlobalHeader.vue'
import GlobalFooter from './components/GlobalFooter.vue'
import Loader from './components/Loader.vue'
import createMessage from './components/createMessage'

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
    const error = computed(() => store.state.error)

    watch(() => error.value.status, () => {
      const { status, message } = error.value
      if (status && message) {
        createMessage(message, 'error', 1000)
      }
    })
    return {
      user: currentUser,
      isLoading,
      error
    }
  }
})
</script>
