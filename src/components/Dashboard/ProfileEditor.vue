<template>
  <div class="modal">
    <div class="modal__wrap">
      <h1 class="modal__wrap__header">資料修改</h1>
      <div class="modal__wrap__content">
        <form action="#" method="post" class="form" @submit.prevent="updateData">
          <h3 class="form__header">基本資料</h3>
          <div class="form__row">
            <div class="form__row__column">
              <div class="form__content">
                <h4 class="form__content__title">名稱</h4>
                <input type="text" name="title" placeholder="請輸入名稱" v-model="user.title" />
                <span class="form__content__alert" v-if="alert.title" v-text="alert.title" />
              </div>
            </div>
            <div class="form__row__column">
              <div class="form__content">
                <h4 class="form__content__title">聯絡電話</h4>
                <input type="tel" name="mobile" placeholder="請輸入手機號碼" v-model="user.mobile" />
                <span class="form__content__alert" v-if="alert.mobile" v-text="alert.mobile" />
              </div>
            </div>
          </div>
          <hr />
          <h3 class="form__header">
            修改密碼
            <span class="form__header__notes">無需修改則空白</span>
          </h3>
          <div class="form__row">
            <div class="form__row__column">
              <div class="form__content">
                <h4 class="form__content__title">密碼</h4>
                <input type="password" name="newPassword" placeholder="請輸入新密碼" autocomplete
                  v-model="user.newPassword" />
                <span class="form__content__alert" v-if="alert.newPassword" v-text="alert.newPassword" />
              </div>
            </div>
            <div class="form__row__column">
              <div class="form__content">
                <h4 class="form__content__title">確認密碼</h4>
                <input type="password" name="confirmPassword" placeholder="請再次輸入新密碼" autocomplete
                  v-model="user.confirmNewPassword" />
                <span class="form__content__alert" v-if="alert.confirmNewPassword" v-text="alert.confirmNewPassword" />
              </div>
            </div>
          </div>
          <div class="form__control">
            <button type="submit" class="button">
              <i class="fas fa-sync-alt"></i> 更新
            </button>
          </div>
        </form>
        <button type="button" class="button button--close" @click="closeModal">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, reactive, watch, onBeforeMount, nextTick } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const user = reactive({
      title: null,
      mobile: null,
      newPassword: null,
      confirmNewPassword: null,
    });
    const alert = reactive({
      title: null,
      mobile: null,
      newPassword: null,
      confirmNewPassword: null,
    });
    const currentUser = computed(() => {
      const userToken = sessionStorage.getItem("user");
      const user = store.state.user.users.find((item) => item.id === userToken);

      return user;
    });

    const closeModal = () => {
      return store.commit("app/showProfileEditor", { root: true });
    };

    const updateData = () => {
      const data = {
        id: currentUser.value.id,
        title: user.title,
        mobile: user.mobile,
      };

      if (!user.title || user.title.length < 1) {
        return (alert.title = "請輸入廠商名稱！");
      }

      if (!user.mobile || user.mobile.length < 1) {
        return (alert.mobile = "請輸入手機號碼！");
      }

      if (user.newPassword && user.newPassword.length > 10) {
        return (alert.newPassword = "密碼請勿超過 10 個字！");
      }

      if (!user.newPassword && user.confirmNewPassword) {
        return (alert.newPassword = "請重新設定密碼！");
      }

      if (user.newPassword) {
        if (user.newPassword !== user.confirmNewPassword) {
          return (alert.confirmNewPassword = "密碼不一致，請重新輸入！");
        } else {
          data.password = user.newPassword;
        }
      }

      store.dispatch("user/updateUserData", { data }, { root: true });
      nextTick(() => {
        closeModal();
      });
    };

    watch(user, (user) => {
      if (!user.title || user.title.length < 1) {
        user.title = null;
        alert.title = "請輸入廠商名稱！";
      } else {
        alert.title = null;
      }

      if (!user.mobile || user.mobile.length < 1) {
        user.mobile = null;
        alert.mobile = "請輸入手機號碼！";
      } else {
        alert.mobile = null;
      }

      if (!user.newPassword || user.newPassword.length < 1) {
        user.newPassword = null;
      } else {
        alert.newPassword = null;
      }

      if (user.newPassword && user.newPassword.length > 10) {
        alert.newPassword = "密碼請勿超過 10 個字！";
      }

      if (!user.confirmNewPassword || user.confirmNewPassword.length < 1) {
        user.confirmNewPassword = null;
      } else {
        alert.confirmNewPassword = null;
      }

      if (user.confirmNewPassword !== user.newPassword) {
        alert.confirmNewPassword = "密碼不一致，請重新輸入！";
      }
    });

    onBeforeMount(() => {
      user.title = currentUser.value.title;
      user.mobile = currentUser.value.mobile;
    });

    return { user, alert, closeModal, updateData };
  },
};
</script>