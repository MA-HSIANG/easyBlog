<template>
  <div class="container">
    <div class="avatar-container" v-if="props.show">
      <img :src="props.avatar" alt="" />
    </div>
    <div class="blog-data">
      <span>{{ props.user_name }}</span>
      <span>{{ props.createTime }}</span>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { CaretBackOutline } from "@vicons/ionicons5";

const router = useRouter();

const props = defineProps({
  user_name: {
    type: String,
    default: "superAdmin",
    required: true,
  },
  createTime: {
    type: String,
    default: new Date(),
  },
  avatar: {
    type: String,
  },
  show: {
    type: Boolean,
    default: true,
  },
});
</script>
<style lang="scss" scoped>
@import "../../common/style/main.scss";
@import "../../common/style/color.scss";
.container {
  display: flex;

  .avatar-container {
    display: flex;
    width: 3rem;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 10px;
    margin-top: 1rem;
    img {
      width: 100%;
    }
  }
  .blog-data {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.2rem;
    letter-spacing: 1.1px;
    color: $font-gray;

    span:nth-child(1) {
      &::after {
        content: "";
        display: inline-block;
        width: 3px;
        height: 3px;
        background-color: #666;
        transform: translate(50%, -50%);
      }
    }
    span:nth-child(2) {
      font-size: 1.1rem;
    }
  }
}
</style>
