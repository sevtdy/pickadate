<template>
  <div id="datepicker">
  
  </div>
</template>

<script>
export default {
  name: 'datepicker',
  data() {
    let now = new Date()
    return {
      showtable: 'year',
      year: now.getFullYear(),
      month: now.getMonth(),
      day: now.getDate(),
      yearList: Array.from({ length: 12 }, (value, index) => now.getFullYear() + index),
      monthList: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      weekList: ['一', '二', '三', '四', '五', '六', '日']
      //weekList: ['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'],
    }
  },
  computed: {
    dayList() {
      //当月天数
      let currentMonthLength = new Date(this.year, this.month + 1, 0).getDate()
      //塞进数组
      let dayList = Array.from({ length: currentMonthLength }, (value, index) => {
        return { currentMonth: true, value: index + 1 }
      })
      //当月1号是星期几 0~6 日~六
      let currentMonthStartDay = new Date(this.year, this.month, 1).getDay()
      //上个月天数
      let previousMonthLength = new Date(this.year, this.month, 0).getDate()
      //补前面空位
      for (let i = 0; i < currentMonthStartDay - 1; i++) {
        dayList = [{ previousMonth: true, value: previousMonthLength - i }].concat(dayList)
      }
      //补后面空位
      for (let i = 0; dayList.length < 42; i++) {
        dayList[dayList.length] = { nextMonth: true, value: i + 1 };
      }
      return dayList
    }
  }

}
</script>

<style>

</style>