<!-- frontend/src/App.vue -->
<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
/* Reset CSS để loại bỏ style mặc định của browser */
html, body {
  margin: 0 !important;
  padding: 0 !important;
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #1a1d29;
  color: #2c3e50;
  width: 100vw;
  min-height: 100vh;
  height: 100%; 
  margin: 0; 
  padding: 0;
  box-sizing: border-box;
}
</style>