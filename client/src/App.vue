<template>
  <div class="container">
    <router-view></router-view>
    <n-divider />
    <div class="footer">&copy;2023 Ma-HSiang. All Rights Reserved</div>
  </div>
</template>

<script setup>
import { defineComponent, ref, provide } from "vue";
import { NDivider } from "naive-ui";
defineComponent({ NDivider });
const isReload = ref(false);

provide("isReload", isReload);
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  .footer {
    text-align: center;
    margin: 20px 0;
    color: #4646467a;
  }
}
</style>
