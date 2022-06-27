<template>
  <div>
    <header>
      <div class="logoWrap">
        <router-link to="/">
          <img src="../assets/fontLogo.png" alt="logo" />
        </router-link>
      </div>
    </header>
    <div class="register">
      <el-input
        v-model="username"
        placeholder="请输入6至12位账号,仅限数字."
        onkeyup="this.value=this.value.replace(/\D/g,'')"
        :input="onReg()"
      ></el-input>

      <el-input
        placeholder="请输入6至12位密码,仅限数字."
        v-model="password"
        show-password
        onkeyup="this.value=this.value.replace(/\D/g,'')"
      ></el-input>
      <el-button
        type="primary"
        :loading="loading"
        :disabled="disabled"
        @click="reg"
        >注册</el-button
      >
      <el-button type="primary" @click="home">返回主页 </el-button>

      <div style="color: red">说明：</div>
      <div>账号注册仅供体验功能，24小时后自动删除，严禁上传违法内容！</div>

      <!-- <el-button type="primary" @click="test">test</el-button> -->
    </div>
  </div>
</template>

<script>
import { register, getCookieType } from "../http/http";
export default {
  name: "SetContent",
  data() {
    return {
      loading: false,
      username: null,
      password: null,
    };
  },
  methods: {
    onReg() {
      let reg = /^\d{6,12}$/;
      if (reg.test(this.username) && reg.test(this.password)) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    },
    async reg() {
      this.loading = true;
      let tmpData = await register(this.username, this.password);
      if (tmpData.data.code === 1) {
        let a = await getCookieType();
        if (a.data.code === 1) {
          this.password = null;
          this.$alert(`${tmpData.data.msg}`, "注册成功");
          this.loading = false;
        } else {
          this.password = null;
          this.$alert("此账户封禁至次日凌晨3点，启用cookie后可注册其他账号，多次操作封禁IP！", "注册失败");
          this.loading = false;
        }
      } else {
        this.username = null;
        this.password = null;
        this.$alert(`${tmpData.data.msg}`, "注册失败");
        this.loading = false;
      }
    },
    home() {
      this.$router.push("/");
    },
  },
};
</script>

<style lang="less">
header {
  border-bottom: 1px solid #ebebeb;
  .logoWrap {
    img {
      display: block;
      width: 146px;
      height: 40px;
      margin: 10px 30px;
      // cursor: pointer;
    }
  }
}
.register {
  padding: 20px;
  margin: auto;
  margin-top: 100px;
  border: 1px solid #aaa;
  width: 300px;
  & > * {
    margin-bottom: 6px;
  }
}
</style>