<template>
  <div class="form-wrapper">
    <h4>欢迎注册</h4>
    <el-form ref="form" :model="formData" :rules="rules" size="medium">
      <el-form-item prop="passportNo">
        <el-input v-model="formData.passportNo" placeholder="请输入手机号码"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="formData.password" type="password" placeholder="请输入登录密码"></el-input>
      </el-form-item>
      <el-form-item prop="verifyPassword">
        <el-input v-model="formData.verifyPassword" type="password" placeholder="请再次输入登录密码"></el-input>
      </el-form-item>
      <el-form-item prop="pinCode">
        <div class="pin-code-row">
          <el-input v-model="formData.pinCode" placeholder="请输入短信验证码"></el-input>
          <el-button class="pin-code-button" type="primary" @click="onGetPinCodeButtonClick">获取验证码</el-button>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onRegisterButtonClick">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Passport, IResAccountSignInfo, IReqAccountSignUp } from '~/index'
import { Response } from '@gwin/networking'
import { ElMessage } from 'element-plus'

const formData = reactive({
  passportNo: '',
  password: '',
  verifyPassword: '',
  pinCode: ''
})

const form = ref(null)

const rules = {
  passportNo: [{ required: true, message: '请输入手机号码', trigger: ['blur', 'change'] }],
  password: [{ required: true, message: '请输入密码', trigger: ['blur', 'change'] }],
  verifyPassword: [{ required: true, message: '请再次输入密码', trigger: ['blur', 'change'] }],
  pinCode: [{ required: true, message: '请输入短信验证码', trigger: ['blur', 'change'] }]
}

async function onGetPinCodeButtonClick() {
  // 获取短信
  if (formData.passportNo.length > 0) {
    await Passport.sendPinCode(formData.passportNo, 1)
    ElMessage.success('验证码发送成功')
  } else {
    ElMessage.error('请输入手机号')
  }
}

function onRegisterButtonClick() {
  form.value &&
    form.value.validate(async (valid: boolean) => {
      if (valid) {
        onRegister()
      }
    })
}

async function onRegister() {
  const account: IReqAccountSignUp = Object.assign({ passportType: 'mobile' }, formData)
  const signInfo: Response<IResAccountSignInfo> = await Passport.reginster(account)
  console.log(signInfo.body)
}
</script>

<style lang="scss" scoped>
.form-wrapper {
  margin: 50px;
  width: 300px;
  .pin-code-row {
    display: flex;
    .pin-code-button {
      margin-left: 15px;
    }
  }
}
</style>
