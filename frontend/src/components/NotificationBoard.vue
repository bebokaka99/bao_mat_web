<!-- frontend/src/components/NotificationBoard.vue -->
<template>
  <div class="notification-board">
    <h2 class="notification-title">Thông báo mới</h2>
    <div class="notification-carousel" v-if="notifications.length">
      <div class="carousel-inner">
        <div
          class="notification-item"
          v-for="(notice, index) in notifications"
          :key="index"
          :class="{ active: index === currentIndex }"
        >
          <i class="fas fa-bullhorn notification-icon"></i>
          <p class="notification-text">{{ notice.text }}</p>
        </div>
      </div>
      <button class="carousel-button prev" @click="prevSlide">
        <i class="fas fa-chevron-left"></i>
      </button>
      <button class="carousel-button next" @click="nextSlide">
        <i class="fas fa-chevron-right"></i>
      </button>
      <div class="pagination-dots">
        <span
          v-for="(notice, index) in notifications"
          :key="index"
          class="pagination-dot"
          :class="{ active: index === currentIndex }"
          @click="goToSlide(index)"
        ></span>
      </div>
    </div>
    <p v-else class="no-notifications">Không có thông báo.</p>
  </div>
</template>

<script>
export default {
  name: "NotificationBoard",
  props: {
    notifications: {
      type: Array,
      default: () => [
        {
          text: "Chào mừng bạn đến với TruyenVietHay! Khám phá kho tàng truyện chữ phong phú, từ kiếm hiệp đến ngôn tình, hoàn toàn miễn phí!",
        },
        {
          text: "Đăng nhập ngay để hưởng đặc quyền: Theo dõi truyện yêu thích, lưu lịch sử đọc, và tham gia cộng đồng sáng tác sôi động!",
        },
        {
          text: "Đọc truyện miễn phí với hàng ngàn thể loại: Ngôn tình, huyền huyễn, kinh dị, đam mỹ... Cập nhật chương mới mỗi ngày!",
        },
        {
          text: "Tham gia event hàng tuần tại TruyenVietHay! Nhận quà VIP, phiếu đọc truyện, và cơ hội giao lưu với các tác giả nổi tiếng!",
        },
        {
          text: "Cùng sáng tác, chia sẻ câu chuyện của bạn! Xây dựng cộng đồng truyện chữ mạnh mẽ, lan tỏa đam mê tại Việt Nam!",
        },
      ],
    },
  },
  data() {
    return {
      currentIndex: 0,
      intervalId: null,
    };
  },
  mounted() {
    console.log("NotificationBoard mounted, notifications:", this.notifications); // Debug
    this.startAutoSlide();
  },
  beforeDestroy() {
    clearInterval(this.intervalId);
  },
  methods: {
    startAutoSlide() {
      this.intervalId = setInterval(() => {
        this.nextSlide();
      }, 7000); // 7s
    },
    nextSlide() {
      this.currentIndex = (this.currentIndex + 1) % this.notifications.length;
    },
    prevSlide() {
      this.currentIndex =
        (this.currentIndex - 1 + this.notifications.length) % this.notifications.length;
    },
    goToSlide(index) {
      this.currentIndex = index;
    },
  },
};
</script>

<style scoped>
/* Import Google Fonts và Font Awesome */
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700&family=Poppins:wght@400;500;600&display=swap");
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css");

.notification-board {
  margin: 0 auto;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(34, 197, 94, 0.5);
  border-radius: 1rem;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
  animation: fade-in 0.6s ease-in;
  transition: all 0.3s ease;
}

.notification-board:hover {
  transform: scale(1.02);
  border-image: linear-gradient(to right, #22c55e, #ffd700) 1;
  box-shadow: 0 0 25px rgba(255, 215, 0, 0.6);
}

.notification-title {
  font-family: "Montserrat", sans-serif;
  font-weight: 700;
  color: #22c55e;
  text-shadow: 0 0 3px rgba(255, 255, 255, 0.3);
  margin-bottom: 1.5rem;
  text-align: center;
  transition: text-shadow 0.3s ease;
}

.notification-board:hover .notification-title {
  text-shadow: 0 0 5px rgba(34, 197, 94, 0.6);
}

.notification-carousel {
  height: 4rem;
  position: relative;
  overflow: hidden;
}

.carousel-inner {
  position: relative;
  width: 100%;
  height: 60%;
}

.notification-item {
  position: absolute;
  width: 98%;
  height: 95%;
  display: flex;
  align-items: center;
  border-radius: 0.8rem;
  opacity: 0;
  transform: scale(0.95);
  transition: all 0.5s ease;
}

.notification-item.active {
  opacity: 1;
  transform: scale(1);
  animation: pulse 2s infinite ease-in-out;
}

.notification-icon {
  margin-left: 10px;
  font-size: 1.4rem;
  color: #ef4444;
  margin-right: 0.8rem;
}

.notification-text {
  font-size: 1rem;
  font-weight: 500;
  color: #ffffff;
  line-height: 1.5;
}

.no-notifications {
  font-family: "Poppins", sans-serif;
  font-size: 1rem;
  color: #cccccc;
  text-align: center;
}

/* Nút prev/next */
.carousel-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 36px; /* Gọn */
  height: 36px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(34, 197, 94, 0.5);
  border-radius: 50%;
  color: #ffffff;
  opacity: 0;
  transition: all 0.3s ease;
  cursor: pointer;
}

.notification-board:hover .carousel-button {
  opacity: 1;
}

.carousel-button:hover {
  background: rgba(34, 197, 94, 0.7);
  border-color: #22c55e;
  transform: translateY(-50%) scale(1.1);
}

.carousel-button.prev {
  left: 12px;
}

.carousel-button.next {
  right: 12px;
}

.carousel-button i {
  font-size: 1rem;
}

/* Pagination dots */
.pagination-dots {
  display: flex;
  justify-content: center;
  margin-top: 0.8rem;
}

.pagination-dot {
  width: 10px;
  height: 10px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  margin: 0 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-dot:hover {
  background: rgba(34, 197, 94, 0.6);
  transform: scale(1.2);
}

.pagination-dot.active {
  background: #22c55e;
  transform: scale(1.2);
  box-shadow: 0 0 6px rgba(34, 197, 94, 0.5); /* Glow */
}

/* Animation fade-in */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Animation pulse */
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.98);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .notification-board {
    max-width: 90%;
    padding: 1.5rem;
  }

  .notification-title {
    font-size: 1.7rem;
  }

  .notification-item {
    padding: 0.7rem;
  }

  .notification-icon {
    font-size: 1.3rem;
  }

  .notification-text {
    font-size: 0.95rem;
  }

  .notification-carousel {
    height: 3.5rem;
  }

  .carousel-button {
    width: 32px;
    height: 32px;
  }

  .carousel-button i {
    font-size: 0.9rem;
  }

  .pagination-dot {
    width: 8px;
    height: 8px;
    margin: 0 4px;
  }
}

@media (max-width: 480px) {
  .notification-board {
    max-width: 95%;
    padding: 1rem;
  }

  .notification-title {
    font-size: 1.4rem;
  }

  .notification-item {
    padding: 0.6rem;
  }

  .notification-icon {
    font-size: 1.2rem;
    margin-right: 0.6rem;
  }

  .notification-text {
    font-size: 0.9rem;
  }

  .notification-carousel {
    height: 3rem;
  }

  .carousel-button {
    width: 28px;
    height: 28px;
  }

  .carousel-button i {
    font-size: 0.8rem;
  }

  .pagination-dot {
    width: 6px;
    height: 6px;
    margin: 0 3px;
  }
}
</style>