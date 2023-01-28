<template>
  <div class="form-wrapper">
    <h4>获取图形验证码</h4>
    <img :src="captchaCode" />
    <el-button class="captcha-code-button" type="primary" @click="onGetCaptchaCodeButtonClick">图形验证码</el-button>
  </div>
</template>

<script setup lang="ts">
import { Passport, IResCaptchaCode } from '~/index'
import { Response } from '@gwin/networking'
import { ref } from 'vue'

const captchaCode = ref('')

async function onGetCaptchaCodeButtonClick() {
  const response: Response<IResCaptchaCode> = await Passport.getCaptchaCode()
  captchaCode.value = response.body.captchaCode
  console.log(captchaCode.value)
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
.captcha-code-button {
  margin-left: 15px;
}
</style>
