<template>
  <router-view />
  <ScrollToTop />
</template>

<script>
import { onBeforeMount, onMounted } from "vue";
import { useStore } from "vuex";
import ScrollToTop from "@/components/ScrollToTop";

export default {
  components: {
    ScrollToTop,
  },
  setup() {
    const store = useStore();
    const checkScrolling = () => {
      if (window.pageYOffset > 0) {
        return store.commit("triggerScrolling", true, { root: true });
      } else {
        return store.commit("triggerScrolling", false, { root: true });
      }
    };

    onBeforeMount(() => {
      store.dispatch("member/getMembers", { root: true });
      store.commit("app/computedPanelDataCount", { root: true });
      store.commit("goods/computedGoodsStock", { root: true });
    });

    onMounted(() => {
      window.addEventListener("scroll", () => {
        checkScrolling();
      });
    });

    return { checkScrolling };
  },
};
</script>

<style lang="scss">
@import "./assets/scss/base.scss";
</style>