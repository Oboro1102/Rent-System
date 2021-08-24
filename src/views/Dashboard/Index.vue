<template>
  <RouterLoading />
  <Navbar />
  <div class="main" :class="{ noSideMenu: !sideMenu }">
    <router-view v-slot="{ Component }">
      <transition name="slideRight" mode="out-in" appear>
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
  <Footer />
</template>

<script>
import { computed, ref, onUpdated, onBeforeMount } from "vue";
import { useStore } from "vuex";
import { useRoute, onBeforeRouteUpdate } from "vue-router";
import Navbar from "@/components/Dashboard/Navbar";
import Footer from "@/components/Dashboard/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import RouterLoading from "@/components/RouterLoading";

export default {
  components: {
    Navbar,
    Footer,
    ScrollToTop,
    RouterLoading,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const routeName = ref(null);
    const sideMenu = computed(() => {
      return store.state.app.showSideMenu;
    });

    onUpdated(() => {
      store.commit("app/checkCurrentRoute", route.name, {
        root: true,
      });
    });

    onBeforeMount(() => {
      store.commit("app/checkCurrentRoute", route.name, {
        root: true,
      });
    });

    onBeforeRouteUpdate(() => {
      store.commit("app/triggerViewSwitch", "card", { root: true });
    });

    return { routeName, sideMenu };
  },
};
</script>

<style lang="scss">
@import "@/assets/scss/modal.scss";
@import "@/assets/scss/form.scss";
@import "@/assets/scss/card.scss";
@import "@/assets/scss/table.scss";
</style>

<style lang="scss" scoped>
.noSideMenu {
  width: calc(100% - #{$grid-width} - #{$grid-gap});

  @include breakpoint-lg {
    width: 100%;
  }
}
</style>