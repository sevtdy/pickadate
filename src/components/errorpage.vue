<template>
  <div>
    <h1>😱</h1>
    <h1>oops!</h1>
    <h2>Page Not Found</h2>
    <br>
    <h3>👉<a href="javascript:void(0)" @click="linkHome()">Return Home Page</a>👈</h3>
  </div>
</template>

<script>
export default {
  methods: {
    linkHome() {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
</style>