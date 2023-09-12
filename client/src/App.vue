<template>
  <NConfigProvider :theme-overrides="themeOverrides">
    <RouterView v-if="isReload" v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component" />
      </transition>
    </RouterView>
  </NConfigProvider>
</template>

<script setup>
import { defineComponent, ref, provide, inject, nextTick } from "vue";
import { NDivider, NConfigProvider } from "naive-ui";
import Layout from "../src/components/home/Layout.vue";
import NewDetail from "../src/pages/NewDetail.vue";
import DashBoardLayout from "../src/components/dashBoard/DashBoardLayout.vue";
defineComponent({ NDivider, Layout, NewDetail, DashBoardLayout });
const isReload = ref(true);

const onReload = () => {
  nextTick(() => {
    isReload.value = false;
    setTimeout(() => {
      isReload.value = true;
    }, 10);
  });
};
provide("onReload", onReload);
const themeOverrides = {
  common: {
    primaryColor: "#0284c7",
    errorColor: "#ef4444",
    successColor: "#10b981",
    primaryColorHover: "#60a5fa",
    errorColorHover: "#f87171",
    primaryColorPressed: "#0284c7",
    warningColor: "#f0a020",
    borderRadius: "6px",
    fontSize: "16px",
    heightMini: "18px",
    heightTiny: "20px",
    heightSmall: "25px",
    heightMedium: "30px",
    heightLarge: "36px",
    heightHuge: "48px",
  },
  Button: {
    textColor: "#6b7280",
  },
};
</script>

<style lang="scss" scoped>
@import "./common/style/main.scss";

.fade-enter-active {
  transition: all 0.6s ease-in;
}
.fade-leave-active {
  transition: all 0.6s cubic-bezier(1, 0.5, 0.6, 1);
}
.fade-leave-to,
.fade-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
</style>
