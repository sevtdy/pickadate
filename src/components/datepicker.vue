<template>
  <div id="datepicker">
    <input type="text"
           class="tittle-input"></input>
    <div class="panel">
      <div class="panel-tittle"><span>选时间</span></div>
      <div class="panel-body">
        <div class="day-panel"
             v-show="showpanel == 'day'">
          <div class="switch-view">
            <div class="arrow">prev</div>
            <div class="select">{{year}} {{monthList[month]}}</div>
            <div class="arrow">next</div>
          </div>
          <div class="week-view">
            <div class="week"
                 v-for="item in weekList">{{item}}</div>
          </div>
          <div class="day-view">
            <div class="day"
                 v-for="item in dayList">{{item.value}}
            </div>
          </div>
        </div>
        <div class="month-panel"
             v-show="showpanel == 'month'">
          <div class="switch-view">
            <div class="arrow">prev</div>
            <div class="select">{{year}}</div>
            <div class="arrow">next</div>
          </div>
          <div class="month-view">
            <div class="month"
                 v-for="item in monthList">
              {{item}}
            </div>
          </div>
        </div>
        <div class="year-panel"
             v-show="showpanel == 'year'">
          <div class="switch-view">
            <div class="select">{{year}} - {{year + 11}}</div>
          </div>
          <div class="year-view">
            <div class="year"
                 v-for="item in 12">{{year + item -1}}</div>
          </div>
        </div>
      </div>
    </div>
  
  </div>
</template>

<script>
export default {
  name: 'datepicker',
  data() {
    let now = new Date()
    return {
      showpanel: 'day',
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
  },
  methods: {
  }

}
</script>

<style lang="scss">
.switch-view {
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  line-height: 5vh;
  cursor: pointer;
  .arrow {
    flex-grow: 1;
  }
  .select {
    flex-grow: 2;
  }
}

.week-view {
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  .week {
    width: 13%;
    line-height: 6.5vh;
  }
}

.day-view {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .day {
    width: 13%;
    line-height: 6.5vh;
    cursor: pointer;
  }
}

.month-view {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .month {
    width: 25%;
    line-height: 8vh;
    cursor: pointer;
  }
}

.year-view {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .year {
    width: 25%;
    line-height: 8vh;
    cursor: pointer;
  }
}

.panel {
  box-shadow: 0 1px 6px 0 rgba(0, 0, 0, .12)
}

.panel-tittle {
  border-radius: 4px 4px 0 0;
  text-align: left;
  background-color: #e2e2e2;
  span {
    line-height: 6vh;
  }
}
</style>