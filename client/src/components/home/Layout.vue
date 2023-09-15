<template>
  <div class="container">
    <header class="header-container">
      <slot name="nav"></slot>
    </header>

    <section class="hot-container" v-if="props.hot_open">
      <slot name="hot_blog"></slot>
    </section>

    <main class="main-container">
      <article class="left-container">
        <slot name="article"></slot>

        <div class="paginator-container">
          <slot name="paginator"></slot>
        </div>
      </article>

      <div class="right-content">
        <slot name="new_blog"></slot>
      </div>
    </main>

    <footer>
      <div class="footer">&copy;2023 Ma-HSiang. All Rights Reserved</div>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
const props = defineProps({
  hot_open: {
    type: Boolean,
    default: true,
  },
});
</script>

<style lang="scss" scoped>
@import "../../common/style/color.scss";

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10rem;
  margin-bottom: 2rem;
  background-color: $primary-color;
  font-size: 2rem;
  letter-spacing: 2.5px;
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.2);
}
.hot-container {
  display: grid;
  grid-template-columns: 1fr 0.5fr 0.5fr;
  height: 45rem;
  column-gap: 1rem;
  padding: 0 1rem;
}
.main-container {
  max-width: 130rem;
  display: grid;
  grid-template-columns: 1fr 0.5fr;
  margin: 0 auto;
  column-gap: 5rem;
  .paginator-container {
    padding-bottom: 1rem;
  }

  .left-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
}
.right-content {
  display: flex;
  flex-direction: column;
}

.footer {
  font-size: 1.4rem;
  letter-spacing: 1.4px;
  background-color: #1f2937;
  color: $font-light-gray;
  text-align: center;
  padding: 2.5rem 0;
}
</style>
