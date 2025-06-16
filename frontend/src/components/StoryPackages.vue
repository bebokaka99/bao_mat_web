<!-- frontend/src/components/StoryPackages.vue -->
<template>
    <div class="story-packages">
      <div class="category-header">
        <h2 class="category-title">{{ category }}</h2>
        <router-link to="/truyen-moi" class="view-more">
          <span>Xem thêm</span>
          <i class="fas fa-arrow-circle-right"></i>
        </router-link>
      </div>
      <div class="story-list-wrapper">
        <button class="nav-button left" @click="scrollLeft">
          <i class="fas fa-chevron-left"></i>
        </button>
        <div class="story-list" ref="storyList">
          <div
            v-for="story in displayedStories"
            :key="story.id"
            class="story-card"
            @click="goToStory(story.id)"
          >
            <img
              :src="getImageUrl(story.id)"
              :data-id="story.id"
              alt="Thumbnail"
              class="story-thumbnail"
              @error="handleImageError"
            />
            <span class="story-tag">Chương {{ story.chapterCount || 0 }}</span>
            <p class="story-title">{{ story.ten_truyen }}</p>
          </div>
        </div>
        <button class="nav-button right" @click="scrollRight">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "StoryPackages",
    props: {
      category: {
        type: String,
        default: "Truyện Mới",
      },
      stories: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        mockStories: [
          { id: 1, ten_truyen: "Truyện 1", chapterCount: 10 },
          { id: 2, ten_truyen: "Truyện 2", chapterCount: 5 },
          { id: 3, ten_truyen: "Truyện 3", chapterCount: 8 },
          { id: 4, ten_truyen: "Truyện 4", chapterCount: 12 },
          { id: 5, ten_truyen: "Truyện 5", chapterCount: 3 },
          { id: 6, ten_truyen: "Truyện 6", chapterCount: 7 },
          { id: 7, ten_truyen: "Truyện 7", chapterCount: 15 },
          { id: 8, ten_truyen: "Truyện 8", chapterCount: 4 },
          { id: 9, ten_truyen: "Truyện 9", chapterCount: 9 },
          { id: 10, ten_truyen: "Truyện 10", chapterCount: 6 },
        ],
      };
    },
    computed: {
      displayedStories() {
        const storiesToDisplay = this.stories.length > 0 ? this.stories : this.mockStories;
        return storiesToDisplay.slice(0, 10);
      },
    },
    methods: {
      goToStory(storyId) {
        this.$router.push(`/stories/${storyId}`);
      },
      getImageUrl(storyId) {
        const defaultImages = [
          'https://images.unsplash.com/photo-1622021049875-7d3e29e3c90b?w=180&h=270&fit=crop',
          'https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?w=180&h=270&fit=crop',
          'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=180&h=270&fit=crop',
          'https://images.unsplash.com/photo-1519125323398-675f398f6978?w=180&h=270&fit=crop',
          'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=180&h=270&fit=crop',
          'https://images.unsplash.com/photo-1622021049875-7d3e29e3c90b?w=180&h=270&fit=crop',
          'https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?w=180&h=270&fit=crop',
          'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=180&h=270&fit=crop',
          'https://images.unsplash.com/photo-1519125323398-675f398f6978?w=180&h=270&fit=crop',
          'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=180&h=270&fit=crop',
        ];
        const index = storyId % 10;
        return defaultImages[index];
      },
      handleImageError(event) {
        console.log(`Image error for storyId: ${event.target.dataset.id}`);
        event.target.src = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=180&h=270&fit=crop';
      },
      scrollLeft() {
        this.$refs.storyList.scrollBy({ left: -300, behavior: 'smooth' });
      },
      scrollRight() {
        this.$refs.storyList.scrollBy({ left: 300, behavior: 'smooth' });
      },
    },
  };
  </script>
  
  <style scoped>
  /* Import Google Fonts */
  @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700&family=Poppins:wght@400;500;600&display=swap");
  /* Import Font Awesome cho icon */
  @import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css");
  
  .story-packages {
    margin: 2rem 0;
    padding: 0 1rem;
  }
  
  .category-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .category-title {
    font-family: "Montserrat", sans-serif;
    font-size: 1.6rem;
    font-weight: 700;
    color: #ffffff; 
    background: #28a745;
    border: 2px solid rgba(40, 167, 69, 0.3);
    border-radius: 0.5rem;
    padding: 0.5rem 1rem;
    margin: 0;
    transition: all 0.3s ease;
  }
  
  .category-title:hover {
    background: #444;
    border-color: #28a745; 
  }
  
  .view-more {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family: "Poppins", sans-serif;
    font-size: 1rem;
    color: #28a745;
    text-decoration: none;
    transition: color 0.3s ease;
  }
  
  .view-more:hover {
    color: #34c759;
  }
  
  .view-more i {
    font-size: 1.2rem;
  }
  
  .story-list-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }
  
  .story-list {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    overflow-x: hidden;
    overflow-y: hidden;
    height: 370px;
  }
  
  .story-card {
    flex: 0 0 180px;
    height: 340px;
    margin: 0 0.5rem;
    position: relative;
    cursor: pointer;
    transition: transform 0.3s ease;
    z-index: 1;
  }
  
  .story-card:hover {
    transform: scale(1.05);
    box-shadow: 0 0 15px rgba(40, 167, 69, 0.5); /* Bóng xanh lá */
    z-index: 2;
  }
  
  .story-thumbnail {
    width: 180px;
    height: 270px;
    object-fit: cover;
    border-radius: 0.5rem;
  }
  
  .story-tag {
    display: inline-block;
    background: #666;
    color: #ffffff;
    font-family: "Poppins", sans-serif;
    font-size: 0.75rem;
    padding: 0.2rem 0.5rem;
    border-radius: 0.3rem;
    margin-top: 0.5rem;
  }
  
  .story-title {
    font-family: "Poppins", sans-serif;
    font-size: 0.9rem;
    color: #ffffff;
    margin: 0.2rem 0 0;
    text-align: center;
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
  }
  
  .nav-button {
    position: absolute;
    top: 40%;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    background: #28a745;
    border: none;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #333;
    font-size: 1.2rem;
    transition: background 0.3s ease;
    z-index: 3;
  }
  
  .nav-button:hover {
    background: #34c759; /* Xanh lá nhạt khi hover */
  }
  
  .nav-button.left {
    left: 0;
  }
  
  .nav-button.right {
    right: 0;
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .story-list {
      gap: 0.8rem;
      padding: 0.8rem;
      height: 310px;
    }
  
    .story-card {
      flex: 0 0 144px;
      height: 280px;
      margin: 0 0.4rem;
    }
  
    .story-thumbnail {
      width: 144px;
      height: 216px;
    }
  
    .category-title {
      font-size: 1.4rem;
      padding: 0.4rem 0.8rem;
    }
  
    .view-more {
      font-size: 0.9rem;
    }
  
    .view-more i {
      font-size: 1rem;
    }
  
    .story-tag {
      font-size: 0.7rem;
    }
  
    .story-title {
      font-size: 0.85rem;
    }
  
    .nav-button {
      width: 35px;
      height: 35px;
      font-size: 1rem;
    }
  }
  
  @media (max-width: 480px) {
    .story-list {
      gap: 0.6rem;
      padding: 0.6rem;
      height: 230px;
    }
  
    .story-card {
      flex: 0 0 108px;
      height: 210px;
      margin: 0 0.3rem;
    }
  
    .story-thumbnail {
      width: 108px;
      height: 162px;
    }
  
    .category-title {
      font-size: 1.2rem;
      padding: 0.3rem 0.6rem;
    }
  
    .view-more {
      font-size: 0.8rem;
    }
  
    .view-more i {
      font-size: 0.9rem;
    }
  
    .story-tag {
      font-size: 0.65rem;
    }
  
    .story-title {
      font-size: 0.8rem;
    }
  
    .nav-button {
      width: 30px;
      height: 30px;
      font-size: 0.9rem;
    }
  }
  </style>