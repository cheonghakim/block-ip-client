<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'MainFooter',
})
</script>

<template>
  <section class="footer-wrapper">
    <div class="d-flex align-items-center">
      <div class="foot-text p-2">
        Copyright 2023 CHEONGHA KIM All Right Reserved.
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.footer-wrapper {
  height: 40px;
  width: 100%;
  background: #f2f2f5;
  color: #74788d;
  position: fixed;
  bottom: 0px;
  z-index: 1000;
  div > .foot-text {
    vertical-align: middle;
  }
}
</style>
