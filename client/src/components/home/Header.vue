<template>
  <div class="title_container">
    <!-- <img :src="headerImg" alt="" /> -->
    <div>
 
      <span class="text_title"><slot name="title"></slot></span>
      <span class="text_subtitle"><slot name="subtitle"></slot></span>
    </div>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.title_container {
  display: flex;
  align-items: center;
  justify-content: center;

  div {
    display: flex;
    flex-direction: column;
    text-align: center;

    .text_title {
      font-size: 6rem;
      font-weight: 300;
    }
    .text_subtitle {
      font-size: 1.2rem;
      font-weight: 100;
    }
  }
}
</style>
