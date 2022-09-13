<template>
  <nav class="navbar-top" :class="{ 'navbar-top--scrolling': scrolling }">
    <div class="navbar-top__menu__trigger" @click="triggerMenu()" v-if="!windowInnerWidth">
      <i class="fas fa-bars" v-if="!sideMenu"></i>
      <i class="fas fa-times-circle" v-else></i>
    </div>
    <ul class="navbar-top__menu">
      <li class="navbar-top__menu__item" v-if="routeName !== 'Balance' && routeName !== 'Home'">
        <div class="navbar-top__menu__link cardView" :class="{ 'navbar-top__menu__link--active': dataView === 'card' }"
          @click="changeView('card')">
          <i class="fas fa-th"></i>
        </div>
      </li>
      <li class="navbar-top__menu__item" v-if="routeName !== 'Balance' && routeName !== 'Home'">
        <div class="navbar-top__menu__link tableView"
          :class="{ 'navbar-top__menu__link--active': dataView === 'table' }" @click="changeView('table')">
          <i class="fas fa-th-list"></i>
        </div>
      </li>
      <li class="navbar-top__menu__item" v-if="panelState.filter((item) => item.count > 0).length > 0">
        <div class="navbar-top__menu__link noti" tabindex="-1" @focus="callNotification" @blur="callNotification">
          <span class="notification"></span>
          <i class="far fa-bell"></i>
        </div>
        <transition name="slideDown" mode="out-in" appear>
          <Notification v-if="
            showNotification &&
            panelState.filter((item) => item.count > 0).length > 0
          " />
        </transition>
      </li>
      <li class="navbar-top__menu__item">
        <div class="navbar-top__menu__link account" @click="editProfile">
          <i class="fas fa-cog"></i>
        </div>
      </li>
      <li class="navbar-top__menu__item">
        <button type="button" class="navbar-top__menu__link logout" @click="logout">
          <i class="fas fa-sign-out-alt"></i>
        </button>
      </li>
    </ul>
  </nav>
  <transition name="slideLeft" mode="out-in" appear>
    <nav class="navbar-side" :class="{ noTextMenu: !sideMenu }" v-if="windowInnerWidth || sideMenu">
      <ul class="navbar-side__menu">
        <li class="navbar-side__menu__item">
          <router-link class="navbar-side__menu__link" to="home" :class="{ home: !sideMenu }"
            @click="closeMenuOnMobile">
            <i class="fas fa-house-user"></i>
            <span v-if="sideMenu">首頁</span>
          </router-link>
        </li>
        <hr v-if="windowInnerWidth" />
        <li class="navbar-side__menu__item" v-for="(item, index) in routers" :key="index">
          <router-link class="navbar-side__menu__link" :to="item.link" :class="{ [item.link]: !sideMenu }"
            @click="closeMenuOnMobile">
            <i :class="item.icon"></i>
            <span v-if="sideMenu" v-text="item.title" />
          </router-link>
        </li>
        <hr v-if="windowInnerWidth" style="margin-top: auto" />
        <li class="navbar-side__menu__item">
          <span class="navbar-side__menu__link" @click="triggerMenu()" :class="{ extendMenu: !sideMenu }"
            v-if="windowInnerWidth">
            <i class="fas fa-outdent" :class="{ flip: !sideMenu }"></i>
            <span v-if="sideMenu">收合選單</span>
          </span>
        </li>
      </ul>
    </nav>
  </transition>
  <teleport to="body">
    <transition name="slideRight" mode="out-in" appear>
      <ProfileEditor v-if="showProfileEditor" />
    </transition>
  </teleport>
</template>

<script>
import { computed, ref, watch, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import ProfileEditor from "@/components/Dashboard/ProfileEditor";
import Notification from "@/components/Dashboard/Notification";

export default {
  components: {
    ProfileEditor,
    Notification,
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    const windowWidth = ref(0);
    const windowRWDWidth = ref(991.98);

    const scrolling = computed(() => {
      return store.state.scrolling;
    });
    const routers = computed(() => {
      return store.state.app.router;
    });
    const routeName = computed(() => {
      return store.state.app.currentRoute;
    });
    const sideMenu = computed(() => {
      return store.state.app.showSideMenu;
    });
    const dataView = computed(() => {
      return store.state.app.viewSwitch;
    });
    const showProfileEditor = computed(() => {
      return store.state.app.showProfileEditor;
    });
    const showNotification = computed(() => {
      return store.state.app.showNotification;
    });
    const panelState = computed(() => {
      return store.state.app.panelData;
    });
    const windowInnerWidth = computed(() => {
      return windowWidth.value >= windowRWDWidth.value;
    });

    const triggerMenu = (data) => {
      return store.commit("app/triggerSideMenu", data, { root: true });
    };

    const logout = () => {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      router.push({ name: "Index" });
    };

    const editProfile = () => {
      return store.commit("app/showProfileEditor", { root: true });
    };
    const callNotification = () => {
      return store.commit("app/showNotification", { root: true });
    };
    const closeMenuOnMobile = () => {
      if (windowWidth.value < windowRWDWidth.value) {
        return triggerMenu(false);
      }
    };
    const changeView = (status) => {
      return store.commit("app/triggerViewSwitch", status, { root: true });
    };

    watch(
      [showProfileEditor, windowWidth, windowRWDWidth],
      ([showProfileEditor, windowWidth, windowRWDWidth]) => {
        showProfileEditor
          ? document.querySelector("html").classList.add("scrollFixed")
          : document.querySelector("html").removeAttribute("class");

        windowWidth < windowRWDWidth ? triggerMenu(false) : triggerMenu(true);
      }
    );

    onMounted(() => {
      windowWidth.value = window.innerWidth;

      window.addEventListener("resize", () => {
        windowWidth.value = window.innerWidth;
      });
    });

    return {
      scrolling,
      routers,
      routeName,
      sideMenu,
      dataView,
      showProfileEditor,
      showNotification,
      windowInnerWidth,
      panelState,
      triggerMenu,
      logout,
      editProfile,
      callNotification,
      closeMenuOnMobile,
      changeView,
    };
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  &-top {
    @include fixed-object;
    top: $grid-gap;
    right: $grid-gap;
    z-index: $layer-lv5;
    display: flex;
    align-items: center;
    width: auto;
    height: $navbar-height;
    padding: 0 $grid-gap;
    background-color: $color-nav-top-bg;
    border-radius: $border-radius;
    transition: $transition-fast;

    @include breakpoint-lg {
      top: 0;
      right: 0;
      width: 100%;
      border-radius: 0;
    }

    &--scrolling {
      box-shadow: $box-shadow;
    }

    &__menu {
      @include list-style;
      margin-left: auto;

      &__trigger {
        display: flex;
        align-items: center;
        margin-right: 1rem;
        color: $color-nav-link;
        font-size: $font-size-bold;
        cursor: pointer;
        transition: $transition-fast;

        &:hover {
          color: $color-nav-link-hover;
          transition: $transition-fast;
        }
      }

      &__item {
        position: relative;
        display: inline-block;
        margin-right: $grid-gap;
        text-align: center;

        &:last-child {
          margin-right: 0;
        }
      }

      &__link {
        @include link-style;
        position: relative;
        color: $color-nav-link;
        font-size: $font-size-bold;

        &:hover {
          color: $color-nav-link-hover;

          &::after {
            position: absolute;
            top: 105%;
            right: 50%;
            transform: translateX(50%);
            display: inline-block;
            width: 5em;
            color: $color-white;
            background-color: $color-nav-link-popover;
            border-radius: $border-radius-round;
            font-size: $font-size-light;
            text-align: center;

            @include breakpoint-lg {
              top: auto;
              bottom: -1.5rem;
            }
          }
        }

        &--active {
          color: $color-nav-link-hover;
        }
      }
    }
  }

  &-side {
    @include fixed-object;
    top: $grid-gap;
    left: $grid-gap;
    z-index: $layer-lv4;
    width: $navbar-meun-left-width;
    height: calc(100vh - #{$grid-gap}* 2);
    padding: $grid-gap 0;
    background-color: $color-nav-side-bg;
    border-radius: $border-radius;
    transition: $transition-fast;

    @include breakpoint-lg {
      top: $navbar-height;
      left: 0;
      width: 100%;
      height: auto;
      padding: calc(#{$grid-gap}/ 2) $grid-gap;
      border-radius: 0;
    }

    &.noTextMenu {
      width: $grid-width;
      transition: $transition-fast;

      .navbar-side__menu__link {
        justify-content: center;
        height: 28px;

        i {
          margin-right: 0;
        }
      }
    }

    &__menu {
      @include list-style;
      display: flex;
      flex-direction: column;
      height: 100%;

      @include breakpoint-lg {
        flex-direction: row;
        align-items: center;
        overflow-x: auto;
      }

      hr {
        width: 50%;
      }

      &__item {
        margin-bottom: $grid-gap;

        &:first-child,
        &:last-child {
          margin-bottom: 0;
        }

        @include breakpoint-lg {
          margin-bottom: 0;
          margin-right: $grid-gap;

          &:last-child {
            margin-right: 0;
          }
        }
      }

      &__link {
        @include link-style;
        position: relative;
        display: flex;
        align-items: center;
        padding: 0 $grid-gap;
        color: $color-nav-link;
        font-weight: $font-weight-medium;
        white-space: nowrap;
        transition: $transition-fast;

        @include breakpoint-lg {
          padding: 0;
        }

        &:hover {
          color: $color-nav-link-hover;
          transition: $transition-fast;
        }

        &::before {
          position: absolute;
          top: 0;
          bottom: 0;
          right: 0;
          z-index: $layer-lv0;
          content: "";
          margin: auto 0;
          width: 0;
          height: auto;
          transition: $transition-fast;
        }

        &::after {
          position: absolute;
          bottom: 105%;
          right: 0;
          left: 0;
          margin: 0 auto;
          width: 5em;
          color: $color-white;
          background-color: $color-nav-link-popover;
          border-radius: $border-radius-round;
          font-size: $font-size-light;
          font-weight: $font-weight-light;
          text-align: center;
        }

        i {
          min-width: 1.5em;
          margin-right: 0.5em;
          font-size: $font-size-bold;
          text-align: center;

          &.flip {
            transform: scaleX(-1);
          }
        }
      }
    }
  }
}

.notification {
  display: block !important;
  position: absolute;
  top: 6px;
  right: -3px;
  width: 10px;
  height: 10px;
  border-radius: $border-radius-round;
  background-color: $color-red;
  animation: zooming 0.5s infinite ease-in-out;
}

.router-link-active {
  color: $color-nav-link-hover;

  @include breakpoint-lg {
    color: $color-yellow;
  }

  &::before {
    width: 92.5%;
    height: 150%;
    background-color: $color-site-bg;
    border-radius: $border-radius-round 0 0 $border-radius-round;
    transition: $transition-fast;

    @include breakpoint-lg {
      width: auto;
      height: auto;
      background-color: transparent;
      border-radius: 0;
    }
  }
}

// popover 標籤
.cardView {
  &:hover {
    &::after {
      content: "卡片瀏覽";
    }
  }
}

.tableView {
  &:hover {
    &::after {
      content: "表格瀏覽";
    }
  }
}

.noti {
  &:hover {
    &::after {
      content: "即時通知";
    }
  }
}

.account {
  &:hover {
    &::after {
      content: "資料修改";
    }
  }
}

.home {
  &:hover {
    &::after {
      content: "首頁";
    }
  }
}

.goods {
  &:hover {
    &::after {
      content: "物件管理";
    }
  }
}

.iou {
  &:hover {
    &::after {
      content: "租借管理";
    }
  }
}

.balance {
  &:hover {
    &::after {
      content: "帳務核對";
    }
  }
}

.analysis {
  &:hover {
    &::after {
      content: "營銷圖表";
    }
  }
}

.member {
  &:hover {
    &::after {
      content: "會員查詢";
    }
  }
}

.extendMenu {
  &:hover {
    &::after {
      content: "展開選單";
    }
  }
}

.logout {
  padding: 0;
  background-color: transparent;

  &:hover {
    &::after {
      content: "登出系統";
    }
  }
}
</style>
