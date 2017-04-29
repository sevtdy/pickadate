<template>
  <div id="hello">
    <div class="tittle">
      <h1>Pick a Date</h1>
      <h2>选一天合适的日子吧</h2>
    </div>
    <div class="go-btn" @click="linkCreate()">👍 创建一个活动</div>
    <div class="howtouse">
      <h4>How to use?</h4>
      <p>step 1 输入标题，选择日期</p>
      <p>step 2 把生成的链接发给大家</p>
      <p>step 3 耐心等大家选择</p>
      <p>step 4 选一个大家合适的日子</p>
      <span>去浪浪浪</span>
    </div>
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

.tittle {
  margin: 2rem 0;
}

.howtouse {
  color: #888888;
  font-size: 15px;
  p {
    margin: 0.2rem;
  }
  span {
    color: white;
  }
}
</style>