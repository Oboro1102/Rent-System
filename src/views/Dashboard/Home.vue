<template>
  <div class="panel">
    <h1 v-if="panelState.filter((item) => item.count > 0).length < 1">
      目前無需處理事項
    </h1>
    <div class="panel__item" v-for="(item, index) in panelState.filter((item) => item.count > 0)" :key="index" v-else>
      <div class="panel__item__icon" :class="item.bgColor">
        <i :class="item.icon"></i>
      </div>
      <div class="panel__item__content">
        <h5 class="panel__item__title" v-text="item.title" />
        <span class="panel__item__content__number" v-text="item.count" />筆
      </div>
    </div>
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

<style lang="scss" scoped>
.panel {
  width: 100%;
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;

  h1 {
    margin: 0 auto;
    color: $color-gray;
  }

  &__item {
    position: relative;
    overflow: hidden;
    z-index: 0;
    width: calc(calc(100% - calc(#{$grid-gap}* 2)) / 3);
    margin: 0 $grid-gap $grid-gap 0;
    padding: $grid-gap;
    color: $color-area-title;
    background-color: $color-area-bg;
    border-radius: $border-radius;

    &:nth-child(3n) {
      margin: 0 0 $grid-gap 0;
    }

    @include breakpoint-lg {
      width: 100%;
      margin: 0 auto $grid-gap;

      &:nth-child(3n) {
        margin: 0 0 $grid-gap 0;
      }

      &:nth-child(2n) {
        margin: 0 0 $grid-gap 0;
      }
    }

    &:last-child {
      margin: 0;
    }

    &__icon {
      position: absolute;
      left: -25px;
      bottom: 50%;
      transform: translateY(50%);
      z-index: $layer-lv0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: calc(125px + 2vw);
      height: calc(125px + 2vw);
      border-radius: $border-radius-round;

      i {
        color: $color-white;
        font-size: 4.5rem;
      }

      &.green {
        background-color: $color-green;
      }

      &.red {
        background-color: $color-red;
      }

      &.pink {
        background-color: $color-pink;
      }

      &.blue {
        background-color: $color-blue;
      }
    }

    &__title {
      margin: 0;
      font-size: $font-size-medium;
      font-weight: $font-weight-medium;
    }

    &__content {
      font-size: $font-size-medium;
      font-weight: $font-weight-medium;
      text-align: right;

      &__number {
        margin-right: 0.5em;
        color: $color-orange;
        font-size: $font-size-black;
        font-weight: $font-weight-black;
      }
    }
  }
}
</style>
