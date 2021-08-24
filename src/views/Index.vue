<template >
  <section class="main">
    <div class="main--key__wrap" data-aos="fade-up">
      <h1 class="main--key__wrap__slogn">
        <span>租賃管理</span><br /><span class="textColor--yellow"
          >最佳方案</span
        ><br /><span>出租線上化！</span>
      </h1>
    </div>
  </section>
  <section class="wrap wrap--serves">
    <h3 class="wrap__title">系統特色</h3>
    <div class="wrap__content">
      <ul class="wrap--serves__list">
        <li class="wrap--serves__list__item" data-aos="fade-up">
          <img src="../assets/img/feature-1.jpg" alt="掌握會員資訊" />
          <h4>掌握會員資訊</h4>
          <p>查詢所有承租會員的連絡資訊及承租紀錄。</p>
        </li>
        <li class="wrap--serves__list__item" data-aos="fade-up">
          <img src="../assets/img/feature-2.jpg" alt="管理出租物件" />
          <h4>管理出租物件</h4>
          <p>系統化新增、管理您欲出租的所有物件及庫存。</p>
        </li>
        <li class="wrap--serves__list__item" data-aos="fade-up">
          <img src="../assets/img/feature-3.jpg" alt="出租線上化" />
          <h4>出租線上化</h4>
          <p>將傳統紙本作業線上化，方便管理所有出租狀況。</p>
        </li>
      </ul>
    </div>
  </section>
  <section class="wrap wrap--contact">
    <h3 class="wrap__title textColor--white">聯絡我們</h3>
    <form
      class="wrap__content"
      action="#"
      method="post"
      onsubmit="event.preventDefault();"
    >
      <div class="wrap--contact__row">
        <span class="wrap--contact__row__icon">
          <i class="fas fa-id-card"></i>
        </span>
        <input type="text" name="name" placeholder="請輸入您的姓名" required />
      </div>
      <div class="wrap--contact__row">
        <span class="wrap--contact__row__icon">
          <i class="fas fa-envelope"></i>
        </span>
        <input
          type="email"
          name="email"
          placeholder="請輸入連絡您的電子郵件"
          required
        />
      </div>
      <div class="wrap--contact__row">
        <textarea
          name="message"
          cols="30"
          rows="10"
          placeholder="請輸入您欲傳送的訊息"
        ></textarea>
      </div>
      <button class="button" type="submit">送出</button>
    </form>
  </section>
  <footer class="footer">
    <div class="footer__about">
      <button
        type="button"
        class="button button--about"
        @focus="showPopover = true"
        @blur="showPopover = false"
      >
        ABOUT
      </button>
      <transition name="slideDown" mode="out-in" appear>
        <div class="footer__about__popover" v-if="showPopover">
          本系統採用<a href="https://v3.vuejs.org/" target="_blank">Vue3</a
          >進行前端開發，高品質的圖片素材使用自<a
            href="https://unsplash.com/"
            target="_blank"
            >Unsplash</a
          >，會員資料串接<a href="https://randomuser.me/" target="_blank"
            >Random user generator</a
          >。
        </div>
      </transition>
    </div>
    <div class="footer__copyright">
      &copy; 2021<span v-if="currentYear != 2021"
        >&nbsp;-&nbsp;{{ currentYear }}</span
      >&nbsp;Design & Coding by ツキノリュウ.
    </div>
  </footer>
  <LoginService />
  <RouterLoading />
</template>

<script>
import { ref, computed, nextTick, onBeforeMount } from "vue";
import { useStore } from "vuex";
import LoginService from "@/components/LoginService";
import RouterLoading from "@/components/RouterLoading";

export default {
  components: {
    LoginService,
    RouterLoading,
  },
  setup() {
    const store = useStore();
    const showPopover = ref(false);
    const currentYear = computed(() => new Date().getFullYear());

    onBeforeMount(() => {
      store.commit("triggerLoadingScreen", true, { root: true });
      nextTick(() => {
        store.commit("triggerLoadingScreen", false, { root: true });
      });
    });

    return { showPopover, currentYear };
  },
};
</script>

<style lang="scss" scoped>
.main {
  position: relative;
  display: flex;
  width: 100%;
  min-height: 100vh;
  padding: 10vh $grid-gap $grid-gap;
  z-index: 0;

  &::after {
    position: absolute;
    top: 0;
    left: 0;
    z-index: $layer-lv0;
    width: 100%;
    height: 100%;
    content: "";
    background-color: rgba(0, 0, 0, 0.45);
    background-image: url("../assets/img/jonas-jacobsson-1iTKoFJvJ6E-unsplash.jpg");
    background-blend-mode: multiply;
    background-size: cover;
    background-position: center;
    animation-name: zooming;
    animation-duration: 60s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }

  &--key {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    color: $color-white;

    &__wrap {
      width: 75%;

      @include breakpoint-md {
        width: 100%;
      }

      &__slogn {
        margin: 0;
        color: $color-white;
        font-size: 10vw;
        font-weight: $font-weight-black;
        line-height: 1;

        @include breakpoint-lg {
          font-size: 15vw;
        }

        @include breakpoint-sm {
          font-size: 20vw;
        }
      }
    }
  }
}

.wrap {
  position: relative;
  width: 100%;
  padding: calc(#{$grid-gap}* 4) $grid-gap;

  &__title {
    margin: 0 0 calc(#{$grid-gap}* 2);
    font-size: calc(#{$font-size-black}* 1.5);
    font-weight: $font-weight-black;
    text-align: center;
  }

  &__content {
    max-width: 75%;
    margin: 0 auto;
    text-align: center;

    @include breakpoint-xl {
      max-width: 80%;
    }

    @include breakpoint-md {
      max-width: 100%;
    }
  }

  &--serves {
    width: 100%;
    background-color: $color-yellow;

    &__list {
      @include list-style;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      flex-wrap: wrap;

      &__item {
        @include flex-arrangement(3);
        padding: 2em;
        border-radius: $border-radius;
        background-color: $color-white;

        @include breakpoint-lg {
          &:nth-child(3n) {
            margin-right: 0;
          }
          @include flex-arrangement(2);
        }

        @include breakpoint-sm {
          width: 100%;
          margin-right: 0 !important;

          &:nth-of-type(n + 2) {
            margin-top: $grid-gap;
          }
        }

        &__icon {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 150px;

          i {
            transform: scale(var(--ggs, 4));
          }
        }

        h4 {
          margin: calc(#{$grid-gap}/ 2) 0;
          text-align: left;
        }

        p {
          margin: 0;
          text-align: left;
        }
      }
    }
  }

  &--contact {
    background-color: $color-gray-medium;

    &__row {
      position: relative;
      width: 100%;
      margin-bottom: calc(#{$grid-gap}* 2);

      &__icon {
        position: absolute;
        bottom: 50%;
        left: 0;
        transform: translateY(50%);
        color: $color-white;

        i {
          min-width: 1.5em;
          text-align: center;
        }
      }
    }

    .button {
      min-width: 150px;
    }

    input,
    textarea {
      color: $color-white;
      border-bottom: 1px solid $color-white;

      &::placeholder {
        color: $color-white;
      }
    }

    input {
      padding-left: 2.5em;
    }
  }
}

.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 100%;
  padding: calc(#{$grid-gap}/ 1.5) $grid-gap;
  background-color: $color-gray-deep;

  .button {
    min-width: 75px;
  }

  &__about {
    position: relative;

    &__popover {
      position: absolute;
      left: 0;
      bottom: 120%;
      min-width: 200px;
      padding: 0.75em;
      font-size: $font-size-light;
      background-color: $color-white;
      border-radius: $border-radius;
      border: 1px solid $color-gray-thin;
    }
  }

  &__copyright {
    margin-left: auto;
    padding: 0 $grid-gap;
    color: $color-white;
    font-size: $font-size-thin;

    @include breakpoint-sm {
      margin-top: 0.25rem;
    }

    @include breakpoint-esm {
      margin: auto auto 0;
      line-height: 2.75;
    }
  }

  a {
    margin: 0 0.25em;
  }
}
</style>