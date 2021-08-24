<template>
  <div class="modal">
    <div class="modal__wrap">
      <h1 class="modal__wrap__header">租借資料</h1>
      <div class="modal__wrap__content">
        <form action="#" method="post" class="form" @submit.prevent="sendData">
          <div class="form__row">
            <div class="form__row__column">
              <div class="form__content">
                <h4 class="form__content__title">
                  承租人
                  <button
                    type="button"
                    class="button button--combobox"
                    @click="callComboBox('lessee')"
                  >
                    <span v-if="rentData.lessee">更換</span>
                    <span v-else>選擇承租人</span>
                  </button>
                </h4>
                <div class="form__selector">
                  <div class="form__selector__result" v-if="rentData.lessee">
                    <img
                      :src="rentData.lessee.picture.thumbnail"
                      :alt="rentData.lessee.name.last"
                    />
                    <span
                      class="combobox__dropdowns__item__tag textColor--blue"
                      v-if="rentData.lessee.gender === 'male'"
                    >
                      <i class="fas fa-mars"></i>
                    </span>
                    <span
                      class="combobox__dropdowns__item__tag textColor--pink"
                      v-else
                    >
                      <i class="fas fa-venus"></i>
                    </span>
                    {{ rentData.lessee.name.first }}
                    {{ rentData.lessee.name.last }}
                  </div>
                </div>
                <ComboBox
                  ref="lessee"
                  :dropdownsData="members"
                  :placeholder="'快速搜尋請輸入聯絡電話'"
                  :searchBy="'phone'"
                  @selectedValue="updateSelectedValue('lessee', $event)"
                >
                  <template #dropdowns="dropdowns">
                    <img
                      :src="dropdowns.item.picture.thumbnail"
                      :alt="dropdowns.item.name.last"
                    />
                    <span
                      class="combobox__dropdowns__item__tag textColor--blue"
                      v-if="dropdowns.item.gender === 'male'"
                    >
                      <i class="fas fa-mars"></i>
                    </span>
                    <span
                      class="combobox__dropdowns__item__tag textColor--pink"
                      v-else
                    >
                      <i class="fas fa-venus"></i>
                    </span>
                    {{ dropdowns.item.name.last }}
                  </template>
                </ComboBox>
                <span class="form__content__alert" v-if="alert.lessee">
                  {{ alert.lessee }}
                </span>
              </div>
              <div class="form__content">
                <h4 class="form__content__title">
                  租借品
                  <button
                    type="button"
                    class="button button--combobox"
                    @click="callComboBox('purchase')"
                  >
                    <span v-if="rentData.purchase.length !== 0">追加</span>
                    <span v-else>選擇租借物件</span>
                  </button>
                </h4>
                <div class="form__selector">
                  <div
                    class="form__selector__result"
                    v-for="(item, index) in rentData.purchase"
                    :key="item.id"
                  >
                    <img :src="item.goods.pic" :alt="item.goods.title" />
                    {{ item.goods.title }}
                    <div class="form__selector__result__select">
                      <select name="qty" v-model="rentData.purchase[index].qty">
                        <option
                          v-for="n in Number(item.stock)"
                          :key="n"
                          :value="n"
                        >
                          {{ n }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
                <ComboBox
                  ref="purchase"
                  :dropdownsData="goods"
                  :placeholder="'快速搜尋請輸入物件名稱'"
                  :searchBy="'title'"
                  @selectedValue="updateSelectedValue('purchase', $event)"
                >
                  <template #dropdowns="dropdowns">
                    <img
                      :src="dropdowns.item.pic"
                      :alt="dropdowns.item.title"
                    />
                    {{ dropdowns.item.title }}
                    <span class="combobox__dropdowns__item__notice">
                      剩餘：{{ dropdowns.item.stock }}
                    </span>
                  </template>
                </ComboBox>
                <span class="form__content__alert" v-if="alert.purchase">
                  {{ alert.purchase }}
                </span>
              </div>
            </div>
            <div class="form__row__column">
              <div class="form__content">
                <h4 class="form__content__title">歸還日期</h4>
                <input
                  type="date"
                  name="returnDate"
                  v-model="rentData.returnDate"
                />
                <span class="form__content__alert" v-if="alert.returnDate">
                  {{ alert.returnDate }}
                </span>
              </div>
              <div class="form__content">
                <h4 class="form__content__title">備註</h4>
                <textarea
                  name="note"
                  rows="3"
                  placeholder="請輸入內容"
                  v-model="rentData.notes"
                ></textarea>
              </div>
            </div>
          </div>
          <div class="form__control">
            <button type="submit" class="button">
              <i class="fas fa-cloud-upload-alt"></i> 新增
            </button>
          </div>
        </form>
        <button type="button" class="button button--close" @click="endEditor">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, reactive, watch, nextTick } from "vue";
import { useStore } from "vuex";
import ComboBox from "@/components/ComboBox.vue";

export default {
  components: {
    ComboBox,
  },
  setup() {
    const store = useStore();
    const lessee = ref();
    const purchase = ref();
    const rentData = reactive({
      returnDate: null,
      notes: null,
      purchase: [],
      lessee: null,
    });
    const alert = reactive({
      returnDate: null,
      purchase: null,
      lessee: null,
    });

    const members = computed(() => {
      return store.getters["member/sortedMembers"];
    });
    const goods = computed(() => {
      const storeData = store.state.goods.goods;
      return storeData.filter((item) => item.stock > 0 && item.status === 0);
    });

    const endEditor = () => {
      return store.commit("iou/showIouEditor", false, { root: true });
    };

    const callComboBox = (useFor) => {
      switch (useFor) {
        case "lessee":
          lessee.value.using = !lessee.value.using;
          break;
        case "purchase":
          purchase.value.using = !purchase.value.using;
          break;

        default:
          break;
      }
    };

    const updateSelectedValue = (useFor, value) => {
      if (useFor === "lessee") {
        return (rentData.lessee = value);
      }

      if (useFor === "purchase") {
        const purchaseData = {
          goods: {
            id: value.id,
            title: value.title,
            pic: value.pic,
            price: value.price,
          },
          stock: value.stock,
          qty: 1,
        };

        const checkAlreadySelected = rentData.purchase.findIndex(
          (item) => item.goods.id === value.id
        );

        if (checkAlreadySelected !== -1) {
          alert.purchase = "您已經選擇了該物件！";

          return setTimeout(() => {
            alert.purchase = null;
          }, 1000);
        } else {
          alert.purchase = null;
          return rentData.purchase.push(purchaseData);
        }
      }
    };

    const sendData = () => {
      const lastIou = store.state.iou.iou.length - 1;
      const lastIouSn = Number(store.state.iou.iou[lastIou].sn);
      const data = {
        sn: (lastIouSn + 1).toString(),
        returnDate: rentData.returnDate,
        status: 0,
        notes: rentData.notes,
        purchase: rentData.purchase,
        lessee: rentData.lessee,
        created:
          new Date().toLocaleDateString("zh-TW").replace(/\//g, "-") +
          " " +
          new Date().toLocaleTimeString("zh-TW", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
          }),
      };

      if (rentData.lessee == null) {
        return (alert.lessee = "請選擇承租人！");
      }

      if (rentData.purchase.length < 1) {
        return (alert.purchase = "請至少選擇一個承租物！");
      }

      if (rentData.returnDate == null) {
        return (alert.returnDate = "請設定歸還日期！");
      }

      if (new Date(rentData.returnDate) < new Date()) {
        return (alert.returnDate = "時光機尚未出世，請選擇其他日期！");
      }

      store.dispatch("iou/addIouData", { data }, { root: true });

      nextTick(() => {
        endEditor();
      });
    };

    watch(rentData, (rentData) => {
      if (rentData.returnDate !== null) {
        alert.returnDate = null;
      }
      if (new Date(rentData.returnDate) < new Date()) {
        alert.returnDate = "時光機尚未出世，請選擇其他日期！";
      }
      if (rentData.lessee !== null) {
        alert.lessee = null;
      }
    });

    return {
      lessee,
      purchase,
      rentData,
      alert,
      members,
      goods,
      endEditor,
      callComboBox,
      updateSelectedValue,
      sendData,
    };
  },
};
</script>