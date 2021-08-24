<template>
  <div>
    <SearchBar :placeholder="'請輸入物件名稱'" />
    <button
      type="button"
      class="button button--add"
      @click="callGoodsEditor(true)"
    >
      <i class="fas fa-plus"></i>
      <span>新增</span>
    </button>
    <transition name="slideRight" mode="out-in" appear>
      <CardView :cardData="searchProduct" v-if="dataView === 'card'">
        <template #cardData="cardData">
          <div
            class="card__list__item__cover"
            :style="{ backgroundImage: 'url(' + cardData.item.pic + ')' }"
          ></div>
          <h5 class="card__list__item__header">
            {{ cardData.item.title }}
            <div
              class="card__list__item__header__tag bgColor--green"
              v-if="cardData.item.status === 0"
            >
              可租借
            </div>
            <div
              class="card__list__item__header__tag bgColor--orange"
              v-if="cardData.item.status === 1"
            >
              暫停租借
            </div>
            <div
              class="card__list__item__header__tag bgColor--red"
              v-if="cardData.item.status === 2"
            >
              已下架
            </div>
          </h5>
          <p class="card__list__item__info">
            <i class="fas fa-dollar-sign"></i>
            <small>NT&nbsp;</small>
            {{ commaFormat(cardData.item.price) }}
          </p>
          <p class="card__list__item__info">
            <i class="fas fa-box"></i>
            <span
              :class="{
                'textColor--green': cardData.item.stock > 30,
                'textColor--orange':
                  cardData.item.stock > 10 && cardData.item.stock <= 30,
                'textColor--red': cardData.item.stock <= 10,
              }"
            >
              {{ commaFormat(cardData.item.stock) }}
            </span>
          </p>
          <p class="card__list__item__info">{{ cardData.item.summary }}</p>
          <button
            type="button"
            class="button button--edit"
            @click="callGoodsEditor(false, cardData.item)"
          >
            <i class="fas fa-edit"></i>修改資訊
          </button>
        </template>
      </CardView>
    </transition>
    <transition name="slideRight" mode="out-in" appear>
      <TableView
        :tableHead="tableHead"
        :tableData="searchProduct"
        v-if="dataView === 'table'"
      >
        <template #tableData="tableData">
          <td class="mobile-label goodsName">
            <img :src="tableData.item.pic" :alt="tableData.item.title" />
            {{ tableData.item.title }}
          </td>
          <td class="mobile-label goodsStatus">
            <span class="textColor--green" v-if="tableData.item.status === 0"
              >可租借</span
            >
            <span class="textColor--orange" v-if="tableData.item.status === 1"
              >暫停租借</span
            >
            <span class="textColor--red" v-if="tableData.item.status === 2"
              >已下架</span
            >
          </td>
          <td class="mobile-label price">
            {{ commaFormat(tableData.item.price) }}
          </td>
          <td class="mobile-label stock">
            <span
              :class="{
                'textColor--green': tableData.item.stock > 30,
                'textColor--orange':
                  tableData.item.stock > 10 && tableData.item.stock <= 30,
                'textColor--red': tableData.item.stock <= 10,
              }"
            >
              {{ commaFormat(tableData.item.stock) }}
            </span>
          </td>
          <td class="mobile-label summary">{{ tableData.item.summary }}</td>
          <td class="mobile-label maintain">
            <button
              type="button"
              class="button button--viewer"
              @click="callGoodsEditor(false, tableData.item)"
            >
              修改資訊
            </button>
          </td>
        </template>
      </TableView>
    </transition>
    <teleport to="body">
      <transition name="slideRight" mode="out-in" appear>
        <GoodsEditor v-if="showGoodsEditor" :data="goodsData" :isNew="isNew" />
      </transition>
    </teleport>
  </div>
</template>

<script>
import { computed, ref, reactive, watch } from "vue";
import { useStore } from "vuex";
import GoodsEditor from "@/components/Dashboard/GoodsEditor.vue";
import SearchBar from "@/components/SearchBar.vue";
import CardView from "@/components/CardView";
import TableView from "@/components/TableView";

export default {
  components: {
    SearchBar,
    GoodsEditor,
    CardView,
    TableView,
  },
  setup() {
    const store = useStore();
    const isNew = ref(null);
    const goodsData = ref({});
    const tableHead = reactive([
      "品名",
      "物件狀態",
      "價格 (台幣)",
      "庫存",
      "簡介",
      "維護",
    ]);

    const dataView = computed(() => {
      return store.state.app.viewSwitch;
    });
    const showGoodsEditor = computed(() => {
      return store.state.goods.showGoodsEditor;
    });
    const goods = computed(() => {
      return JSON.parse(JSON.stringify(store.state.goods.goods));
    });
    const searchFilter = computed(() => {
      return store.state.app.searchKeyword;
    });
    const searchProduct = computed(() => {
      return goods.value.filter((item) =>
        item.title.toLowerCase().includes(searchFilter.value)
      );
    });

    const commaFormat = (value) => {
      return Number(value).toLocaleString("zh-TW");
    };
    const callGoodsEditor = (newItem, data) => {
      if (newItem) {
        isNew.value = true;
      } else {
        isNew.value = false;
        goodsData.value = data;
      }

      return store.commit("goods/showGoodsEditor", true, { root: true });
    };

    watch(showGoodsEditor, (showGoodsEditor) => {
      showGoodsEditor
        ? document.querySelector("html").classList.add("scrollFixed")
        : document.querySelector("html").removeAttribute("class");
    });

    return {
      isNew,
      tableHead,
      goodsData,
      dataView,
      showGoodsEditor,
      goods,
      searchFilter,
      searchProduct,
      commaFormat,
      callGoodsEditor,
    };
  },
};
</script>