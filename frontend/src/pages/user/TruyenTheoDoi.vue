<template>
    <div class="followed-stories-page">
      <h2>Truyện theo dõi</h2>
      <ul class="empty-list">
        <li>Chưa có truyện theo dõi</li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    name: 'TruyenTheoDoi',
  };
  </script>
  
  <style scoped>
  .followed-stories-page {
    max-width: 600px;
    margin: 40px auto;
    padding: 20px;
    font-family: 'Poppins', sans-serif;
    background: linear-gradient(135deg, #e8f5e9, #e3f2fd);
    border: 2px solid #4caf50;
    border-radius: 10px;
  }
  
  h2 {
    color: #4caf50;
    text-align: center;
    margin-bottom: 20px;
  }
  
  .empty-list {
    list-style: none;
    padding: 0;
    text-align: center;
  }
  
  .empty-list li {
    color: #333;
    font-size: 16px;
    padding: 10px;
  }
  </style>