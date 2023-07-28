<script>
import Vue from 'vue'
import { ref, onBeforeUnmount, onMounted } from '@nuxtjs/composition-api'
import { Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'
import Utils from '@/static/utils'

export default {
  name: 'EventMessage',
  setup() {
    const success$ = new Subject()
    const warning$ = new Subject()
    const msg$ = new Subject()
    const error$ = new Subject()

    msg$.pipe(debounceTime(300)).subscribe(() => {
      const set = new Set(msgList.value)
      for (const message of set) {
        Vue.prototype.$notify({
          group: 'eventMessage',
          title: '시스템 메세지',
          duration: 10000,
          text: message,
          data: { link: '', variant: 'info' },
          closeOnClick: true,
          type: 'info',
        })
      }
      msgList.value = []
    })

    error$.pipe(debounceTime(300)).subscribe(() => {
      const set = new Set(errorList.value?.message)
      for (const message of set) {
        Vue.prototype.$notify({
          group: 'eventMessage',
          title: '에러 메세지',
          duration: 10000,
          text: message,
          data: { link: '', variant: 'danger' },
          closeOnClick: true,
          type: 'danger',
        })
        console.error(message) // 에러 메세지 확인하려고 넣어둠 => 프로덕션에서 삭제
      }

      errorList.value = []
    })

    success$.pipe(debounceTime(300)).subscribe(() => {
      const set = new Set(successList.value)
      for (const message of set) {
        Vue.prototype.$notify({
          group: 'eventMessage',
          title: '성공 메세지',
          duration: 10000,
          text: message,
          data: { link: '', variant: 'success' },
          closeOnClick: true,
        })
      }
      successList.value = []
    })

    warning$.pipe(debounceTime(300)).subscribe(() => {
      const set = new Set(warningList.value)
      for (const message of set) {
        Vue.prototype.$notify({
          group: 'eventMessage',
          title: '경고 메세지',
          duration: 10000,
          text: message,
          data: { link: '', variant: 'warning' },
          closeOnClick: true,
        })
      }
      warningList.value = []
    })

    const msgList = ref([])
    const errorList = ref([])
    const successList = ref([])
    const warningList = ref([])

    // 메세지 이벤트 정의
    const messageCallback = (message) => {
      if (Utils.isEmpty(message)) return
      msgList.value.push(message)
      msg$.next()
    }
    const errorCallback = (message) => {
      if (Utils.isEmpty(message)) return
      errorList.value.push(message)
      error$.next()
    }
    const successCallback = (message) => {
      if (Utils.isEmpty(message)) return

      successList.value.push(message)
      success$.next()
    }
    const warningCallback = (message) => {
      if (Utils.isEmpty(message)) return
      warningList.value.push(message)
      warning$.next()
    }

    onMounted(() => {
      // 이벤트 리스너 등록
      Vue.prototype.$subject.$on('info', messageCallback)
      Vue.prototype.$subject.$on('error', errorCallback)
      Vue.prototype.$subject.$on('success', successCallback)
      Vue.prototype.$subject.$on('warning', warningCallback)
    })

    // 마운트 해제시 이벤트 리스너 해제
    onBeforeUnmount(() => {
      msg$?.unsubscribe()
      error$?.unsubscribe()
      success$?.unsubscribe()
      warning$?.unsubscribe()

      Vue.prototype.$subject.$off('info', messageCallback)
      Vue.prototype.$subject.$off('error', errorCallback)
      Vue.prototype.$subject.$off('success', successCallback)
      Vue.prototype.$subject.$off('warning', warningCallback)
    })

    return {
      messageCallback,
      errorCallback,
      successCallback,
      warningCallback,
      sanitizeHTML: Utils.sanitizeHTML,
    }
  },
}
</script>

<template>
  <client-only>
    <notifications :group="'eventMessage'" :position="'top center'">
      <template slot="body" slot-scope="{ item, close }">
        <div
          class="event-message-custom"
          :class="{
            success: item.data.variant === 'success',
            danger: item.data.variant === 'danger',
            warning: item.data.variant === 'warning',
            info: item.data.variant === 'info',
          }"
        >
          <div class="">
            <header
              class="toast-header toast-custom-header"
              :class="{
                success: item.data.variant === 'success',
                danger: item.data.variant === 'danger',
                warning: item.data.variant === 'warning',
                info: item.data.variant === 'info',
              }"
            >
              <div class="d-flex flex-grow-1 align-items-baseline">
                <strong class="mr-auto">
                  {{ item.title }}
                </strong>
              </div>
              <button
                type="button"
                aria-label="Close"
                class="close ml-auto"
                style="
                  border: transparent;
                  background: transparent;
                  margin: 0px;
                  font-size: 20px;
                "
                @click="close"
              >
                ×
              </button>
            </header>
            <div class="toast-body toast-custom-body">
              <!-- <div class="vhtml" v-html="sanitizeHTML(item.text)" /> -->
              {{ item.text }}
            </div>
          </div>
        </div>
      </template>
    </notifications>
  </client-only>
</template>

<style lang="scss">
.vue-notification-group {
  z-index: 9999 !important;
  width: 100% !important;
}
.event-message-custom {
  width: 400px;
  margin: 0.5rem;
  border-radius: 5px;

  .toast-custom-header {
    padding: 0.5rem;
    border-top-left-radius: 0.3rem;
    border-top-right-radius: 0.3rem;

    &.success {
      background: #ade5d1;
      color: #3e846b;
    }
    &.warning {
      background: #fbd499;
      color: #856404;
    }
    &.danger {
      background: #fac1c1;
      color: #bd5252;
    }
    &.info {
      background: #b0d9fc;
      color: #427aab;
    }
  }
  .toast-custom-body {
    padding: 0.8rem;
    border-bottom-left-radius: 0.3rem;
    border-bottom-right-radius: 0.3rem;
  }

  &.success {
    background: #ccf0e3;
    color: #3e846b;
  }
  &.warning {
    background: #fce0b5;
    color: #856404;
  }
  &.danger {
    background: #fde1e1;
    color: #bd5252;
  }
  &.info {
    background: #c6e4ff;
    color: #427aab;
  }
}
</style>
