import Vue from 'vue'
import { Subject } from 'rxjs'

Vue.prototype.$subject = (function () {
  const listeners$: any = {}
  return {
    $on: (name: string, callback: Function) => {
      listeners$[name] = new Subject().subscribe((params) => {
        callback(params)
      })
    },
    $emit: (name: string, callback: Function) => {
      Vue.prototype.$nextTick(() => {
        if (!listeners$[name])
          console.error(
            `Cannot find "${name}" in listeners$, callback: ${callback}`
          )

        listeners$[name]?.next(callback)
      })
    },
    $off: (name: string) => listeners$[name]?.unsubscribe(),
    listeners$,
  }
})()
