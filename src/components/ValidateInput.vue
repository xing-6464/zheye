<template>
  <div class="validate-input-container pb-3">
    <input
      class="form-control"
      :class="{ 'is-invalid': inputRef.error }"
      :value="inputRef.val"
      @input="updateValue"
      @blur="validateInput"
      v-bind="$attrs"
    >
    <span v-if="inputRef.error" class="invalid-feedback">
      {{ inputRef.message }}
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, PropType } from 'vue'

const emailReg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
const emptyReg = /^[^\s]*$/
export interface RuleProp {
  type: 'required' | 'email' | 'range';
  message: string;
  min?: number
  max?: number
}
export type RulesProp = RuleProp[]
export default defineComponent({
  name: 'ValidateInput',
  inheritAttrs: false, // 禁用属性继承
  props: {
    rules: Array as PropType<RulesProp>,
    modelValue: String
  },
  setup (props, context) {
    const inputRef = reactive({
      val: props.modelValue || '',
      error: false,
      message: ''
    })
    const updateValue = (e: Event) => {
      const targetValue = (e.target as HTMLInputElement).value
      inputRef.val = targetValue
      context.emit('update:modelValue', targetValue)
    }
    const validateInput = () => {
      if (props.rules) {
        const allPassed = props.rules.every(rule => {
          let passed = true
          inputRef.message = rule.message
          switch (rule.type) {
            case 'required':
              passed = (inputRef.val.trim() !== '')
              break
            case 'email':
              passed = emailReg.test(inputRef.val)
              break
            case 'range':
              if (rule.min && !rule.max) {
                passed = rule.min <= inputRef.val.length && emptyReg.test(inputRef.val)
              } else if (rule.max && !rule.min) {
                passed = rule.max >= inputRef.val.length && emptyReg.test(inputRef.val)
              } else if (rule.max && rule.min) {
                passed = (rule.min <= inputRef.val.length) && (inputRef.val.length <= rule.max) && emptyReg.test(inputRef.val)
              }
              break
            default:
              break
          }
          return passed
        })
        inputRef.error = !allPassed
      }
    }
    return {
      inputRef,
      validateInput,
      updateValue
    }
  }
})
</script>