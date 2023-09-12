<template>
  <div class="dashBoard-container">
    <div class="card-container">
      <n-card
        class="card"
        header-style="background-color:#0284c7;border-radius:6px 0 0 6px"
      >
        <template #header>
          <div class="card--header-container">
            <span v-if="isUpdate">圖片最大5MB</span>
            <slot name="uploadAvatar">
              <div class="card--avatar-container">
                <img :src="props.userDatas.avatar" alt="" />
              </div>
            </slot>

            <div class="card--header-content">
              <h4>註冊時間</h4>
              <p>{{ props.userDatas.create_time }}</p>
              <h4>點讚數量</h4>
              <p>{{ props.likeCount }}</p>
            </div>
          </div>
        </template>
        <template #default>
          <div class="card--content-container">
            <h4>編號</h4>
            <p>{{ props.userDatas.id }}</p>
            <h4>姓名</h4>
            <p>{{ props.userDatas.name }}</p>

            <h4>郵件</h4>
            <slot name="update">
              <p>{{ props.userDatas.email }}</p>
            </slot>
          </div>
        </template>
      </n-card>
    </div>
    <div class="btn--upload-container" v-if="props.isUpdate">
      <slot name="save"></slot>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  userDatas: {
    type: Object,
    default: "user",
  },
  likeCount: {
    type: Number,
    default: 0,
  },
  isUpdate: {
    type: Boolean,
    defautl: false,
  },
});
</script>
<style lang="scss" scoped>
@import "../../common/style/main.scss";
@import "../../common/style/color.scss";
@import "../../common/style/userCardRwd.scss";
.dashBoard-container {
  .card-container {
    width: 100rem;
    .n-card {
      display: flex;
      flex-direction: row;
      border-radius: 6px;
      .card--header-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        border: 2px solid $primary-color;
        gap: 1rem;
        width: 9rem;
        border: 2px solid $primary-color;
        .card--avatar-container {
          background-color: #fff;
          overflow: hidden;
          border-radius: 50%;
          height: 8rem;
          img {
            height: 100%;
            width: 100%;
          }
        }
        span {
          font-size: 0.5rem;
          color: $primary-light;
        }

        .card--header-content {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          letter-spacing: 1.1px;
          line-height: 1.3;
          color: $primary-light;
          h4 {
            font-size: 1.6rem;
            font-weight: 400;
            color: $primary-light;
          }
          p {
            font-size: 1.4rem;
            font-weight: 300;
          }
        }
      }

      .card--content-container {
        padding: 2rem 20rem;
        line-height: 2;
        h4 {
          font-size: 2rem;
          font-weight: 500;
          color: $font-black;
          letter-spacing: 1.1px;
        }
        p {
          font-size: 1.8rem;
          color: $font-gray;
        }
      }
    }
  }

  .btn--upload-container {
    display: flex;
    justify-content: end;
    margin-top: 1rem;
    width: 100rem;
  }
}
</style>
