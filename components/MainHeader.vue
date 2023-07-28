<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'MainHeader',
})
</script>

<template>
  <section class="header-wrapper">
    <b-navbar toggleable="lg" type="dark">
      <b-navbar-brand href="#">IP Blocker</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item href="#">Link</b-nav-item>
          <b-nav-item href="#" disabled>Disabled</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <!-- <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown text="Lang" right>
            <b-dropdown-item href="#">EN</b-dropdown-item>
            <b-dropdown-item href="#">ES</b-dropdown-item>
            <b-dropdown-item href="#">RU</b-dropdown-item>
            <b-dropdown-item href="#">FA</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav> -->
      </b-collapse>
    </b-navbar>
  </section>
</template>

<style lang="scss">
.header-wrapper {
  height: 50px;
  width: 100%;
  background: #779fa5;
  position: fixed;
  z-index: 1000;
}
</style>
