<template>
  <div class="common-layout">
    <ElContainer>
      <ElHeader></ElHeader>
      <ElMain>
        <ElRow justify="center" align="middle">
          <ElCard style="background-color: rgba(255, 255, 255, 0.8);" shadow="always" :body-style="{ textAlign: 'center' }">
            <template #header>
              <ElRow justify="center">
                <img src="/image/logo.png" alt="logo">
              </ElRow>
              <ElRow justify="center">
                <div class="mt-4" style="font-weight: bold; font-size: 36px; font-family: STKaiti">社 团 管 理 系 统</div>
              </ElRow>
              <ElRow justify="center">
                <div style="font-size: 18px;">Club Management System</div>
              </ElRow>
            </template>
            <ElTabs v-model="activeName" class="demo-tabs">
              <ElTabPane label="登录 (Login)" name="login">
                <OFLogin :imageUrl="imageUrl" :getImage="getCaptcha" />
              </ElTabPane>
              <ElTabPane label="注册 (Register)" name="register">
                <OFRegister :imageUrl="imageUrl" :getImage="getCaptcha" />
              </ElTabPane>
              <ElTabPane label="找回密码 (FindPassword)" name="findPassword">
                <OFFind :imageUrl="imageUrl" :getImage="getCaptcha" />
              </ElTabPane>
            </ElTabs>
          </ElCard>
        </ElRow>
      </ElMain>
    </ElContainer>
  </div>
</template>

<script lang="ts" setup>
import OFLogin from './login.vue';
import OFRegister from './register.vue';
import OFFind from './find.vue';
import { common } from "@/api";

const activeName = ref("login");
const imageUrl = ref("");
const getCaptcha = async () => {
  const { data } = await common.captcha({ connectionId: localStorage.getItem("connectionId")! });
  imageUrl.value = window.URL.createObjectURL(
      new Blob([data], { type: "arraybuffer" })
  );
};

getCaptcha();
</script>

<style>
body {
  background: url('/image/wust.jpg') no-repeat fixed;
  background-size: 100% 100%;
}
</style>
