<template>
  <div class="loadingScreen" v-if="showLoading">
    <i class="gg-loadbar-alt"></i>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const showLoading = computed(() => {
      return store.state.loadingArea;
    });
    return { showLoading };
  },
};
</script>

<style lang="scss" scoped>
.loadingScreen {
  position: absolute;
  top: 0;
  left: 0;
  z-index: $layer-lv6;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: calc(100vh - #{$grid-gap}* 2 - #{$navbar-height});
  color: $color-main;
  background-color: $color-site-bg;
  transition: $transition-fast;
  opacity: 1;

  @include breakpoint-lg {
    height: calc(100vh - #{$grid-gap} - #{$navbar-height});
  }

  i {
    transform: scale(var(--ggs, 2));
  }
}
</style>