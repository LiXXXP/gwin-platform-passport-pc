<template>
  <div class="form-wrapper">
    <h4>密码登录</h4>
    <el-form ref="form" :model="formData" :rules="rules" size="medium">
      <el-form-item prop="passportNo">
        <el-input v-model="formData.passportNo" placeholder="请输入手机号码"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="formData.password" type="password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onLoginButtonClick">登录</el-button>
        <el-button type="primary" @click="onLogoutButtonClick">退出</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { IReqAccountSignIn, Passport, IResAccountSignInfo } from '~/index'
import { Response } from '@gwin/networking'
import { ElMessage } from 'element-plus'

const formData = reactive({
  passportNo: '',
  password: ''
})

const form = ref(null)

const rules = {
  passportNo: [{ required: true, message: '请输入手机号码', trigger: ['blur', 'change'] }],
  password: [{ required: true, message: '请输入密码', trigger: ['blur', 'change'] }]
}

function onLoginButtonClick() {
  form.value &&
    form.value.validate(async (valid: boolean) => {
      if (valid) {
        onLogin()
      }
    })
}

async function onLogin() {
  const account: IReqAccountSignIn = Object.assign({ passportType: 'mobile', signType: 'password' }, formData)
  const signInfo: Response<IResAccountSignInfo> = await Passport.login(account)
  console.log(signInfo.body)
  ElMessage.success('登录成功')
}

function onLogoutButtonClick() {
  Passport.logout()
  ElMessage.success('退出成功')
}
</script>

<style lang="scss" scoped>
.form-wrapper {
  margin: 50px;
  width: 200px;
}
</style>
