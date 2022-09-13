<template>
  <div class="searchbar" :class="{
    'searchbar--noTextMenu': !sideMenu,
    'searchbar--scrolling': scrolling,
  }">
    <div class="searchbar__input">
      <i class="fas fa-search searchbar__input__icon"></i>
      <input type="search" name="search" :placeholder="placeholder" v-model="searchFilter" @input="setKeyword" />
    </div>
  </div>
</template>

<script>
import { computed, ref, onUnmounted } from "vue";
import { useStore } from "vuex";

export default {
  props: {
    placeholder: {
      type: String,
      default: '',
    },
  },
  setup() {
    const store = useStore();
    const searchFilter = ref("");
    const sideMenu = computed(() => {
      return store.state.app.showSideMenu;
    });
    const scrolling = computed(() => {
      return store.state.scrolling;
    });

    const setKeyword = () => {
      const keyword = searchFilter.value.toLowerCase();
      return store.commit("app/setSearchKeyword", keyword, {
        root: true,
      });
    };

    onUnmounted(() => {
      store.commit("app/setSearchKeyword", "", { root: true });
    });

    return { searchFilter, sideMenu, scrolling, setKeyword };
  },
};
</script>

<style lang="scss">
.searchbar {
  @include fixed-object;
  top: $grid-gap;
  left: calc(#{$navbar-meun-left-width} + #{$grid-gap}* 2);
  z-index: $layer-lv5;
  width: 300px;
  border-radius: $border-radius;
  transition: $transition-fast;

  &--noTextMenu {
    left: calc(#{$grid-width} + #{$grid-gap}* 2);
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

  &__input {
    position: relative;
    background-color: $color-white;
    border-radius: $border-radius;

    &__icon {
      position: absolute;
      bottom: 50%;
      transform: translateY(50%);
      left: 0.8em;
      color: $color-input-icon;
    }

    input {
      padding: 0 1.5rem 0 2.5rem;
      border: 0;
    }
  }
}
</style>