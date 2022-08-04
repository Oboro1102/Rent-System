<template>
  <footer class="footer">
    &copy;&nbsp;2021&nbsp;<span v-if="currentYear !== 2021" v-text="`&nbsp&nbsp;${ crentYear }`" />Design &
    Coding by
    ツキノリュウ.
  </footer>
</template>

<script>
import { computed } from "vue";

export default {
  setup() {
    const currentYear = computed(() => {
      return new Date().getFullYear();
    });
    return { currentYear };
  },
};
</script>

<style lang="scss" scoped>
.footer {
  width: 100%;
  height: $footer-height;
  line-height: $footer-height;
  padding: 0 $grid-gap;
  text-align: right;
  color: $color-gray-deep;
  font-size: $font-size-thin;

  @include breakpoint-lg {
    height: auto;
    padding: 0.75rem $grid-gap;
    line-height: 1.5;
    text-align: center;
  }
}
</style>