<template>
  <span>{{ props.categoryName }}</span>
</template>

<script setup>
const props = defineProps({
  categoryName: {
    type: String,
    default: "分類",
  },
});
</script>

<style lang="scss" scoped>
@import "../../common/style/color.scss";
span {
  font-size: 1.4rem;
  background-color: $primary-color;
  color: $primary-light;
  padding: 0.25rem 0.25rem;
  border-radius: 3px;
}
</style>
