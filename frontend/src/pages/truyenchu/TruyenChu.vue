<!-- frontend/src/pages/truyenchu/TruyenChu.vue -->
<template>
  <div class="truyenchu-container">
    <!-- Sử dụng component AppHeader -->
    <AppHeader />

    <!-- Nội dung chính -->
    <main class="main-content">
      <!-- Notification Board -->
      <NotificationBoard />

      <!-- Story Packages -->
      <StoryPackages :category="category" :stories="displayStories" />
    </main>
  </div>
  <AppFooter />
</template>

<script>
// Import component AppHeader, NotificationBoard và StoryPackages
import AppHeader from "@/components/AppHeader.vue";
import NotificationBoard from "@/components/NotificationBoard.vue";
import StoryPackages from "@/components/StoryPackages.vue";
import AppFooter from "@/components/AppFooter.vue";
// import { getAllStories, getChaptersByStoryId } from "@/api/story";

export default {
  name: "TruyenChuPage",
  components: {
    AppHeader,
    NotificationBoard,
    StoryPackages,
    AppFooter,
  },
  data() {
    return {
      category: "Truyện Mới",
      stories: [],
      displayStories: [],
    };
  },
  mounted() {
    this.fetchStories();
  },
  methods: {
    async fetchStories() {
      // Tạm thời bỏ gọi API vì backend trả 404
      /*
      try {
        // Lấy tất cả truyện
        const stories = await getAllStories();
        console.log("Stories fetched:", stories);

        // Gọi API để lấy số chương cho từng truyện
        const storiesWithChapters = await Promise.all(
          stories.map(async (story) => {
            try {
              const chapters = await getChaptersByStoryId(story.id);
              return {
                ...story,
                chapterCount: chapters.length,
              };
            } catch (error) {
              console.error(`Error fetching chapters for story ${story.id}:`, error);
              return {
                ...story,
                chapterCount: 0,
              };
            }
          })
        );

        // Sắp xếp theo thời gian cập nhật (mới nhất → cũ nhất)
        const sortedStories = storiesWithChapters.sort((a, b) => {
          return new Date(b.thoi_gian_cap_nhat) - new Date(a.thoi_gian_cap_nhat);
        });

        // Lấy 5 truyện mới nhất
        this.stories = sortedStories;
        this.displayStories = sortedStories.slice(0, 5);
        console.log("Display stories:", this.displayStories);
      } catch (error) {
        console.error("Error fetching stories:", error);
      */
        // Dùng mock data để test trực quan
        this.displayStories = [
          { id: 1, ten_truyen: "Tình Kiếm", anh_bia: null, thoi_gian_cap_nhat: "2025-04-25", chapterCount: 10 },
          { id: 2, ten_truyen: "Ái Tình", anh_bia: null, thoi_gian_cap_nhat: "2025-04-24", chapterCount: 5 },
          { id: 3, ten_truyen: "Huyền Thoại", anh_bia: null, thoi_gian_cap_nhat: "2025-04-23", chapterCount: 8 },
          { id: 4, ten_truyen: "Kiếm Rồng", anh_bia: null, thoi_gian_cap_nhat: "2025-04-22", chapterCount: 12 },
          { id: 5, ten_truyen: "Mộng Đế", anh_bia: null, thoi_gian_cap_nhat: "2025-04-21", chapterCount: 3 },
        ];
      // }
    },
  },
};
</script>

<style scoped>
/* Import Google Fonts */
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Poppins:wght@400;500;600&display=swap");

/* Container chính */
.truyenchu-container {
  display: flex;
  flex-direction: column;
  width: 100vw;
  background: #1a1d29;
  color: #ffffff;
  font-family: "Inter", sans-serif;
}

/* Nội dung chính */
.main-content {
  padding: 40px 20px;
  text-align: center;
}

/* Responsive */
@media (max-width: 768px) {
  .main-content {
    margin-top: 140px;
    padding: 20px 15px;
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: 15px 10px;
  }
}
</style>