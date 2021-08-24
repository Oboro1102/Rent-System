<template>
  <div class="popNotification">
    <ul class="popNotification__wrap">
      <li
        v-for="(item, index) in panelState.filter((item) => item.count > 0)"
        :key="index"
      >
        {{ item.title }}
        <span class="popNotification__tag">{{ item.count }}</span
        >筆
      </li>
    </ul>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const panelState = computed(() => {
      return store.state.app.panelData;
    });
    return { panelState };
  },
};
</script>

<style lang="scss">
.popNotification {
  position: absolute;
  top: 150%;
  left: -6vw;
  z-index: $layer-lv3;
  min-width: 200px;
  padding: 1rem 1.5rem;
  background-color: $color-pop-bg;
  border-radius: $border-radius;
  box-shadow: $box-shadow;
  transition: $transition-fast;

  @include breakpoint-lg {
    top: 175%;
    left: -10vw;
  }

  @include breakpoint-sm {
    left: -20vw;
  }

  &__wrap {
    padding-left: 1.25em;
    margin: 0;
    font-size: $font-size-light;
    text-align: left;
    list-style-type: disc;

    li {
      margin-top: 0.5rem;

      &:first-child {
        margin-top: 0;
      }
    }
  }

  &__tag {
    display: inline-block;
    margin: 0 0.5em;
    padding: 0.35em 0.75em;
    color: $color-white;
    background-color: $color-red;
    border-radius: $border-radius;
    text-align: center;
    font-size: $font-size-thin;
    font-weight: $font-weight-bold;
    line-height: 1.25;
  }
}
</style>