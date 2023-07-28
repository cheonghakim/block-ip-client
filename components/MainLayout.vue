<script lang="ts">
import Vue from 'vue'
import MainHeader from '~/components/MainHeader.vue'
import MainFooter from '~/components/MainFooter.vue'

export default Vue.extend({
  components: { MainHeader, MainFooter },
  name: 'MainLayout',
})
</script>

<template>
  <section class="layout-wrapper d-flex flex-column">
    <MainHeader />

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
