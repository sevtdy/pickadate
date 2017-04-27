<template>
  <div id="datepicker">
    <input type="text" v-model.trim="planTittle" class="tittle-input" placeholder="what's the plan?">
    <div class="submit">
      <div class="submit-tips" v-if="planTittle.length == 0">▲输入一个标题</div>
      <div class="submit-tips" v-else-if="selectDate.length == 0">▼选择日期</div>
      <div class="submit-tips" v-else>{{selectDate.length}} dates select</div>
      <div class="submit-button" :class="{disable:selectDate.length == 0 ||  planTittle.length == 0}" @click="submitPlan">NEXT</div>
    </div>
    <div class="panel">
      <div class="panel-tittle"><span>when?</span></div>
      <div class="panel-body">
        <div class="day-panel" v-show="showPanle == 'day'">
          <div class="switch-view">
            <div class="arrow" :class="{disable:year >= tempYear && month >= tempMonth}" @click="selectPrev()">«</div>
            <div class="select" @click="switchMonth()">{{tempYear}} {{monthList[tempMonth]}}</div>
            <div class="arrow" :class="{disable:year+11 <= tempYear}" @click="selectNext()">»</div>
          </div>
          <div class="week-view">
            <div class="week" v-for="item in weekList">{{item}}</div>
          </div>
          <div class="day-view">
            <div class="day" :class="{isnow:isNow('day', item), disable:item.previousMonth || item.nextMonth || (day > item.value && year >= tempYear && month >= tempMonth), isselect: isSelect(item)}" @click="selectDay(item)" v-for="item in dayList">{{item.value}}
            </div>
          </div>
        </div>
        <div class="month-panel" v-show="showPanle == 'month'">
          <div class="switch-view">
            <div class="arrow" :class="{disable: year >= tempYear}" @click="selectPrev()">«</div>
            <div class="select" @click="switchYear()">{{tempYear}}</div>
            <div class="arrow" :class="{disable: year+11 <= tempYear}" @click="selectNext()">»</div>
          </div>
          <div class="month-view">
            <div class="month" :class="{isnow:isNow('month',index), disable: month > index && year == tempYear}" @click="selectMonth(index)" v-for="(item,index) in monthList">
              {{item}}
            </div>
          </div>
        </div>
        <div class="year-panel" v-show="showPanle == 'year'">
          <div class="switch-view">
            <div class="select">{{year}} - {{year + 11}}</div>
          </div>
          <div class="year-view">
            <div class="year" :class="{isnow:isNow('year',item)}" @click="selectYear(item)" v-for="item in yearList">{{item}}</div>
          </div>
        </div>
      </div>
    </div>
  
  </div>
</template>

<script>
//初始化野狗
wilddog.initializeApp({
  syncURL: 'https://pickatime.wilddogio.com'
})
var ref = wilddog.sync().ref('/')
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
      selectDate: [],
      planTittle: ''
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
    },
    isNow(type, v) {
      switch (type) {
        case 'day':
          if (this.day == v.value && v.currentMonth && this.year == this.tempYear) {
            return true
          } else {
            return false
          }
        case 'month':
          if (this.month == v && this.year == this.tempYear) {
            return true
          } else {
            return false
          }
        case 'year':
          if (this.year == v) {
            return true
          } else {
            return false
          }
      }
    },
    selectNext() {
      if (this.showPanle == 'day') {
        if (this.tempMonth < 11) {
          this.tempMonth++
        } else {
          this.tempMonth = 0
          this.tempYear++
        }
      } else {
        this.tempYear++
      }
    },
    selectPrev() {
      if (this.showPanle == 'day') {
        if (this.tempMonth > 0) {
          this.tempMonth--
        } else {
          this.tempMonth = 11
          this.tempYear--
        }
      } else {
        this.tempYear--
      }
    },
    submitPlan() {
      this.formatData()
      let link = ref.push({
        date: this.selectDate,
        tittle: this.planTittle
      }).key()
      this.$router.push(link)
    },
    formatData() {
      this.selectDate.sort(function (a, b) {
        if (a.year > b.year) {
          return 1
        } else if (a.year < b.year) {
          return -1
        } else {
          if (a.month > a.month) {
            return 1
          } else if (a.month < b.month) {
            return -1
          } else {
            if (a.day > b.day) {
              return 1
            } else {
              return -1
            }
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#datepicker {
  user-select: none;
}

.tittle-input {
  border-width: 0 0 1px 0;
  border-color: #888888;
  width: 100%;
  font-size: 1.2em;
  padding: 0.8rem 0;
  outline: none;
  &:focus {
    border-color: black;
  }
}

.switch-view {
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  line-height: 1.8rem;
  cursor: pointer;
  .arrow {
    width: 12.8%;
    flex-grow: 0;
    margin: 0.4rem 0;
    padding: 3px;
    border-radius: 3px;
  }
  .select {
    flex-grow: 1;
    margin: 0.4rem;
    padding: 3px;
    border-radius: 3px;
  }
  div:hover {
    background-color: #eeeeee;
  }
}

.week-view {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  font-weight: 700;
  font-size: 15px;
  margin-bottom: 0.4rem;
  .week {
    width: 12.8%;
    margin: 0.1%;
    line-height: 2rem;
  }
}

.day-view {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  font-size: 14px;
  .day {
    width: 12.8%;
    margin: 0.1%;
    line-height: 1.8rem;
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
    width: 20%;
    margin: 0.4rem;
    line-height: 3.4rem;
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
    margin: 0.4rem;
    line-height: 3.4rem;
    cursor: pointer;
  }
  div:hover {
    background-color: #eeeeee;
    border-radius: 3px;
  }
}

.panel {
  box-shadow: 0 1px 6px 0 rgba(0, 0, 0, .12), 0 1px 6px 0 rgba(0, 0, 0, .12);
  margin: 0 0.4rem;
}

.panel-tittle {
  border-radius: 4px 4px 0 0;
  text-align: left;
  background-color: #eeeeee;
  padding: 0.8rem;
}

.panel-body {
  padding: 0.4rem;
}

.submit {
  display: flex;
  justify-content: space-between;
  margin: 1rem 0.2rem;
  line-height: 1rem;
  align-items: baseline;
  .submit-tips {
    padding: 0.5rem;
    color: white;
    background-color: #a9a9a9;
    border-radius: 3px;
  }
  .submit-button {
    background-color: #c8e6c9;
    border-radius: 3px;
    padding: 0.5rem 1.3rem;
    cursor: pointer;
    &:hover {
      box-shadow: 0 1px 6px 0 rgba(0, 0, 0, .12), 0 1px 6px 0 rgba(0, 0, 0, .12);
    }
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