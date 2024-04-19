<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <MainHeader/>
</template>

<script>
import MainHeader from './components/MainHeader.vue'

export default {
  name: "App",
  components: {
    MainHeader
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
