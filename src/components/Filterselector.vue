<template>
  <div
    class="stateFilter"
    :class="{
      'stateFilter--noTextMenu': !sideMenu,
      'stateFilter--scrolling': scrolling,
    }"
  >
    <div class="stateFilter__select">
      <i class="fas fa-filter stateFilter__icon"></i>
      <select name="iouStatus" v-model="filterStatus" @change="filterResult">
        <slot />
      </select>
    </div>
  </div>
</template>

<script>
import { computed, ref, onBeforeMount, onUnmounted } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const filterStatus = ref("all");
    const sideMenu = computed(() => {
      return store.state.app.showSideMenu;
    });
    const scrolling = computed(() => {
      return store.state.scrolling;
    });

    const filterResult = () => {
      const value = filterStatus.value.toLowerCase();
      return store.commit("app/setFilterValue", value, {
        root: true,
      });
    };

    onBeforeMount(() => {
      const stateValue = store.state.app.filterValue;
      if (stateValue !== "all") {
        return (filterStatus.value = stateValue);
      }
    });

    onUnmounted(() => {
      store.commit("app/setFilterValue", "", { root: true });
    });

    return { filterStatus, sideMenu, scrolling, filterResult };
  },
};
</script>

<style lang="scss">
.stateFilter {
  @include fixed-object;
  top: $grid-gap;
  left: calc(#{$navbar-meun-left-width} + #{$grid-gap}* 3 + 300px);
  z-index: $layer-lv5;
  width: 200px;
  border-radius: $border-radius;
  transition: $transition-fast;

  &--noTextMenu {
    left: calc(#{$grid-width} + #{$grid-gap}* 3 + 300px);
    transition: $transition-fast;
  }

  &--scrolling {
    box-shadow: $box-shadow;
  }

  @include breakpoint-lg {
    position: relative;
    top: 0;
    left: 0;
    z-index: 0;
    width: 100%;
    margin-bottom: $grid-gap;
  }

  &__icon {
    position: absolute;
    bottom: 50%;
    transform: translateY(50%);
    left: 0.8em;
    color: $color-input-icon;
  }

  &__select {
    position: relative;
    background-color: $color-white;
    border-radius: $border-radius;

    select {
      padding: 0 0 0 2.5rem;
      border: 0;
      font-size: $font-size-light;

      option {
        font-weight: $font-weight-medium;
      }
    }
  }
}
</style>