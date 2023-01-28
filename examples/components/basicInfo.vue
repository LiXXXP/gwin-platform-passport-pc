<template>
  <div class="form-wrapper">
    <h4>用户基本信息</h4>
    <el-input v-model="basicInfo" type="textarea" :row="2"></el-input>
    <el-button class="basic-info-button" type="primary" @click="onBasicInfoButtonClick">用户基本信息</el-button>
  </div>
</template>

<script setup lang="ts">
import { Passport, IResUserBasicInfo } from '~/index'
import { Response } from '@gwin/networking'
import { ref } from 'vue'

const basicInfo = ref('')

async function onBasicInfoButtonClick() {
  const response: Response<IResUserBasicInfo> = await Passport.getUserBasicInfo()
  basicInfo.value = JSON.stringify(response.body)
  console.log(basicInfo.value)
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
.basic-info-button {
  margin-top: 15px;
}
</style>
