<template>
  <div class="container">
    <header class="header-container">
      <h1><slot name="title"></slot></h1>
    </header>

    <div class="card-container">
      <n-card>
        <slot name="form"></slot>
        <div class="card--btn-container">
          <SecondButton @click="toHome">
            <template #name> 返回首頁 </template>
          </SecondButton>
        </div>
      </n-card>
    </div>
  </div>
</template>

<script setup>
import SecondButton from "../components/common/SecondButton.vue";
import { useRouter } from "vue-router";
const router = useRouter();
const toHome = () => {
  router.push("/");
};
</script>

<style lang="scss" scoped>
@import "../common/style/main.scss";
@import "../common/style/color.scss";
@import "../common/style/signupRwd.scss";
.container {
  min-height: 100vh;
  background-image: linear-gradient(
      rgba(27, 27, 27, 0.6),
      rgba(17, 17, 17, 0.8)
    ),
    url("../assets/public/other/pexels-christina-morillo-1181243.jpg");
  background-size: cover;
  background-position: center;

  .header-container {
    padding: 5rem 0;
    h1 {
      font-size: 4.6rem;
      font-weight: 500;
      letter-spacing: 1.2px;
      color: $font-light-gray;
      text-align: center;
    }
  }
  .card-container {
    display: flex;
    align-items: center;
    justify-content: center;

    .n-card {
      max-width: 40rem;
      border-radius: 6px;

      .n-form {
        display: flex;
        flex-direction: column;
        gap: 1.8rem;

        .btn_submit {
          .n-button {
            width: 100%;
            font-size: 1.8rem;
          }
        }
        .btn_change {
          text-align: center;
          margin-top: 2rem;
          .n-button {
            font-size: 1.6rem;
            color: $font-gray;
            letter-spacing: 1.2px;
            &:hover {
              color: $primary-color;
            }
          }
        }
      }
      .card--btn-container {
        text-align: center;
        margin-top: 1rem;
        .n-button {
          width: 45%;
        }
      }
    }
  }
}
</style>
