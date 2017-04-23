<template>
  <div id="showdate">
    <div class="tittle">{{planTittle}}</div>
    <div class="submit" v-if="hasLocalIdFlag">
      <div class="submit-btn">Edit</div>
      <div class="submit-btn" @click="updateUserdata()">Done</div>
    </div>
    <div class="submit" v-else>
      <div class="submit-btn" @click="pushUserData()">Submit</div>
    </div>
    <!--<div class="row">
        <div class="left">
          <div>
            <table>
              <tr>
                <td>date</td>
              </tr>
              <tr>
                <td>
                  <input type="text" class="name-input" v-model.trim="tempName">
                </td>
              </tr>
              <tr v-for="item in user" v-show="!(item.id == userId)">
                <td>{{item.name}}</td>
              </tr>
            </table>
          </div>
        </div>
        <div class="right">
          <table>
            <tr>
              <td v-for="item in date">{{item.month}}/{{item.day}},</td>
            </tr>
            <tr>
              <td v-for="num in dateLen">
                <input type="checkbox" v-model="tempSelect[num-1]">
              </td>
            </tr>
            <tr v-for="item in user" v-show="!(item.id == userId)">
              <td v-for="num in dateLen">
                <div class="checkbox" v-if="item.select[num-1]">✔</div>
                <div class="checkbox" v-else>✖</div>
              </td>
            </tr>
          </table>
        </div>
      </div>
      <hr>-->
    <div>
      <table>
        <tr>
          <th>日期</th>
          <th v-for="item in date">|{{item.month}}/{{item.day}}|</th>
        </tr>
        <tr>
          <td>
            <input type="text" v-model="tempName">
          </td>
          <td v-for="num in dateLen">
            <div class="checkbox" v-if="tempSelect[num-1]">✔</div>
            <div class="checkbox" v-else>✖</div>
          </td>
        </tr>
        <tr v-for="(item, index) in user">
          <td v-show="!(item.id == userId)">{{item.name}}</td>
          <td v-for="num in dateLen" v-show="!(item.id == userId)">
            <div class="checkbox" v-if="item.select[num-1]">✔</div>
            <div class="checkbox" v-else>✖</div>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
//初始化野狗
wilddog.initializeApp({
  syncURL: 'https://pickatime.wilddogio.com'
})
var ref = wilddog.sync().ref('/')

//第一个user没有显示
export default {
  name: 'showdate',
  data() {
    return {
      planId: null,
      planTittle: '',
      user: [],
      userId: '',
      tempName: '',
      tempSelect: [],
      date: null,
      dateLen: null,
      hasLocalIdFlag: false,
      test: false
    }
  },
  created() {
    this.planId = (window.location.pathname).replace(/\//, '')
    ref.once('value').then((snapshot) => {
      let hasPlanId = snapshot.hasChild(this.planId)
      if (!hasPlanId) {
        this.$router.push('/error')
      } else {
        this.planTittle = snapshot.child(this.planId).val().tittle
        this.date = snapshot.child(this.planId).val().date
        this.dateLen = this.date.length
        for (var i = 0; i < this.dateLen; i++) {
          this.tempSelect.push(false)
        }
        this.syncUserData()
      }
    })
  },
  methods: {
    syncUserData() {
      ref.child(this.planId).child('user').on('value', (snapshot) => {
        let tempuser = []
        let num = 0
        snapshot.forEach((childSnapshot) => {
          // this.user[num] = {
          //   id: childSnapshot.key(),
          //   name: childSnapshot.val().name,
          //   select: childSnapshot.val().select
          // }
          // num++
          tempuser.push({
            id: childSnapshot.key(),
            name: childSnapshot.val().name,
            select: childSnapshot.val().select
          })
          this.user = tempuser
        })
        this.isHasLocalUerId()
      })
    },
    isHasLocalUerId() {
      if (localStorage.getItem(this.planId + '||' + 'userId')) {
        this.userId = localStorage.getItem(this.planId + '||' + 'userId')
        for (let i = 0; i < this.user.length; i++) {
          if (this.user[i].id == this.userId) {
            this.tempName = this.user[i].name
            this.tempSelect = this.user[i].select
            this.hasLocalIdFlag = true
          }
        }
      }
    },
    pushUserData() {
      this.userId = ref.child(this.planId).child('user').push({
        name: this.tempName,
        select: this.tempSelect
      }).key()
      localStorage.setItem(this.planId + '||' + 'userId', this.userId)
      this.hasLocalIdFlag = true
      //可能愮一个flag控制disable
    },
    updateUserdata() {
      ref.child(this.planId).child('user').child(this.userId).update({
        select: this.tempSelect,
        name: this.tempName
      })
      //flag
    },
    editBtn() {
      //flag切换
    }
  }

}
</script>

<style lang="scss" scoped>
#showdate {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.submit {
  display: flex;
  justify-content: flex-end;
  .submit-btn {
    background: #dbefdc;
    color: #9aa49a;
    border-radius: 3px;
    padding: 6px;
    cursor: pointer;
  }
}

.tittle {
  color: #888888;
  text-align: left;
  font-size: 1.2em;
  line-height: 1.4em;
  border-width: 0px 0px 1px 0px;
  border-color: #888888;
  border-style: solid;
}

.name-input {
  border-style: solid;
  border-top-width: 0px;
  border-right-width: 0px;
  border-bottom-width: 1px;
  border-left-width: 0px;
  border-color: #888888;
}

.row {
  display: flex;
  .right {
    overflow-x: scroll;
  }
}

.checkbox {
  cursor: pointer;
  color: white;
  background-color: gray;
}

table {
  border: 0px;
  border-collapse: collapse;
  border-spacing: 0px;
}
</style>