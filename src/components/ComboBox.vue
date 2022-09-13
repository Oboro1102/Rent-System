<template>
  <transition name="slideDown" mode="out-in" appear>
    <div class="combobox" role="combobox" v-if="using">
      <input type="search" name="search" :placeholder="placeholder" v-model="keyword" @input="searchItem"
        @focus="searchItem" @blur="closeDropdowns" />
      <div class="combobox__dropdowns">
        <div class="combobox__dropdowns__item combobox__dropdowns__item--center" v-if="searchResult.length === 0">
          查無資料
        </div>
        <div class="combobox__dropdowns__item" v-for="item in searchResult" :key="item.id"
          @click="passSelectValue(item)" v-else>
          <slot name="dropdowns" :item="item" />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { ref, onBeforeMount } from "vue";

export default {
  props: {
    dropdownsData: {
      type: Array,
      default: () => [],
    },
    placeholder: {
      type: String,
      default: '',
    },
    searchBy: {
      type: String,
      default: '',
    },
  },
  emits: ["selectedValue"],
  setup(props, { emit }) {
    const using = ref(false);
    const searchResult = ref([]);
    const keyword = ref("");

    const searchItem = () => {
      const keywords = keyword.value.toLowerCase().trim();
      const search = props.dropdownsData.filter((item) => {
        return item[props.searchBy].toLowerCase().includes(keywords);
      });

      using.value = true;

      if (keyword.value.length < 1) {
        return (searchResult.value = props.dropdownsData);
      } else {
        return (searchResult.value = search);
      }
    };
    const closeDropdowns = () => {
      setTimeout(() => {
        using.value = false;
        keyword.value = "";
      }, 50);
    };

    const passSelectValue = (item) => {
      emit("selectedValue", item);
      closeDropdowns();
    };

    onBeforeMount(() => {
      searchResult.value = props.dropdownsData;
    });

    return {
      using,
      searchResult,
      keyword,
      searchItem,
      closeDropdowns,
      passSelectValue,
    };
  },
};
</script>

<style lang="scss">
.combobox {
  width: 100%;
  margin-top: calc(#{$grid-gap}/ 2);
  padding: 0 calc(#{$grid-gap}/ 2) calc(#{$grid-gap}/ 2);
  border: $border-input;
  border-radius: $border-radius;

  &__dropdowns {
    max-height: 300px;
    overflow-y: auto;

    &__item {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      color: $color-input-placeholder;
      padding: calc(#{$grid-gap}/ 2) 0;
      border-top: 1px solid $color-gray-thin;
      cursor: pointer;

      &:first-child {
        border-top: none;
      }

      img {
        width: 50px;
        min-width: 50px;
        height: 50px;
        min-height: 50px;
        margin-right: 0.5em;
        border-radius: $border-radius-round;
        overflow: hidden;
      }

      &--center {
        justify-content: center;
      }

      &__tag {
        margin-right: 0.5em;
      }

      &__notice {
        margin-left: auto;
        font-size: $font-size-light;
      }
    }
  }
}
</style>