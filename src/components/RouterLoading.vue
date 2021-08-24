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
      return store.state.loadingScreen;
    });
    return { showLoading };
  },
};
</script>

<style lang="scss" scoped>
.loadingScreen {
  @include fixed-object;
  top: 0;
  left: 0;
  z-index: $layer-lv6;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  color: $color-white;
  background-color: $color-black;
  transition: $transition-fast;
  opacity: 1;

  i {
    transform: scale(var(--ggs, 2));
  }
}
</style>