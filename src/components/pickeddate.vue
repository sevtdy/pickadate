<template>
  <div id="pickeddate">
    <div class="tittle">tittle</div>
    <div class="submit">
      <div class="submit-btn" @click="">edit</div>
      <div class="submit-btn" @click="pushUser()">啊啊啊啊</div>
    </div>
    <div class="row">
      <div class="left">
        <div>
          <table>
            <tr>
              <td>firstMonth</td>
            </tr>
            <tr>
              <td>
                <input type="text" v-model.trim="tempName">
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
              <input type="checkbox" v-model="item.select[num-1]">
            </td>
          </tr>
        </table>
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
  name: 'pickeddate',
  data() {
    return {
      planId: null,
      planTittle: null,
      user: [],
      userId: '',
      tempName: '',
      tempSelect: [],
      date: null,
      dateLen: null,
      hasLocalIdFlag: false
    }
  },
  created() {
    this.planId = (window.location.pathname).replace(/\//, '')
    ref.once('value').then((snapshot) => {
      let hasPlanId = snapshot.hasChild(this.planId)
      if (!hasPlanId) {
        this.$router.push('/error')
      } else {
        this.date = snapshot.child(this.planId).val().date
        this.dateLen = this.date.length
        for (var i = 0; i < this.dateLen; i++) {
          this.tempSelect.push(false)
        }
        this.syncUserData()
        this.isHasLocalUerId()
      }
    })
  },
  methods: {
    syncUserData() {
      ref.child(this.planId).child('user').on('value', (snapshot) => {
        let tempuser = []
        snapshot.forEach((childSnapshot) => {
          tempuser.push({
            id: childSnapshot.key(),
            name: childSnapshot.val().name,
            select: childSnapshot.val().select
          })
          this.user = tempuser
        })
      })
    },
    isHasLocalUerId() {
      if (localStorage.getItem('userId')) {
        this.userId = localStorage.getItem('userId')
        for (let i = 0; i < this.user.length; i++) {
          if (this.user[i].id == this.userId) {
            this.tempName = this.user[i].name
            this.tempSelect = this.user[i].select
            this.hasLocalIdFlag = true
          } else {
            localStorage.removeItem('userId')
            this.isHasLocalUerId()
          }
        }
      } else {

      }
    },
    pushUser() {
      ref.child(this.planId).child('user').push({
        name: this.tempName,
        select: this.tempSelect
      })
      ref.child(this.planId).child('user').once('child_added')
        .then((snapshot) => {
          this.userId = snapshot.key()
          localStorage.setItem('userId', this.userId)
        })
    }
  }

}
</script>

<style lang="scss" scopeds>
#pickeddate {
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

.row {
  display: flex;
  .right {
    overflow-x: scroll;
  }
}
.disable {
  pointer-events: none;
  color: #999999;
}
</style>