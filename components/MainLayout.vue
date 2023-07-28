<script lang="ts">
import Vue, { onMounted, ref } from 'vue'
import MainHeader from '~/components/MainHeader.vue'
import MainFooter from '~/components/MainFooter.vue'
import CommonHeaderVue from '~/components/CommonHeader.vue'

export default Vue.extend({
  name: 'MainLayout',
  components: { MainHeader, MainFooter, CommonHeaderVue },
  setup() {
    const isUser = ref(false)

    const checkUser = async () => {
      if (process.browser) {
        const userCookie = await window.cookieStore.get('id')
        isUser.value = !!userCookie
      }
    }

    onMounted(async () => {
      await checkUser()
    })

    return {
      isUser,
    }
  },
})
</script>

<template>
  <section class="layout-wrapper d-flex flex-column">
    <MainHeader v-if="isUser" />
    <CommonHeaderVue v-else />

    <div class="slot-wrapper">
      <div class="slot-attr">
        <slot />
      </div>
    </div>
    <MainFooter />
    <EventMessage />
  </section>
</template>

<style lang="scss">
.layout-wrapper {
  height: 50px;
  background: rgb(252, 252, 252);
  height: 100%;

  .slot-wrapper {
    position: relative;
    height: calc(100% - 50px);
    width: 100%;
    .slot-attr {
      position: absolute;
      top: 50px;
      height: inherit;
      width: inherit;
    }
  }
}
</style>
