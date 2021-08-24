<template>
  <button
    type="button"
    class="button loginButton"
    @click="triggerLoginFormModel(true)"
  >
    <i class="far fa-user"></i>
    <span>登入</span>
  </button>
  <teleport to="body">
    <transition name="slideLeft" mode="out-in" appear>
      <div
        class="login"
        @click.self="triggerLoginFormModel(false)"
        v-if="showLoginForm"
      >
        <div class="login__wrap">
          <h4 class="login__title">
            <i class="fas fa-door-open"></i> 用戶登入
          </h4>
          <form
            action="#"
            class="login__form"
            method="post"
            @submit.prevent="login"
          >
            <div class="login__form__row">
              <span class="login__form__row__icon">
                <i class="fas fa-user"></i>
              </span>
              <input
                type="text"
                name="username"
                placeholder="請輸入帳號"
                inputmode="text"
                v-model="username"
              />
              <span class="login__form__row__alert" v-if="alert.username">
                {{ alert.username }}
              </span>
            </div>
            <div class="login__form__row">
              <span class="login__form__row__icon">
                <i class="fas fa-lock"></i>
              </span>
              <input
                type="password"
                name="password"
                placeholder="請輸入密碼"
                inputmode="text"
                autocomplete
                v-model="password"
              />
              <span class="login__form__row__alert" v-if="alert.password">
                {{ alert.password }}
              </span>
            </div>
            <h2 class="login__title notice">
              示範使用者<small>（功能示範，請選擇使用者進入系統操作）</small>
            </h2>
            <div class="login__form__row identity">
              <button
                type="button"
                class="button"
                v-for="item in users"
                :key="item.id"
                @click="setUser(item)"
              >
                {{ item.title }}
              </button>
            </div>
            <div class="login__form__row">
              <button
                type="submit"
                class="button"
                style="width: 47.5%; margin-right: auto"
              >
                登入
              </button>
              <button
                type="button"
                class="button button--refuse"
                style="width: 47.5%"
                @click="triggerLoginFormModel(false)"
              >
                關閉
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
import { computed, ref, reactive, watch } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
  setup() {
    const store = useStore();
    const router = useRouter();

    const username = ref("");
    const password = ref("");
    const alert = reactive({
      username: null,
      password: null,
    });

    const showLoginForm = computed(() => {
      return store.state.loginFormModel;
    });
    const users = computed(() => {
      return store.state.user.users;
    });

    const triggerLoginFormModel = (show) => {
      return store.commit("triggerLoginFormModel", show, { root: true });
    };
    const setUser = (data) => {
      username.value = data.username;
      password.value = data.password;
    };

    const login = () => {
      const storeUrl = store.state.user.users;
      const checkAccount = storeUrl.find(
        (item) => item.username === username.value
      );
      const checkPassword = storeUrl.find(
        (item) => item.password === password.value
      );

      if (username.value.length === 0 || username.value === "") {
        return (alert.username = "請輸入帳號！");
      }

      if (password.value.length === 0 || password.value === "") {
        return (alert.password = "請輸入密碼！");
      }

      if (username.value.length > 10) {
        return (alert.username = "帳號請勿超過 10 個字，請重新輸入。");
      }

      if (password.value.length > 10) {
        return (alert.password = "密碼請勿超過 10 個字，請重新輸入。");
      }

      if (checkAccount === undefined || checkPassword === undefined) {
        return window.alert("帳號密碼有誤，請重新輸入。");
      } else {
        sessionStorage.setItem("token", "ImLogin");
        sessionStorage.setItem("user", checkAccount.id);
        router.push({ name: "Dashboard" });
        triggerLoginFormModel(false);
      }
    };

    watch(showLoginForm, (showLoginForm) => {
      showLoginForm
        ? document.querySelector("html").classList.add("scrollFixed")
        : document.querySelector("html").removeAttribute("class");
    });

    watch([username, password], ([username, password]) => {
      if (username.length !== 0) {
        alert.username = null;
      }
      if (username.length > 10) {
        alert.username = "帳號請勿超過 10 個字！";
      }
      if (password.length !== 0) {
        alert.password = null;
      }
      if (password.length > 10) {
        alert.password = "密碼請勿超過 10 個字！";
      }
    });

    return {
      triggerLoginFormModel,
      showLoginForm,
      username,
      password,
      users,
      alert,
      setUser,
      login,
    };
  },
};
</script>

<style lang="scss" scoped>
.loginButton {
  @include fixed-object;
  bottom: calc(10vh + 3rem + 3vh);
  right: 0;
  z-index: $layer-lv2;
  display: flex;
  flex-direction: column;
  width: 5rem;
  min-height: 3rem;
  padding: 0.5em $grid-gap;
  font-size: $font-size-bold;
  border-radius: $border-radius 0 0 $border-radius;

  span {
    margin-top: 0.5em;
    line-height: 1;
    font-size: $font-size-light;
    font-weight: $font-weight-light;
  }
}

.login {
  @include fixed-object;
  z-index: $layer-lv4;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  padding: $grid-gap;
  background-color: rgba(0, 0, 0, 0.95);

  &__wrap {
    width: 55%;
    padding: $grid-gap;
    background-color: $color-white;
    border-radius: $border-radius;

    @include breakpoint-lg {
      width: 75%;
    }

    @include breakpoint-md {
      width: 100%;
    }
  }

  &__title {
    width: 100%;
    margin: 0 0 calc(#{$grid-gap}* 1.5);
    font-size: calc(#{$font-size-black}* 1.5);
    font-weight: $font-weight-black;
    text-align: center;

    &.notice {
      margin-bottom: calc(#{$grid-gap}/ 2);
      color: $color-pink;
      font-size: $font-size-bold;
      font-weight: $font-weight-bold;
      text-align: left;

      small {
        color: $color-green;
        font-size: $font-size-light;
        font-weight: $font-weight-medium;
      }
    }
  }

  &__form {
    width: 100%;

    &__row {
      position: relative;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      margin-bottom: calc(#{$grid-gap}* 1.5);

      &:last-child {
        margin-bottom: 0;
      }

      input {
        padding: 0 1rem 0 2.5rem;
      }

      &__icon {
        position: absolute;
        bottom: 50%;
        transform: translateY(50%);
        left: 0.8em;
      }

      &__alert {
        position: absolute;
        top: 105%;
        right: 0;
        color: $color-red;
        font-size: $font-size-light;
      }

      &.identity {
        .button {
          padding: 0 1em;
          margin-right: 1rem;
          margin-bottom: 1rem;

          &:last-of-type {
            margin-right: 0;
          }
        }
      }
    }
  }
}
</style>