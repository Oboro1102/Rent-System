<template>
  <div class="container">
    <div class="container__icon"><i class="fas fa-exclamation-circle"></i></div>
    <h1>
      您欲前往的頁面<span class="text-yellow">不存在</span>或<span
        class="text-yellow"
        >無權訪問</span
      ><br />如有問題請聯絡管理員<span
        style="display: inline-block; transform: rotate(10deg)"
        >！</span
      >
    </h1>
    <button type="button" class="button" @click="routerTo">回到首頁</button>
  </div>
</template>

<script>
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();
    const routerTo = () => {
      const isLogin = sessionStorage.getItem("token") === "ImLogin";
      if (isLogin) {
        router.push({ name: "Dashboard" });
      } else {
        router.push({ name: "Index" });
      }
    };

    return { routerTo };
  },
};
</script>

<style lang="scss" scoped>
.button {
  width: 150px;
  margin: 0 auto;
}

.container {
  position: relative;
  z-index: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
  padding: $grid-gap;
  color: $color-white;

  &::after {
    position: absolute;
    top: 0;
    left: 0;
    z-index: $layer-lv0;
    width: 100%;
    height: 100vh;
    content: "";
    background-color: rgba(0, 0, 0, 0.75);
    background-image: url("../assets/img/jonas-jacobsson-1iTKoFJvJ6E-unsplash.jpg");
    background-blend-mode: multiply;
    background-size: cover;
    background-position: center;
  }

  &__icon {
    text-align: center;
    line-height: 1;
    font-size: 15vmax;
    animation: zooming 2s infinite linear;
    color: $color-white;
  }

  h1 {
    margin: 0.5em auto;
    font-size: 4vmax;
    font-weight: $font-weight-black;
    text-align: center;
    line-height: 1.25;
  }
}
</style>