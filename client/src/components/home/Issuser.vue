<template>
  <div>
    <n-thing>
      <template #avatar>
        <n-avatar
          round
          size="small"
          :src="
            issuser.avatar
              ? issuser.avatar
              : '/src/assets/public/default/user01.jpg'
          "
        />
      </template>
      <template #header>
        <div class="text">
          <span>{{ issuser.account }}</span> ‧
          <span>{{ props.createTime }}</span>
        </div>
      </template>
    </n-thing>
  </div>
</template>

<script setup>
import { defineComponent, ref, inject, watchEffect } from "vue";
import { useRouter, onBeforeRouteUpdate } from "vue-router";
import { NThing, NAvatar } from "naive-ui";
import { useAuthLogin } from "../../store/user/auth";
import { useAuthCategory } from "../../store/category/operate";
import { useAuthArticle } from "../../store/article/list";
import { CaretBackOutline } from "@vicons/ionicons5";
const $axios = inject("$axios");
const authArticle = useAuthArticle();
const router = useRouter();

//獲取uid
const props = defineProps({
  uid: {
    type: String,
    default: "",
  },
  createTime: {
    type: String,
    default: "",
  },
});

//發文者
const issuser = ref([]);
async function loadAdminData() {
  issuser.value = await authArticle.queryIssuer(props.uid);

}

watchEffect(() => {
  loadAdminData();
});
</script>
<style lang="scss" scoped>
div {
  .text {
    line-height: 2.2rem;
  }
}
</style>
