<template>
  <div id="datepicker">
    <input type="text"
           class="tittle-input"></input>
    <div class="panel">
      <div class="panel-tittle"><span>选时间</span></div>
      <div class="panel-body">
        <div class="day-panel"
             v-show="showPanle == 'day'">
          <div class="switch-view">
            <div class="arrow">prev</div>
            <div class="select"
                 @click="switchMonth()">{{tempYear}} {{monthList[tempMonth]}}</div>
            <div class="arrow">next</div>
          </div>
          <div class="week-view">
            <div class="week"
                 v-for="item in weekList">{{item}}</div>
          </div>
          <div class="day-view">
            <div class="day"
                 :class="[{isnow:day == item.value && month == tempMonth && year == tempYear},{disable:item.previousMonth || item.nextMonth},{isselect:isSelect(item)}]"
                 @click="selectDay(item)"
                 v-for="item in dayList">{{item.value}}
            </div>
          </div>
        </div>
        <div class="month-panel"
             v-show="showPanle == 'month'">
          <div class="switch-view">
            <div class="arrow">prev</div>
            <div class="select"
                 @click="switchYear()">{{tempYear}}</div>
            <div class="arrow">next</div>
          </div>
          <div class="month-view">
            <div class="month"
                 :class="[{isnow: month == index && year == tempYear},{disable: month > index && year == tempYear}]"
                 @click="selectMonth(index)"
                 v-for="(item,index) in monthList">
              {{item}}
            </div>
          </div>
        </div>
        <div class="year-panel"
             v-show="showPanle == 'year'">
          <div class="switch-view">
            <div class="select">{{year}} - {{year + 11}}</div>
          </div>
          <div class="year-view">
            <div class="year"
                 :class="[{isnow:year == item}]"
                 @click="selectYear(item)"
                 v-for="item in yearList">{{item}}</div>
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
      showPanle: 'day',
      year: now.getFullYear(),
      month: now.getMonth(),
      day: now.getDate(),
      tempYear: now.getFullYear(),
      tempMonth: now.getMonth(),
      tempDay: now.getDate(),
      yearList: Array.from({ length: 12 }, (value, index) => now.getFullYear() + index),
      monthList: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      weekList: ['一', '二', '三', '四', '五', '六', '日'],
      selectDate: []
    }
  },
  computed: {
    dayList() {
      //当月天数
      let currentMonthLength = new Date(this.tempYear, this.tempMonth + 1, 0).getDate()
      //塞进数组
      let dayList = Array.from({ length: currentMonthLength }, (value, index) => {
        return { currentMonth: true, value: index + 1 }
      })
      //当月1号是星期几 0~6 日~六
      let currentMonthStartDay = new Date(this.tempYear, this.tempMonth, 1).getDay()
      //上个月天数
      let previousMonthLength = new Date(this.tempYear, this.tempMonth, 0).getDate()
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
    switchMonth() {
      this.showPanle = 'month'
    },
    switchYear() {
      this.showPanle = 'year'
    },
    selectYear(sYear) {
      this.tempYear = sYear;
      this.showPanle = 'month';
    },
    selectMonth(sMonth) {
      this.tempMonth = sMonth;
      this.showPanle = 'day';
    },
    selectDay(sDay) {
      let flag = 0
      for (let i = 0; i < this.selectDate.length; i++) {
        if (this.tempYear == this.selectDate[i].year && this.tempMonth == this.selectDate[i].month && sDay.value == this.selectDate[i].day) {
          flag = 1
          this.selectDate.splice(i, 1)
          break
        }
      }
      if (flag == 0) {
        this.selectDate.push({
          year: this.tempYear,
          month: this.tempMonth,
          day: sDay.value
        })
      }
    },
    isSelect(sDate) {
      if (sDate.currentMonth == true) {
        let flag = 0;
        for (let i = 0; i < this.selectDate.length; i++) {
          if (this.tempYear == this.selectDate[i].year && this.tempMonth == this.selectDate[i].month && sDate.value == this.selectDate[i].day) {
            flag = 1
            break
          }
        }
        if (flag == 0) { return false } else { return true }
      }
    }
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
    flex-grow: 0;
    margin: 4px;
  }
  .select {
    flex-grow: 1;
    margin: 0 auto;
    margin: 4px;
  }
  div:hover {
    background-color: #eeeeee;
  }
}

.week-view {
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  .week {
    width: 13%;
    margin: 4px;
    line-height: 4.5vh;
  }
}

.day-view {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .day {
    width: 13%;
    margin: 4px;
    line-height: 4vh;
    cursor: pointer;
  }
  div:hover {
    background-color: #eeeeee;
    border-radius: 3px;
  }
}

.month-view {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .month {
    width: 25%;
    margin: 4px;
    line-height: 6vh;
    cursor: pointer;
  }
  div:hover {
    background-color: #eeeeee;
    border-radius: 3px;
  }
}

.year-view {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .year {
    width: 20%;
    margin: 4px;
    line-height: 6vh;
    cursor: pointer;
  }
  div:hover {
    background-color: #eeeeee;
    border-radius: 3px;
  }
}

.panel {
  box-shadow: 0 1px 6px 0 rgba(0, 0, 0, .12), 0 1px 6px 0 rgba(0, 0, 0, .12)
}

.panel-tittle {
  border-radius: 4px 4px 0 0;
  text-align: left;
  background-color: #eeeeee;
  span {
    line-height: 6vh;
  }
}

.isnow {
  background-color: #e2e2e2 !important;
  border-radius: 3px;
}

.disable {
  pointer-events: none;
  color: #999999;
}

.isselect {
  color: white;
  background-color: #03a9f4 !important;
  border-radius: 3px;
}
</style>