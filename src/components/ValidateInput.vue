<template>
  <div class="validate-input-container pb-3">
    <input
      v-if="tag !== 'textarea'"
      class="form-control"
      :class="{ 'is-invalid': inputRef.error }"
      @blur="validateInput"
      v-model="inputRef.val"
      v-bind="$attrs"
    />
    <textarea
      v-else
      class="form-control"
      :class="{ 'is-invalid': inputRef.error }"
      v-model="inputRef.val"
      @blur="validateInput"
      v-bind="$attrs"
    >
    </textarea>
    <span v-if="inputRef.error" class="invalid-feedback">
      {{ inputRef.message }}
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, PropType, onMounted, watch, computed } from 'vue'
import { emitter } from './ValidateForm.vue'

const emailReg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
const emptyReg = /^[^\s]*$/
export interface RuleProp {
  type: 'required' | 'email' | 'range' | 'custom';
  message: string;
  validator?: () => boolean;
  min?: number
  max?: number
}
export type RulesProp = RuleProp[]
export type TagType = 'input' | 'textarea'
export default defineComponent({
  name: 'ValidateInput',
  inheritAttrs: false, // 禁用属性继承
  props: {
    rules: Array as PropType<RulesProp>,
    modelValue: String,
    tag: {
      type: String as PropType<TagType>,
      default: 'input'
    }
  },
  setup (props, context) {
    const inputRef = reactive({
      val: computed({
        get: () => props.modelValue || '',
        set: val => {
          context.emit('updata:modelValue', val)
        }
      }),
      error: false,
      message: ''
    })

    const clearInput = () => {
      inputRef.val = ''
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
            case 'custom':
              passed = rule.validator ? rule.validator() : true
              break
            default:
              break
          }
          return passed
        })
        inputRef.error = !allPassed
        return allPassed
      }
      return true
    }
    onMounted(() => {
      emitter.emit('form-item-created', validateInput)
      emitter.emit('form-input-clear', clearInput)
    })
    return {
      inputRef,
      validateInput
    }
  }
})
</script>
