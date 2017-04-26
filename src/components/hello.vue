<template>
  <div id="hello">
    <h1>Pick a Date</h1>
    <h2>选一天合适的日子吧</h2>
    <div class="go-btn" @click="linkCreate()">👍 创建一个活动</div>
    <br>
    <p>免费 - 无需注册 - 无需下载</p>
  </div>
</template>

<script>
export default {
  name: 'hello',
  methods: {
    linkCreate() {
      this.$router.push('/create')
    }
  }
}
</script>

<style lang="scss" scoped>
.go-btn {
  display: inline-block;
  color: rgba(255, 255, 255, .90);
  background-color: #4caf50;
  padding: 0.9em;
  margin: 2rem;
  border-radius: 4px;
  transition: 0.8s;
  cursor: pointer;
  &:hover {
    transition: 0.5s;
    background-color: #59b75c;
    box-shadow: 0px 2px 8px 0 rgba(0, 0, 0, .20), 0 2px 8px 0 rgba(0, 0, 0, .20);
  }
}

p {
  color: #9a9a9a;
}
</style>