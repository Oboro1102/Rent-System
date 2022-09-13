<template>
  <div style="position: relative">
    <AreaLoading />
    <SearchBar :placeholder="'請輸入姓名'" />
    <transition name="slideRight" mode="out-in" appear>
      <CardView :cardData="searchMembers" v-if="dataView === 'card'">
        <template #cardData="cardData">
          <div class="card__list__item__cover" :style="{
            backgroundImage: `url('${cardData.item.picture.large}')`,
          }"></div>
          <h5 class="card__list__item__header">
            <span class="textColor--blue" v-if="cardData.item.gender === 'male'" style="margin-right: 0.25em">
              <i class="fas fa-mars"></i>
            </span>
            <span class="textColor--pink" v-if="cardData.item.gender === 'female'" style="margin-right: 0.25em">
              <i class="fas fa-venus"></i>
            </span>
            <span v-text="cardData.item.name.last" />
            <button type="button" class="button button--viewer" v-if="checkHaveIou(cardData.item) !== -1"
              @click="callIouView(cardData.item)">
              <i class="fas fa-history"></i>
            </button>
          </h5>
          <p class="card__list__item__info">
            <i class="fas fa-mobile-alt"></i>
            <span v-text="cardData.item.phone" />
          </p>
          <p class="card__list__item__info">
            <i class="far fa-envelope"></i>
            <span v-text="cardData.item.email" />
          </p>
          <p class="card__list__item__info">
            <i class="fas fa-house-user"></i>
            <span
              v-text="`${cardData.item.location.street.number}${cardData.item.location.street.name}${cardData.item.location.city}${cardData.item.location.country}${cardData.item.location.state}`" />
          </p>
          <p class="card__list__item__info">
            <i class="fas fa-user-plus"></i>
            <span
              v-text="`${cardData.item.registered.date.split('T')[0]}${cardData.item.registered.date.split('T')[1].split(':')[0]}:${cardData.item.registered.date.split('T')[1].split(':')[1]}`" />
          </p>
        </template>
      </CardView>
    </transition>
    <transition name="slideRight" mode="out-in" appear>
      <TableView :tableHead="tableHead" :tableData="searchMembers" v-if="dataView === 'table'">
        <template #tableData="tableData">
          <td class="mobile-label memberName">
            <img :src="tableData.item.picture.large" :alt="tableData.item.name.last" />
            <span v-text="tableData.item.name.last" />
          </td>
          <td class="mobile-label phone" v-text="tableData.item.phone" />
          <td class="mobile-label email" v-text="tableData.item.email" />
          <td class="mobile-label location"
            v-text="`${tableData.item.location.street.number}${tableData.item.location.street.name}${tableData.item.location.city}${tableData.item.location.country}${tableData.item.location.state}`" />
          <td class="mobile-label created"
            v-text="`${cardData.item.registered.date.split('T')[0]}${cardData.item.registered.date.split('T')[1].split(':')[0]}:${cardData.item.registered.date.split('T')[1].split(':')[1]}`" />
          >
          <td class="mobile-label ious">
            <button type="button" class="button button--viewer" v-if="checkHaveIou(tableData.item) !== -1"
              @click="callIouView(tableData.item)">
              瀏覽
            </button>
          </td>
        </template>
      </TableView>
    </transition>
    <teleport to="body">
      <transition name="slideRight" mode="out-in" appear>
        <IouView v-if="showIouView" :data="iouViewData" />
      </transition>
    </teleport>
  </div>
</template>

<script>
import { computed, ref, reactive, watch } from "vue";
import { useStore } from "vuex";
import AreaLoading from "@/components/AreaLoading";
import SearchBar from "@/components/SearchBar.vue";
import IouView from "@/components/Dashboard/IouView";
import CardView from "@/components/CardView";
import TableView from "@/components/TableView";

export default {
  components: {
    AreaLoading,
    SearchBar,
    IouView,
    CardView,
    TableView,
  },
  setup() {
    const store = useStore();
    const tableHead = reactive([
      "姓名",
      "電話",
      "電子郵件",
      "地址",
      "註冊時間",
      "租借紀錄",
    ]);
    const iouViewData = ref([]);

    const dataView = computed(() => {
      return store.state.app.viewSwitch;
    });
    const members = computed(() => {
      return store.getters["member/sortedMembers"];
    });
    const searchFilter = computed(() => {
      return store.state.app.searchKeyword;
    });
    const searchMembers = computed(() => {
      const result = members.value.filter((item) =>
        item.name.last.toLowerCase().includes(searchFilter.value)
      );

      return result;
    });
    const showIouView = computed(() => {
      return store.state.member.showIouView;
    });
    const memberHaveIou = computed(() => {
      const iou = store.state.iou.iou;
      const result = [];

      for (let a = 0; a < iou.length; a++) {
        let ious = iou[a];
        for (let b = 0; b < members.value.length; b++) {
          let tempMembers = members.value[b];

          if (ious.lessee.cell === tempMembers.cell) {
            result.push(ious);
            break;
          }
        }
      }

      return result;
    });

    const callIouView = (member) => {
      const result = memberHaveIou.value.filter((item) => {
        return item.lessee.cell === member.cell;
      });

      iouViewData.value = result.sort((a, b) => {
        return a.sn < b.sn ? 1 : -1;
      });

      return store.commit("member/showIouView", true, { root: true });
    };
    const checkHaveIou = (member) => {
      const result = memberHaveIou.value.findIndex((item) => {
        return item.lessee.cell === member.cell;
      });

      return result;
    };

    watch(showIouView, (showIouView) => {
      showIouView
        ? document.querySelector("html").classList.add("scrollFixed")
        : document.querySelector("html").removeAttribute("class");
    });

    return {
      tableHead,
      iouViewData,
      dataView,
      searchMembers,
      showIouView,
      callIouView,
      checkHaveIou,
    };
  },
};
</script>

<style lang="scss" scoped>
.button {
  &--viewer {
    position: relative;
    margin-left: auto;
    padding: 0.5em;
    font-size: $font-size-light;

    &:hover {
      &::after {
        position: absolute;
        bottom: 120%;
        right: 50%;
        transform: translateX(50%);
        width: 5em;
        content: "租借紀錄";
        background-color: $color-nav-link-popover;
        border-radius: $border-radius-round;
      }
    }
  }
}
</style>