<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white text-grey-10 q-pa-xs" bordered>
      <q-toolbar class="constrain">
        <q-btn
          flat
          round
          color="primary"
          size="1.8rem"
          class="gt-xs text-grey-10 q-mr-sm"
          icon="eva-camera-outline"
          dense
          to="/camera"
        />

        <q-separator vertical inset spaced class="gt-xs" />
        <q-toolbar-title class="text-grand-hotel text-weight-bold">
          Quasargram
        </q-toolbar-title>
        <q-btn
          flat
          round
          color="primary"
          size="1.8rem"
          class="gt-xs text-grey-10"
          icon="eva-home-outline"
          dense
          to="/"
        />
      </q-toolbar>
    </q-header>

    <q-page-container class="bg-grey-1">
      <router-view />
    </q-page-container>

    <q-footer class="bg-white lt-sm" bordered>
      <q-tabs
        class="text-grey-10"
        active-color="primary"
        indicator-color="transparent"
      >
        <q-route-tab to="/" icon="eva-home-outline" />
        <q-route-tab to="/camera" icon="eva-camera-outline" />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script>
export default {
  name: 'MainLayout',
  components: {},
  data() {
    return {
      leftDrawerOpen: false
    };
  }
};
</script>

<style lang="scss">
// .q-toolbar {
//   @media (min-width: $breakpoint-sm-min) {
//     height: 7rem;
//   }
// }

.q-toolbar__title {
  font-size: 30px;

  @media (max-width: $breakpoint-xs-max) {
    text-align: center;
  }
}

.q-footer {
  .q-tab__icon {
    width: 30px;
    height: 30px;
    font-size: 30px;
  }
}
</style>
