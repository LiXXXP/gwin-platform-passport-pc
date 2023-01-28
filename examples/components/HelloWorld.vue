<template>
  <div class="container">
    <register></register>
    <login></login>
    <sms-login></sms-login>
    <captcha></captcha>
    <basic-info></basic-info>
  </div>
</template>

<script setup lang="ts">
import Register from './register.vue'
import Login from './login.vue'
import SmsLogin from './smsLogin.vue'
import Captcha from './captcha.vue'
import BasicInfo from './basicInfo.vue'
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-wrap: wrap;
}
</style>
