<template>
  <div>
    <Filterselector>
      <option value="0" hidden>請選擇時間</option>
      <optgroup
        :label="item.year + '年'"
        v-for="(item, index) in formatTimeData(balanceTime)"
        :key="index"
      >
        <option :value="item" v-for="(item, index) in item.month" :key="index">
          <span v-if="item >= 10">{{ item.split("-")[1] }}月</span>
          <span v-else>{{ item.split("-")[1].split("")[1] }}月</span>
        </option>
      </optgroup>
    </Filterselector>
    <div class="balance">
      <table class="balance__table">
        <thead>
          <tr>
            <th v-for="(item, index) in tableHead" :key="index">{{ item }}</th>
          </tr>
        </thead>
        <tbody v-if="filterBalance.length == 0">
          <tr class="noResult">
            <td :colspan="tableHead.length">請選擇時間</td>
          </tr>
        </tbody>
        <tbody>
          <tr v-for="(item, index) in filterBalance" :key="index">
            <td>
              <h6>
                {{ item.sn }}
                <small>
                  <i class="fas fa-calendar-check"></i> {{ item.created }}
                </small>
              </h6>
            </td>
            <td style="padding: 0">
              <div
                class="listItem"
                v-for="(item, index) in item.purchase"
                :key="index"
              >
                <img :src="item.goods.pic" :alt="item.goods.title" />
                {{ item.goods.title }}
              </div>
            </td>
            <td style="padding: 0">
              <div
                class="listItem"
                v-for="(item, index) in item.purchase"
                :key="index"
              >
                {{ item.qty }}
              </div>
            </td>
            <td style="padding: 0">
              <div
                class="listItem"
                v-for="(item, index) in item.purchase"
                :key="index"
              >
                {{ commaFormat(item.goods.price) }}
              </div>
            </td>
            <td>
              {{
                commaFormat(Math.round((totalPrice(item.purchase) * 10) / 100))
              }}
            </td>
            <td>{{ commaFormat(totalPrice(item.purchase)) }}</td>
            <td>{{ commaFormat(totalPrice(item.purchase)) }}</td>
          </tr>
        </tbody>
        <tfoot class="statement">
          <tr>
            <th />
            <th />
            <th />
            <th />
            <th style="text-align: right">合計</th>
            <th>{{ commaFormat(totalAmount(filterBalance)) }}</th>
            <th>{{ commaFormat(totalAmount(filterBalance)) }}</th>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<script>
import { computed, reactive, onBeforeMount } from "vue";
import { useStore } from "vuex";
import Filterselector from "@/components/Filterselector";

export default {
  components: {
    Filterselector,
  },
  setup() {
    const store = useStore();
    const tableHead = reactive([
      "借單編號",
      "承租物",
      "數量",
      "單價 (台幣)",
      "押金 (台幣)",
      "租金 (台幣)",
      "應收金額 (台幣)",
    ]);

    const balance = computed(() => {
      return store.state.iou.iou.filter((item) => item.status === 1);
    });
    const balanceTime = computed(() => {
      return balance.value.map((item) => item.returnDate);
    });
    const filterValue = computed(() => {
      return store.state.app.filterValue;
    });
    const filterBalance = computed(() => {
      const result = balance.value.filter(
        (item) =>
          item.returnDate.split("-")[1] === filterValue.value.split("-")[1]
      );

      return result.sort((a, b) => {
        return new Date(a.returnDate) < new Date(b.returnDate) ? 1 : -1;
      });
    });

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
    const totalAmount = (source) => {
      let amount = 0;

      source.forEach((element) => {
        element.purchase.forEach((element) => {
          amount += element.qty * Number(element.goods.price);
        });
      });

      return amount;
    };
    const formatTimeData = (data) => {
      const newArray = [];

      data.forEach((item) => {
        newArray.push(item.split("-")[0] + "-" + item.split("-")[1]);
      });

      const filterRepeat = newArray.filter((item, index, array) => {
        return array.indexOf(item) === index;
      });

      const result = [];

      for (let index = 0; index < filterRepeat.length; index++) {
        result.push({
          year: filterRepeat[index].split("-")[0],
          month: [filterRepeat[index]],
        });
      }

      for (let index = 0; index < result.length; index++) {
        if (index + 1 < result.length) {
          if (result[index].year == result[index + 1].year) {
            result[index].month.push(result[index + 1].month.join());
            result.splice(index + 1, 1);
          }
        }
      }

      return result;
    };

    onBeforeMount(() => {
      store.commit("app/triggerViewSwitch", "table", { root: true });
      store.commit("app/setFilterValue", "0", { root: true });
    });

    return {
      tableHead,
      balanceTime,
      filterBalance,
      commaFormat,
      totalPrice,
      totalAmount,
      formatTimeData,
    };
  },
};
</script>

<style lang="scss" scoped>
.balance {
  position: relative;
  width: 100%;
  white-space: nowrap;
  padding: calc(#{$grid-gap}/ 2) $grid-gap;
  background-color: $color-area-bg;
  border-radius: $border-radius;
  overflow-x: auto;

  @include breakpoint-lg {
    padding: $grid-gap;
    white-space: normal;
  }

  &__table {
    width: 100%;
    word-break: break-all;
    border-collapse: collapse;
    font-size: $font-size-light;
    text-align: center;

    thead,
    tfoot {
      tr {
        th {
          min-width: 8rem;
          padding: 1em 2em;
          color: $color-gray;
          font-weight: $font-weight-bold;
        }
      }
    }

    thead {
      tr {
        border-bottom: $border-line;
      }
    }

    tfoot {
      tr {
        border-top: $border-line;

        th {
          color: $color-red;
          font-size: $font-size-regular;

          small {
            margin-right: 0.35em;
            font-size: $font-size-thin;
          }
        }
      }
    }

    tbody {
      width: 100%;
      overflow-y: auto;

      tr {
        width: 100%;
        border-bottom: $border-line;

        &:last-of-type {
          border-bottom: none;
        }

        &.noResult {
          color: $color-gray;
          font-size: $font-size-black;
          font-weight: $font-weight-bold;
          text-align: center;
        }

        td {
          min-width: 8rem;
          padding: 1em 2em;

          h6 {
            margin: 0 0 0.25em;

            small {
              display: block;
              color: $color-green;
              font-size: $font-size-thin;
              font-weight: $font-weight-regular;
            }
          }

          img {
            width: 40px;
            height: 40px;
            margin-right: 0.75em;
            border-radius: $border-radius-round;
            overflow: hidden;
          }

          i {
            min-width: 1.1em;
            margin-right: 0.3em;
            text-align: center;
          }

          .listItem {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 5em;
            padding: 1em;
            border-bottom: $border-line;

            &:last-child {
              border-bottom: none;
            }

            img {
              width: 25px;
              height: 25px;
            }
          }
        }
      }
    }
  }
}
</style>