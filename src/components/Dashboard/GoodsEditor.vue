<template>
  <div class="modal">
    <div class="modal__wrap">
      <h1 class="modal__wrap__header">物件資料</h1>
      <div class="modal__wrap__content">
        <form action="#" method="post" class="form" @submit.prevent="sendData">
          <div class="form__row">
            <div class="form__row__column">
              <div class="form__content">
                <h4 class="form__content__title">名稱</h4>
                <input
                  type="text"
                  name="title"
                  placeholder="請輸入名稱"
                  v-model="goods.title"
                />
                <span class="form__content__alert" v-if="alert.title">
                  {{ alert.title }}
                </span>
              </div>
              <div class="form__content">
                <h4 class="form__content__title">
                  圖片
                  <span class="notes"
                    >建議尺寸為 200 x 200 px，檔案格式為 jpg，容量低於
                    100kb</span
                  >
                </h4>
                <div class="form__row picPreview">
                  <div class="picPreview__currentPic" v-if="goods.pic">
                    <img :src="goods.pic" :alt="goods.title" />
                  </div>
                  <div class="picPreview__currentPic" v-else>
                    <i class="fas fa-image"></i>
                  </div>
                  <div class="picPreview__customFile">
                    上傳檔案（僅限 1 張）
                    <input
                      type="file"
                      name="cover"
                      accept=".jpg"
                      @change="picPreview"
                    />
                  </div>
                </div>
                <span class="form__content__alert" v-if="alert.pic">
                  {{ alert.pic }}
                </span>
              </div>
              <div class="form__content">
                <h4 class="form__content__title">簡介</h4>
                <textarea
                  name="summary"
                  rows="3"
                  placeholder="請輸入內容"
                  v-model="goods.summary"
                ></textarea>
                <span class="form__content__alert" v-if="alert.summary">
                  {{ alert.summary }}
                </span>
              </div>
            </div>
            <div class="form__row__column">
              <div class="form__content">
                <h4 class="form__content__title">租金價格</h4>
                <input
                  type="number"
                  name="price"
                  min="1"
                  placeholder="請直接輸入數字"
                  v-model="goods.price"
                />
                <span class="form__content__alert" v-if="alert.price">
                  {{ alert.price }}
                </span>
              </div>
              <div class="form__content">
                <h4 class="form__content__title">
                  可租數量
                  <span class="notes">請注意數量為 0 時，商品將停止租賃</span>
                </h4>
                <input
                  type="number"
                  name="stock"
                  min="0"
                  placeholder="請直接輸入數字"
                  v-model="goods.stock"
                />
                <span class="form__content__alert" v-if="alert.stock">
                  {{ alert.stock }}
                </span>
              </div>
              <div class="form__content">
                <h4 class="form__content__title">狀態</h4>
                <label class="status">
                  <input
                    type="radio"
                    name="status"
                    value="0"
                    v-model="goods.status"
                  />
                  <span>可租借</span>
                </label>
                <label class="status">
                  <input
                    type="radio"
                    name="status"
                    value="1"
                    v-model="goods.status"
                  />
                  <span>暫停租借</span>
                </label>
                <label class="status">
                  <input
                    type="radio"
                    name="status"
                    value="2"
                    v-model="goods.status"
                  />
                  <span>已下架</span>
                </label>
              </div>
            </div>
          </div>
          <div class="form__control">
            <button type="submit" class="button">
              <span v-if="isNew">
                <i class="fas fa-cloud-upload-alt"></i> 上架
              </span>
              <span v-else><i class="fas fa-sync-alt"></i> 更新</span>
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
import { reactive, nextTick, watch, onBeforeMount } from "vue";
import { useStore } from "vuex";

export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
    isNew: {
      type: Boolean,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();
    const goods = reactive({
      id: null,
      title: null,
      price: null,
      stock: 0,
      pic: null,
      summary: null,
      status: 0,
    });
    const alert = reactive({
      title: null,
      price: null,
      stock: null,
      pic: null,
      summary: null,
    });

    const endEditor = () => {
      return store.commit("goods/showGoodsEditor", false, { root: true });
    };

    const checkIsNew = (isNew, data) => {
      if (!isNew) {
        return (
          (goods.id = data.id),
          (goods.title = data.title),
          (goods.price = data.price),
          (goods.stock = data.stock),
          (goods.pic = data.pic),
          (goods.summary = data.summary),
          (goods.status = data.status)
        );
      }
    };

    const getSrcURL = (file) => {
      let url = null;

      if (window.createObjectURL !== undefined) {
        // base
        url = window.createObjectURL(file);
      } else if (window.URL !== undefined) {
        // mozilla(firefox)
        url = window.URL.createObjectURL(file);
      } else if (window.webkitURL !== undefined) {
        // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
      }

      return url;
    };

    const picPreview = () => {
      const upload = document.querySelector('input[name="cover"]');
      let picUrl = getSrcURL(upload.files[0]);

      return (goods.pic = picUrl);
    };

    const sendData = () => {
      const data = {
        id: goods.id,
        title: goods.title,
        price: goods.price,
        stock: goods.stock,
        pic: goods.pic,
        summary: goods.summary,
        status: Number(goods.status),
      };
      const isNewGoods = props.isNew;

      if (goods.title === null || goods.title === "") {
        return (alert.title = "請輸入名稱！");
      }
      if (goods.pic === null) {
        return (alert.pic = "請上傳圖片！");
      }
      if (goods.price === null || goods.price === "") {
        return (alert.price = "請輸入租借費用！");
      }
      if (goods.stock === null || goods.stock === "") {
        return (alert.stock = "請輸入數量！");
      }
      if (goods.summary === null || goods.summary === "") {
        return (alert.summary = "請輸入簡介！");
      }

      if (data.stock == 0) {
        data.status = 2;
      }

      if (isNewGoods && data.id === null) {
        const newid = store.state.goods.goods.length + 1;
        data.id = newid.toString();
      }

      store.dispatch("goods/updateGoodsData", { data }, { root: true });

      nextTick(() => {
        endEditor();
      });
    };

    watch(goods, (goods) => {
      if (goods.title === "") {
        goods.title = null;
        alert.title = "請輸入名稱！";
      }
      if (goods.title === null || goods.title.length !== 0) {
        alert.title = null;
      }
      if (goods.pic === null) {
        goods.pic = null;
        alert.pic = "請上傳圖片！";
      }
      if (goods.pic != null) {
        alert.pic = null;
      }
      if (goods.price === "") {
        goods.price = null;
        alert.price = "請輸入租借費用！";
      }
      if (goods.price === null || goods.price.length !== 0) {
        alert.price = null;
      }
      if (goods.stock === "") {
        goods.stock = null;
        alert.stock = "請輸入數量！";
      }
      if (goods.stock === null || goods.stock.length !== 0) {
        alert.stock = null;
      }
      if (goods.summary === "") {
        goods.summary = null;
        alert.summary = "請輸入簡介！";
      }
      if (goods.summary === null || goods.summary.length !== 0) {
        alert.summary = null;
      }
    });

    onBeforeMount(() => {
      checkIsNew(props.isNew, props.data);
    });

    return {
      goods,
      alert,
      endEditor,
      picPreview,
      sendData,
    };
  },
};
</script>

<style lang="scss" scoped>
.notes {
  max-width: calc(100% - 5em);
  margin-left: auto;
  font-size: $font-size-light;
  font-weight: $font-weight-regular;
  color: $color-green;
}

.status {
  display: inline-flex;
  align-items: center;
  font-size: $font-size-regular;
  color: $color-gray;
  margin-right: $grid-gap;

  &:last-of-type {
    margin-right: 0;
  }

  span {
    margin-left: 0.5em;
  }
}

.picPreview {
  align-items: center;
  justify-content: space-between;
  padding: 0;

  &__currentPic {
    position: relative;
    width: 100px;
    height: 100px;
    font-size: 3rem;
    text-align: center;
    border-radius: $border-radius-round;
    overflow: hidden;

    @include breakpoint-lg {
      margin: 0 auto $grid-gap;
    }

    img {
      position: absolute;
      bottom: 50%;
      right: 50%;
      transform: translate(50%, 50%);
      height: 100%;
    }
  }

  &__customFile {
    position: relative;
    width: calc(100% - 100px - #{$grid-gap});
    height: 50px;
    line-height: 50px;
    color: $color-white;
    background-color: $color-main;
    border-radius: $border-radius-round;
    font-size: $font-size-light;
    font-weight: $font-weight-regular;
    text-align: center;

    @include breakpoint-lg {
      width: 100%;
    }

    input {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
    }
  }
}
</style>