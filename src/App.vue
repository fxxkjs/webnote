<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
//  引进组件

export default {};
</script>


<style lang="less">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.clear::after {
  content: "";
  display: block;
  clear: both;
  visibility: hidden;
  overflow: hidden;
  height: 0;
}

* {
  margin: 0;
  padding: 0;
  list-style: none;
  color: #000;
  text-decoration: none;
}
// .w100 {
//   width: 100%;
// }
// .h100 {
//   height: 100%;
// }
</style>
