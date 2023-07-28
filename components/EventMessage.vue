<script>
import { ref, getCurrentInstance, onBeforeUnmount } from 'vue'
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
        proxy.$notify({
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
        proxy.$notify({
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
        proxy.$notify({
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
        proxy.$notify({
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
    const { proxy } = getCurrentInstance()
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

    // 이벤트 리스너 등록록
    proxy.$subject.$on('info', messageCallback)
    proxy.$subject.$on('error', errorCallback)
    proxy.$subject.$on('success', successCallback)
    proxy.$subject.$on('warning', warningCallback)

    // 마운트 해제시 이벤트 리스너 해제
    onBeforeUnmount(() => {
      msg$?.unsubscribe()
      error$?.unsubscribe()
      success$?.unsubscribe()
      warning$?.unsubscribe()

      proxy.$subject.$off('info', messageCallback)
      proxy.$subject.$off('error', errorCallback)
      proxy.$subject.$off('success', successCallback)
      proxy.$subject.$off('warning', warningCallback)
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
              class="close ml-auto font-size-20"
              style="border: transparent; background: transparent; margin: 0px"
              @click="close"
            >
              ×
            </button>
          </header>
          <div class="toast-body toast-custom-body">
            <div v-html="sanitizeHTML(item.text)" class="vhtml" />
          </div>
        </div>
      </div>
    </template>
  </notifications>
</template>

<style lang="scss">
.vue-notification-group {
  z-index: 9999 !important;
}
.event-message-custom {
  width: 400px;
  margin: 0.5rem;
  border-radius: 5px;
  color: #856404;
  .toast-custom-header {
    padding: 0.5rem;
    border-top-left-radius: 0.3rem;
    border-top-right-radius: 0.3rem;
    &.success {
      background: #ade5d1;
    }
    &.warning {
      background: #fbd499;
    }
    &.danger {
      background: #fac1c1;
    }
    &.info {
      background: #b0d9fc;
    }
  }
  .toast-custom-body {
    padding: 0.8rem;
    border-bottom-left-radius: 0.3rem;
    border-bottom-right-radius: 0.3rem;
  }

  &.success {
    background: #ccf0e3;
  }
  &.warning {
    background: #fce0b5;
  }
  &.danger {
    background: #fde1e1;
  }
  &.info {
    background: #c6e4ff;
  }
}
</style>
