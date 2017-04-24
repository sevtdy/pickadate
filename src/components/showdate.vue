<template>
  <div id="showdate">
    <div class="tittle">{{planTittle}}</div>
    <div class="submit" v-if="hasLocalIdFlag">
      <div class="submit-btn" @click="editBtn()" v-if="openEditFlag">Edit</div>
      <div class="submit-btn" @click="updateUserdata()" v-else>Done</div>
    </div>
    <div class="submit" v-else>
      <div class="submit-btn" @click="pushUserData()">Submit</div>
    </div>
    <!--start-->
    <div class="t">
      <div class="left">
        <table>
          <tbody>
            <tr class="tr-left-first">
              <td>日期</td>
            </tr>
            <tr class="tr-left-second">
              <td>
                <input type="text" v-model="tempName">
              </td>
            </tr>
            <tr class="tr-left-other" v-for="u in user" v-show="u.id != userId">
              <td>{{u.name}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--左右分割-->
      <div class="right">
        <table>
          <tbody>
            <tr class="tr-right-first">
              <td v-for="item in date">
                {{item.month}} /{{item.day}}
              </td>
            </tr>
            <tr class="tr-right-second">
              <td v-for="(item, index) in tempSelect" @click="changeSelect(index)">
                <div v-if="item">√</div>
                <div v-else>×</div>
              </td>
            </tr>
            <tr class="tr-right-other" v-for="u in user" v-show="u.id != userId">
              <td v-for="n in dateLen">
                <div v-if="u.select[n-1]">√</div>
                <div v-else>×</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!--end-->
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
      openEditFlag: false,
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
      this.editBtn()
    },
    editBtn() {
      this.openEditFlag = !this.openEditFlag
    },
    changeSelect(index){
      this.tempSelect[index] = ! this.tempSelect
    }
  }

}
</script>

<style lang="scss" scoped>
.t {
  display: flex;
}

.tr-right-second{
  td{
    cursor: pointer;
  }
}

table{
  border-collapse: collapse;
  td{
    border: 1px solid black;
  }
}

.right {
  width: 100%;
  overflow-x: scroll;
  table {
    width: 100%;
  }
}

//================
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
</style>