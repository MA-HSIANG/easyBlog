<template>
  <n-spin size="large">
    <template #description>
      <slot></slot>
    </template>
  </n-spin>
</template>

<script setup>
import { NSpin } from "naive-ui";
</script>
