<template>
  <transition name="slideRight" mode="out-in">
    <div class="button" @click="scrollToTop" v-if="scrolling">
      <i class="fas fa-angle-up"></i>
    </div>
  </transition>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const scrolling = computed(() => {
      return store.state.scrolling;
    });
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

    return { scrolling, scrollToTop };
  },
};
</script>

<style lang="scss" scoped>
.button {
  @include fixed-object;
  bottom: 10vh;
  right: 0;
  z-index: $layer-lv2;
  display: flex;
  width: 3rem;
  height: 3rem;
  padding: 0 $grid-gap;
  font-size: $font-size-bold;
  background-color: $color-pink;
  border: 1px solid $color-red;
  border-radius: $border-radius 0 0 $border-radius;

  &:hover {
    background-color: $color-red;
    border: 1px solid $color-red;
  }
}
</style>