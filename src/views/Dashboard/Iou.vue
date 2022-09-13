<template>
  <div>
    <SearchBar :placeholder="'請輸入借據編號'" />
    <Filterselector>
      <option value="all" class="textColor--grayDeep">所有訂單</option>
      <option value="0" class="textColor--blue">出借中</option>
      <option value="1" class="textColor--green">已歸還</option>
      <option value="2" class="textColor--red">逾期</option>
    </Filterselector>
    <button type="button" class="button button--add" @click="callIouEditor">
      <i class="fas fa-plus"></i>
      <span>新增</span>
    </button>
    <transition name="slideRight" mode="out-in" appear>
      <CardView :cardData="searchIous" v-if="dataView === 'card'">
        <template #cardData="cardData">
          <h5 class="card__list__item__header">
            <div class="card__list__item__header__info">
              <span v-text="cardData.item.sn" />
              <span>
                <i class="fas fa-calendar-check"></i>
                <span v-text="cardData.item.created" />
              </span>
            </div>
            <div class="card__list__item__header__tag bgColor--green" v-if="cardData.item.status === 0">
              出借中
            </div>
            <div class="card__list__item__header__tag bgColor--orange" v-if="cardData.item.status === 1">
              已歸還
            </div>
            <div class="card__list__item__header__tag bgColor--red" v-if="cardData.item.status === 2">
              逾期
            </div>
          </h5>
          <div class="card__list__item__info" v-if="cardData.item.lessee">
            <h5 class="card__list__item__info__title">
              <i class="fas fa-user-tag"></i> 承租人
            </h5>
            <div class="card__list__item__lessee">
              <div class="card__list__item__lessee__title">
                <div class="card__list__item__lessee__title__cover" :style="{
                  backgroundImage:
                    `url('${cardData.item.lessee.picture.thumbnail}')`,
                }" />
                <h6 v-text="cardData.item.lessee.name.last" />
              </div>
              <div>
                <i class="fas fa-phone-square-alt"></i>
                <span v-text="cardData.item.lessee.phone" />
              </div>
              <div>
                <i class="fas fa-home"></i>
                <span
                  v-text="`${cardData.item.lessee.location.street.number}${cardData.item.lessee.location.street.name}${cardData.item.lessee.location.city}${cardData.item.lessee.location.country}${cardData.item.lessee.location.state}`" />
              </div>
            </div>
          </div>
          <div class="card__list__item__info">
            <h5 class="card__list__item__info__title">
              <i class="fas fa-box"></i> 承租物
            </h5>
            <div v-for="(item, index) in cardData.item.purchase" :key="index">
              <span v-text="`${item.goods.title} x ${item.qty}`" />
              <small style="margin-left: 1em">NT$</small>
              <span v-text="commaFormat(item.goods.price * item.qty)" />
            </div>
          </div>
          <div class="card__list__item__info">
            <h5 class="card__list__item__info__title">
              <i class="fas fa-coins"></i> 費用
            </h5>
            <div>
              總額
              <small style="margin-left: 1em">NT$</small>
              <span v-text="commaFormat(totalPrice(cardData.item.purchase))" />
            </div>
            <div>
              押金
              <small style="margin-left: 1em">NT$</small>
              <span v-text="commaFormat(
              Math.round((totalPrice(cardData.item.purchase) * 10) / 100)
              )" />
            </div>
          </div>
          <div class="card__list__item__info" v-if="cardData.item.notes">
            <h5 class="card__list__item__info__title">
              <i class="fas fa-sticky-note"></i> 備註
            </h5>
            <div v-text="cardData.item.notes" />
          </div>
          <div class="card__list__item__info">
            <h5 class="card__list__item__info__title">
              <i class="fas fa-reply-all"></i> 租期 (迄)
            </h5>
            <div v-text="cardData.item.returnDate" />
          </div>
          <button type="button" class="button button--edit" @click="updateIouStatus(cardData.item)"
            v-if="cardData.item.status !== 1">
            <i class="fas fa-undo"></i> 完成歸還
          </button>
        </template>
      </CardView>
    </transition>
    <transition name="slideRight" mode="out-in" appear>
      <TableView :tableHead="tableHead" :tableData="searchIous" v-if="dataView === 'table'">
        <template #tableData="tableData">
          <td class="mobile-label sn">
            <h6>
              <span v-text="tableData.item.sn" />
              <small class="textColor--green">
                <i class="fas fa-calendar-check"></i>
                <span v-text="tableData.item.created" />
              </small>
            </h6>
          </td>
          <td class="mobile-label iouStatus">
            <span class="textColor--green" v-if="tableData.item.status === 0">
              出借中
            </span>
            <span class="textColor--orange" v-if="tableData.item.status === 1">
              已歸還
            </span>
            <span class="textColor--red" v-if="tableData.item.status === 2">
              逾期
            </span>
          </td>
          <td class="mobile-label lessee">
            <div v-if="tableData.item.lessee">
              <img :src="tableData.item.lessee.picture.thumbnail" :alt="tableData.item.lessee.name.last" />
              <span v-text="tableData.item.lessee.name.last" />
              <div>
                <i class="fas fa-phone-square-alt"></i>
                <span v-text="tableData.item.lessee.phone" />
              </div>
              <div>
                <i class="fas fa-home"></i>
                <span
                  v-text="`${tableData.item.lessee.location.street.number}${tableData.item.lessee.location.street.name}${tableData.item.lessee.location.city}${tableData.item.lessee.location.country}${tableData.item.lessee.location.state}`" />
              </div>
            </div>
          </td>
          <td class="mobile-label lease">
            <div class="listItem" v-for="(item, index) in tableData.item.purchase" :key="index">
              <h6>
                <img :src="item.goods.pic" :alt="item.goods.title" />
                <span v-text="item.goods.title" />
              </h6>
              <small v-text="`數量：${item.qty}`" />
              <small style="margin-left: 1em" v-text="`單價：NT$ ${commaFormat(item.goods.price)}`" />
            </div>
          </td>
          <td class="mobile-label rent" v-text="commaFormat(totalPrice(tableData.item.purchase))" />
          <td class="mobile-label deposit" v-text="commaFormat(
          Math.round((totalPrice(tableData.item.purchase) * 10) / 100)
          )" />
          <td class="mobile-label returnDate" v-text="tableData.item.returnDate" />
          <td class="mobile-label notes">
            <span v-if="tableData.item.notes" v-text="tableData.item.notes" />
          </td>
          <td class="mobile-label operating">
            <button type="button" class="button button--viewer" @click="updateIouStatus(tableData.item)"
              v-if="tableData.item.status !== 1">
              完成歸還
            </button>
          </td>
        </template>
      </TableView>
    </transition>
    <teleport to="body">
      <transition name="slideRight" mode="out-in" appear>
        <IouEditor v-if="showIouEditor" />
      </transition>
    </teleport>
  </div>
</template>

<script>
import { computed, onBeforeMount, reactive, watch } from "vue";
import { useStore } from "vuex";
import SearchBar from "@/components/SearchBar";
import Filterselector from "@/components/Filterselector";
import IouEditor from "@/components/Dashboard/IouEditor";
import CardView from "@/components/CardView";
import TableView from "@/components/TableView";

export default {
  components: {
    SearchBar,
    Filterselector,
    IouEditor,
    CardView,
    TableView,
  },
  setup() {
    const store = useStore();
    const tableHead = reactive([
      "借單編號",
      "借單狀態",
      "承租人",
      "承租物",
      "租金 (台幣)",
      "押金 (台幣)",
      "還物日",
      "備註",
      "操作",
    ]);

    const dataView = computed(() => {
      return store.state.app.viewSwitch;
    });
    const searchFilter = computed(() => {
      return store.state.app.searchKeyword;
    });
    const filterValue = computed(() => {
      return store.state.app.filterValue;
    });
    const ious = computed(() => {
      return JSON.parse(JSON.stringify(store.state.iou.iou));
    });
    const searchIous = computed(() => {
      let result = [];

      if (searchFilter.value !== "") {
        result = ious.value.filter((item) =>
          item.sn.includes(searchFilter.value)
        );
      } else if (filterValue.value !== "" && filterValue.value !== "all") {
        result = ious.value.filter((item) => item.status === filterValue.value);
      } else {
        result = ious.value;
      }

      return result.sort((a, b) => {
        return a.sn < b.sn ? 1 : -1;
      });
    });
    const showIouEditor = computed(() => {
      return store.state.iou.showIouEditor;
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
    const callIouEditor = () => {
      return store.commit("iou/showIouEditor", true, { root: true });
    };
    const updateIouStatus = (data) => {
      return store.dispatch("iou/updateIouStatus", { data }, { root: true });
    };

    watch(showIouEditor, (showIouEditor) => {
      showIouEditor
        ? document.querySelector("html").classList.add("scrollFixed")
        : document.querySelector("html").removeAttribute("class");
    });

    onBeforeMount(() => {
      store.commit("app/setFilterValue", "all", { root: true });
    });

    return {
      tableHead,
      dataView,
      searchIous,
      showIouEditor,
      commaFormat,
      totalPrice,
      callIouEditor,
      updateIouStatus,
    };
  },
};
</script>

<style lang="scss" scoped>
.card__list__item {
  &__header {
    padding: calc(#{$grid-gap}/ 2);

    &__info {
      display: flex;
      flex-direction: column;

      span {
        i {
          margin-right: 0.5em;
        }

        &:nth-child(2) {
          color: $color-green;
          font-size: $font-size-thin;
        }
      }
    }
  }

  &__lessee {
    &__title {
      display: flex;
      align-items: center;
      flex-wrap: wrap;

      &__cover {
        width: 30px;
        height: 30px;
        margin-right: 0.5em;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        border-radius: $border-radius-round;
      }

      h6 {
        margin: 0;
      }
    }
  }
}
</style>