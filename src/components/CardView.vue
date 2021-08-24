<template>
  <div class="card">
    <div class="card__noResult" v-if="cardData.length == 0">查無資料</div>
    <ul class="card__list" v-else>
      <li
        class="card__list__item"
        v-for="(item, index) in cardData"
        :key="index"
      >
        <slot name="cardData" :item="item" />
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    cardData: {
      type: Array,
      required: true,
    },
  },
};
</script>