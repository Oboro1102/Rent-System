<template>
  <div class="modal">
    <div class="modal__wrap">
      <h1 class="modal__wrap__header">租借紀錄</h1>
      <div class="modal__wrap__content">
        <ul class="modal__wrap__list">
          <li
            class="modal__wrap__list__item"
            v-for="item in data"
            :key="item.sn"
          >
            <h6 class="modal__wrap__list__item__title">
              <span>
                {{ item.sn }}
                <span class="modal__wrap__list__item__title__time">
                  <i class="fas fa-calendar-check"></i> {{ item.created }}
                </span>
              </span>
              <span
                class="modal__wrap__list__item__title__tag bgColor--green"
                v-if="item.status === 0"
              >
                承租中
              </span>
              <span
                class="modal__wrap__list__item__title__tag bgColor--orange"
                v-if="item.status === 1"
              >
                已歸還
              </span>
              <span
                class="modal__wrap__list__item__title__tag bgColor--red"
                v-if="item.status === 2"
              >
                逾期
              </span>
            </h6>
            <div class="modal__wrap__list__item__info">
              <h6 class="modal__wrap__list__item__info__title">
                <i class="fas fa-box"></i> 承租物
              </h6>
              <ul class="modal__wrap__list__item__info__list">
                <li
                  class="modal__wrap__list__item__info__list__item"
                  v-for="(item, index) in item.purchase"
                  :key="index"
                >
                  <img
                    :src="item.goods.pic"
                    :alt="item.goods.title"
                    style="max-width: 100px; margin-right: 1em"
                  />
                  {{ item.goods.title }} x {{ item.qty }}
                  <small style="margin-left: 1em">NT$</small>
                  {{ commaFormat(item.goods.price) }}
                </li>
              </ul>
            </div>
            <div class="modal__wrap__list__item__info">
              <h6 class="modal__wrap__list__item__info__title">
                <i class="fas fa-coins"></i> 費用
              </h6>
              <div>
                <span>
                  總額
                  <small style="margin-left: 1em">NT$</small>
                  {{ commaFormat(totalPrice(item.purchase)) }}
                </span>
              </div>
              <div>
                <span>
                  押金
                  <small style="margin-left: 1em">NT$</small>
                  {{
                    commaFormat(
                      Math.round((totalPrice(item.purchase) * 10) / 100)
                    )
                  }}
                </span>
              </div>
            </div>
            <div class="modal__wrap__list__item__info">
              <h6 class="modal__wrap__list__item__info__title">
                <i class="fas fa-reply-all"></i> 租期 (迄)
              </h6>
              {{ item.returnDate }}
            </div>
            <div class="modal__wrap__list__item__info" v-if="item.notes">
              <h6 class="modal__wrap__list__item__info__title">
                <i class="fas fa-sticky-note"></i> 備註
              </h6>
              {{ item.notes }}
            </div>
          </li>
        </ul>
        <button type="button" class="button button--close" @click="endView">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";

export default {
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
  setup() {
    const store = useStore();

    const endView = () => {
      return store.commit("member/showIouView", false, { root: true });
    };
    const commaFormat = (value) => {
      return Number(value).toLocaleString("zh-TW");
    };
    const totalPrice = (item) => {
      let totalPrice = 0;
      for (let index = 0; index < item.length; index++) {
        const element = item[index];
        totalPrice += element.goods.price * element.qty;
      }
      return totalPrice;
    };

    return { endView, commaFormat, totalPrice };
  },
};
</script>