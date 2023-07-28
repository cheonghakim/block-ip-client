<script lang="ts">
import Vue, { Ref, onBeforeUnmount, ref, toRefs, watch } from 'vue'

export default Vue.extend({
  props: {
    initData: {
      type: String,
      default: '',
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '비밀번호',
    },
    isInvalid: {
      type: Boolean,
      default: false,
    },
    maxlength: {
      type: String,
      default: '32',
    },
  },
  setup(props, context) {
    const { initData } = toRefs(props)

    const password: Ref<string> = ref('')
    const showStr: Ref<boolean> = ref(false)

    const stopWatching1 = watch(
      () => initData.value,
      (val) => {
        password.value = val
      },
      { immediate: true }
    )

    onBeforeUnmount(() => {
      stopWatching1()
    })

    const changePassword = () => {
      context.emit('updatePassword', password.value)
    }
    const changeShowStr = () => {
      showStr.value = !showStr.value
    }
    const onKeydown = (evt: KeyboardEvent) => {
      context.emit('onKeydown', evt)
    }
    const onEnter = (evt: KeyboardEvent) => {
      context.emit('onEnter', evt)
    }

    return {
      password,
      showStr,
      changePassword,
      changeShowStr,
      onKeydown,
      onEnter,
    }
  },
})
</script>

<template>
  <div>
    <div v-if="!showStr" class="parent-btn">
      <input
        v-model="password"
        type="password"
        class="form-control"
        :placeholder="placeholder"
        :readonly="readOnly"
        :class="{
          'is-invalid': isInvalid,
        }"
        :maxlength="maxlength"
        @input="changePassword"
        @keydown.enter="onEnter"
        @keydown="onKeydown"
      />

      <div class="child-btn btn" @click.stop="changeShowStr">
        <i class="mdi mdi-eye"></i>
      </div>
    </div>

    <div v-else class="parent-btn">
      <input
        v-model="password"
        autocomplete="off"
        type="text"
        class="form-control"
        :placeholder="placeholder"
        :readonly="readOnly"
        :class="{
          'is-invalid': isInvalid,
        }"
        :maxlength="maxlength"
        @input="changePassword"
        @keydown.enter="onEnter"
        @keydown="onKeydown"
      />
      <div class="child-btn btn" @click.stop="changeShowStr">
        <i class="mdi mdi-eye-off text-danger"></i>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.parent-btn {
  position: relative !important;
}
.child-btn {
  position: absolute !important;
  right: 0px;
  top: 0px;
}
</style>
