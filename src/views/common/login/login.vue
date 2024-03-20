<template>
  <ElForm :model="form" size="large" ref="formRef" :rules="rules">
    <ElFormItem prop="phone">
      <ElInput class="w-full" v-model.trim="form.phone" placeholder="请输入手机Phone" @keyup.enter="submit" />
    </ElFormItem>
    <ElFormItem prop="password">
      <ElInput
        type="password"
        class="w-full"
        v-model.trim="form.password"
        placeholder="请输入密码Password"
        @keyup.enter="submit"
      />
    </ElFormItem>
    <ElFormItem prop="verify">
      <ElCol :span="8">
        <ElTooltip :disabled="form.phone !== ''" effect="light" content="请先输入手机号码" placement="left">
          <ElButton
              v-show="showButton"
              :disabled="form.phone === ''"
              :icon="Refresh"
              style="border: 2px solid"
              type="info"
              @click="getQRImage"
              :loading="loading"
              plain
              round
          >生成二维码</ElButton>
        </ElTooltip>
        <img v-show="!showButton" :src="imageUrl" alt="QRImage" @onload="onload" />
      </ElCol>
      <ElCol :span="16">
        <ElRow><ElText v-show="!showButton">请下载“Authenticator”APP，</ElText></ElRow>
        <ElRow><ElText v-show="!showButton">并在APP中扫描左方二维码进行验证。</ElText></ElRow>
        <ElRow>
          <ElInput
              class="w-full mr-4"
              v-model.trim="form.verify"
              placeholder="请输入验证码VerifyCode"
              @keyup.enter="submit"
          />
        </ElRow>
      </ElCol>
    </ElFormItem>
    <ElRow justify="center">
      <ElFormItem>
        <ElButton style="border: 2px solid" type="info" @click="submit" :loading="loading" plain round>登录</ElButton>
      </ElFormItem>
    </ElRow>
  </ElForm>
</template>

<script lang="ts" setup>
import { Refresh } from "@element-plus/icons-vue";
import { common, user } from "@/api";
import type { LoginInfo } from "@/models";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";

const loading = ref(false);
const router = useRouter();
const showButton = ref(true);

const imageUrl = ref("");
const getQRImage = async () => {
  loading.value = true;
  const { data } = await common.qrcode({ phone: form.phone });
  imageUrl.value = window.URL.createObjectURL(
      new Blob([data], { type: "arraybuffer" })
  );
  showButton.value = false;
  loading.value = false;
};
const onload = () => { window.URL.revokeObjectURL(imageUrl.value); };

const form = reactive({
  phone: "",
  password: "",
  verify: "",
});
const formRef = ref<FormInstance>();
const rules: FormRules = {
  phone: [{ required: true, message: "请输入手机号", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  verify: [{ required: true, message: "请输入验证码", trigger: "blur" }],
};

const submit = () => {
  formRef.value!.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      const params = {
        phone: form.phone,
        email: "",
        password: form.password,
        verifyCode: form.verify,
        connectionId: localStorage.getItem("connection"),
      } as LoginInfo;
      if (params.phone || params.email) {
        const { data } = await user.login(params);
        if (data.code === 0) {
          localStorage.setItem("token", data.data.token);
          localStorage.setItem("connection", "");
          await router.push("/home");
          ElMessage.success("登录成功！");
        }
      } else {
        ElMessage.error("用户名格式错误，请重新输入！");
      }
      loading.value = false;
    }
  });
};
</script>
