<template>
  <form class="validate-form-container">
    <slot name="default"></slot>
    <div class="submit-area" @click.prevent="submitForm">
      <slot name="submit">
        <button type="submit" class="btn btn-primary">提交</button>
      </slot>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, onUnmounted } from 'vue'
import mitt from 'mitt'

type ValidateFunc = () => boolean
type ClearFunc = () => void
type Events = {
  'form-item-created': ValidateFunc
  'form-input-clear': ClearFunc
}
export const emitter = mitt<Events>()
export default defineComponent({
  name: 'ValidateForm',
  emits: ['form-submit'],
  setup (props, context) {
    let funcArr: ValidateFunc[] = []
    let clearFuncArr: ClearFunc[] = []
    const submitForm = () => {
      const result = funcArr.map(func => func()).every(result => result)
      clearFuncArr.map(func => func())
      context.emit('form-submit', result)
    }
    const callback = (func: ValidateFunc) => {
      funcArr.push(func)
    }
    const clearCallback = (func: ClearFunc) => {
      clearFuncArr.push(func)
    }
    emitter.on('form-item-created', callback)
    emitter.on('form-input-clear', clearCallback)
    onUnmounted(() => {
      emitter.off('form-item-created', callback)
      funcArr = []
      emitter.off('form-input-clear', clearCallback)
      clearFuncArr = []
    })
    return {
      submitForm
    }
  }
})
</script>
