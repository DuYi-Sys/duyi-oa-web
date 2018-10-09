<template>
  <el-form :model="loginForm" :rules="rules" ref="loginForm" label-position="left" label-width="0px" class=" login-container">
    <img src="../assets/backgroup.jpg" class="bgm" />
    <h3 class="title">渡一学员管理系统登录</h3>
    <!--<h3 class="title">渡一OA系统登录</h3>-->

    <el-form-item prop="account">
      <el-input type="text" v-model="loginForm.account" auto-complete="off" placeholder="账号" name="username"  prefix-icon="fa fa-user-o"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="loginForm.checkPass" auto-complete="off" placeholder="密码" name="password" @keyup.enter.native="handleSubmit" prefix-icon="fa fa-lock"></el-input>
    </el-form-item>
    <el-form-item style="width:100%;">
      <el-button type="success" style="width:100%;"  @click.native.prevent="handleSubmit" :loading="logining" >登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { requestLogin } from '../services/commons/httpservice';
//import NProgress from 'nprogress'
export default {
  data() {
    return {
      logining: false,
      loginForm: {
        account: '',
        checkPass: ''
      },
      rules: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          //{ validator: validaePass }
        ],
        checkPass: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          //{ validator: validaePass2 }
        ]
      },
    };
  },
  methods: {
    handleReset() {
      this.$refs.loginForm.resetFields();
    },
    handleSubmit(ev) {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          
          this.logining = true;
          var loginParams = { username: this.loginForm.account, password: this.loginForm.checkPass };
          requestLogin(loginParams).then(

            data => {
              this.logining = false;
              this.$message({
                message: '登陆成功',
                type: 'success',
                duration:1000
              });
              this.$router.push({ path: '/' });
            }, data => {
              this.logining = false;
              this.$message({
                message: '用户名或密码错误',
                type: 'error'
              });
            }
          );
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  }
}

</script>

<style lang="scss" scoped>
.login-container {
  /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  /*background-clip: padding-box;*/
  margin: 180px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  /*background: #fff;*/
  /*border: 1px solid #eaeaea;*/
  /*box-shadow: 0 0 25px #cac6c6;*/
  .title {
    margin: 0px auto 40px auto;
    text-align:center;
    color: #fff;
  }
  .remember {
    margin: 0px 0px 35px 0px;
  }
}
.bgm{
	position: fixed;
	top: 0;
	left: 0;
	z-index: -500;
	width: 100%;
	height: 100%;
}
</style>