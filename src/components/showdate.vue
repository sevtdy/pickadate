<template>
  <div id="showdate">
    <div class="tittle">{{planTittle}}</div>
    <div class="submit" v-if="hasLocalIdFlag">
      <div class="submit-btn btn-green" @click="updateUserdata()" v-if="openEditFlag">Save</div>
      <div class="submit-btn btn-blue" @click="editBtn()" v-else>Edit</div>
    </div>
    <div class="submit" v-else>
      <div class="submit-btn btn-green" @click="pushUserData()">Submit</div>
    </div>
    <!--start-->
    <div class="row">
      <div class="left">
        <table>
          <tbody>
            <tr class="tr-left-first">
              <td>日期</td>
            </tr>
            <tr class="tr-left-second">
              <td>
                <input type="text" placeholder="你的名字？" :class="{'name-input':!openEditFlag && hasLocalIdFlag, 'name-input-focus': openEditFlag || !hasLocalIdFlag}" v-model.trim="tempName" :readonly="!openEditFlag && hasLocalIdFlag">
              </td>
            </tr>
            <tr class="tr-left-other" v-for="(u, index) in user" v-bind:key="index" v-show="u.id != userId">
              <td>
                <input class="name-input" v-model="u.name">
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--左右分割-->
      <div class="right">
        <table>
          <tbody>
            <tr class="tr-right-first">
              <td v-for="(item, index) in date" v-bind:key="index" :class="{tdgrey: index%2 == 0, mostSelect: isMostSelect[index]}">
                {{item.year}} {{monthList[item.month]}}
                <br> {{item.day}}
              </td>
            </tr>
            <tr class="tr-right-second">
              <td v-for="(item, index) in tempSelect" v-bind:key="index" :class="{tdgreen: item, tdred: !item}">
                <div class="checkbox-edit" v-if="openEditFlag || !hasLocalIdFlag" @click="changeSelect(index)">
                  <span v-if="item">☑</span>
                  <span v-else>☐</span>
                </div>
                <div v-else>
                  <div class="checkbox" v-if="item">✔</div>
                  <div class="checkbox" v-else>✖</div>
                </div>
              </td>
            </tr>
            <tr class="tr-right-other" v-for="(u, index) in user" v-bind:key="index" v-show="u.id != userId">
              <td v-for="(n, index) in dateLen" v-bind:key="index" :class="{tdgreen: u.select[n-1], tdred: !u.select[n-1]}">
                <div class="checkbox" v-if="u.select[n-1]">✔</div>
                <div class="checkbox" v-else>✖</div>
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
  syncURL: "https://pickatime.wilddogio.com"
});
var ref = wilddog.sync().ref("/");

export default {
  name: "showdate",
  data() {
    return {
      planId: null,
      planTittle: "",
      user: [],
      userId: "",
      tempName: "",
      tempSelect: [],
      date: null,
      dateLen: null,
      hasLocalIdFlag: false,
      openEditFlag: false,
      monthList: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ]
    };
  },
  created() {
    // this.planId = window.location.pathname.replace(/\//, "");
    this.planId = this.$route.params.id;
    console.log(this.planId);
    ref.once("value").then(snapshot => {
      let hasPlanId = snapshot.hasChild(this.planId);
      if (!hasPlanId) {
        this.$router.push("/error");
      } else {
        this.planTittle = snapshot.child(this.planId).val().tittle;
        this.date = snapshot.child(this.planId).val().date;
        this.dateLen = this.date.length;
        for (var i = 0; i < this.dateLen; i++) {
          this.tempSelect.push(false);
        }
        this.syncUserData();
      }
    });
  },
  methods: {
    syncUserData() {
      ref
        .child(this.planId)
        .child("user")
        .on("value", snapshot => {
          let tempuser = [];
          snapshot.forEach(childSnapshot => {
            tempuser.push({
              id: childSnapshot.key(),
              name: childSnapshot.val().name,
              select: childSnapshot.val().select
            });
            this.user = tempuser;
          });
          this.isHasLocalUerId();
        });
    },
    isHasLocalUerId() {
      if (localStorage.getItem(this.planId + "||" + "userId")) {
        this.userId = localStorage.getItem(this.planId + "||" + "userId");
        for (let i = 0; i < this.user.length; i++) {
          if (this.user[i].id == this.userId) {
            this.tempName = this.user[i].name;
            this.tempSelect = this.user[i].select;
            this.hasLocalIdFlag = true;
          }
        }
      }
    },
    pushUserData() {
      if (this.tempName) {
        this.userId = ref
          .child(this.planId)
          .child("user")
          .push({
            name: this.tempName,
            select: this.tempSelect
          })
          .key();
        localStorage.setItem(this.planId + "||" + "userId", this.userId);
        this.hasLocalIdFlag = true;
      } else {
        alert("填个名字呗");
      }
    },
    updateUserdata() {
      ref
        .child(this.planId)
        .child("user")
        .child(this.userId)
        .update({
          select: this.tempSelect,
          name: this.tempName
        });
      this.editBtn();
    },
    editBtn() {
      this.openEditFlag = !this.openEditFlag;
    },
    changeSelect(index) {
      this.tempSelect.splice(index, 1, !this.tempSelect[index]);
    }
  },
  computed: {
    //找出选择最多的天数
    isMostSelect() {
      let maxArray = Array.from({ length: this.dateLen }, () => 0);
      for (var i = 0; i < this.user.length; i++) {
        for (var j = 0; j < this.dateLen; j++) {
          if (this.user[i].select[j] == true) {
            maxArray[j]++;
          }
        }
      }
      let maxNum = Math.max.apply(null, maxArray);
      let list = [];
      for (let i = 0; i < this.dateLen; i++) {
        if (maxArray[i] == maxNum) {
          list.push(true);
        } else {
          list.push(false);
        }
      }
      return list;
    }
  }
};
</script>

<style lang="scss" scoped>
.row {
  display: flex;
}

table {
  border-collapse: collapse;
  width: 100%;
  td {
    // border: 1px solid black;
    height: 2.6rem;
  }
}

.left {
  min-width: 15%;
  margin-right: 4px;
  table {
    box-shadow: 0 8px 17px 0 rgba(0, 0, 0, 0.2),
      0 6px 20px 0 rgba(0, 0, 0, 0.19);
    text-align: left;
    td {
      padding-left: 5px;
      padding-right: 5px;
    }
  }
}

.right {
  width: 100%;
  overflow-x: auto;
  td {
    min-width: 4rem; //要根据date更改
  }
}

.tr-left-first {
  text-align: right;
  font-size: 14px;
  height: 2rem;
}

.tr-right-first {
  font-size: 14px;
  height: 2rem;
}

.checkbox {
  font-size: 1.2rem;
  color: #9aa49a;
  line-height: 1.2rem;
  user-select: none;
}

.checkbox-edit {
  display: inline-block;
  line-height: 1.6rem;
  font-size: 1.6rem;
  color: #2c3e50;
  span {
    cursor: pointer;
  }
}

.tdgreen {
  background-color: #c9facd;
}

.tdred {
  background-color: #fdd6db;
}

.tdgrey {
  background-color: #f5f5f5;
}

//按钮样式
.submit {
  display: flex;
  justify-content: flex-end;
  margin: 1rem 0;
  .submit-btn {
    transition: 0.6s;
    color: #ffffff;
    border-radius: 3px;
    padding: 0.4rem 1.3rem;
    cursor: pointer;
    &:hover {
      transition: 0.6s;
      box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.12),
        0 1px 6px 0 rgba(0, 0, 0, 0.12);
    }
  }
  .btn-green {
    background-color: #4caf50;
  }
  .btn-blue {
    background-color: #03a9f4;
  }
}

.tittle {
  color: #888888;
  text-align: left;
  font-size: 1.4em;
  padding: 0.8rem 0;
  border-width: 0px 0px 1px 0px;
  border-color: #888888;
  border-style: solid;
}

.name-input {
  outline: none;
  height: 100%;
  border: 0px;
  width: 100%;
}

.name-input-focus {
  outline: none;
  height: 100%;
  border-width: 0px 0px 1px 0px;
  border-color: #888888;
  width: 100%;
}

.mostSelect {
  font-weight: 700;
  color: #3e9041;
}
</style>