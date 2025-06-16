<!-- frontend/src/pages/stories/Stories.vue -->
<template>
  <div class="stories-container">
    <h1>{{ pageTitle }}</h1>
    <p>Đây là trang {{ pageType }} của TruyenVietHay.</p>
    <!-- Sau này bạn có thể thêm danh sách truyện ở đây -->
  </div>
</template>

<script>
export default {
  name: "Stories",
  computed: {
    pageTitle() {
      return this.$route.name === "TruyenChu" ? "Truyện Chữ" : "Truyện Tranh";
    },
    pageType() {
      return this.$route.name === "TruyenChu" ? "truyện chữ" : "truyện tranh";
    },
  },
};
</script>

<style scoped>
.stories-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #1a1a1a;
  color: #ffffff;
  text-align: center;
  padding: 20px;
}

h1 {
  font-size: 2.5rem;
  color: #32cd32;
  margin-bottom: 20px;
}

p {
  font-size: 1.2rem;
  color: #cccccc;
}
</style>