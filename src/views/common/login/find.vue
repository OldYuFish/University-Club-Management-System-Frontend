<template>
  <ElForm :model="verifyForm" size="large" ref="verifyFormRef" :rules="verifyRules">
    <ElFormItem prop="email">
      <ElInput class="w-full" v-model.trim="verifyForm.email" placeholder="请输入邮箱Email" />
    </ElFormItem>
  </ElForm>
  <ElForm :model="findForm" size="large" ref="findFormRef" :rules="findRules">
    <ElFormItem prop="password">
      <ElPopover
          placement="top-start"
          title="密码要求"
          :width="320"
          trigger="hover"
          content="6-16位,由字母、数字、特殊字符任意两种组成"
      >
        <template #reference>
          <ElInput
            type="password"
            class="w-full"
            v-model.trim="findForm.password"
            placeholder="请输入密码Password"
            @keyup.enter="submit"
          />
        </template>
      </ElPopover>
    </ElFormItem>
    <ElFormItem prop="repeatPassword">
      <ElInput
        type="password"
        class="w-full"
        v-model.trim="findForm.repeatPassword"
        placeholder="请确认密码RepeatPassword"
        @keyup.enter="submit"
      />
    </ElFormItem>
    <ElFormItem prop="verifyCode">
      <ElInput
        class="w-2/3 mr-6"
        v-model.trim="findForm.verifyCode"
        placeholder="请输入验证码VerifyCode"
        @keyup.enter="submit"
      />
      <template v-if="countDown">
        <ElButton style="border: 2px solid" type="info" plain round @click="getVerify">验证码</ElButton>
      </template>
      <template v-else>
        <ElCountdown
            :value="timeout"
            format="ss"
            suffix="s后重试"
            @finish="finish"
        />
      </template>
    </ElFormItem>
    <ElRow justify="center">
      <ElFormItem>
        <ElButton style="border: 2px solid" type="info" @click="submit" :loading="loading" plain round>
          找回密码
        </ElButton>
      </ElFormItem>
    </ElRow>
  </ElForm>
</template>

<script lang="ts" setup>
import { user, common } from "@/api";
import type { UserInfo, LoginInfo } from "@/models";
import { ElMessage, FormInstance, FormRules } from "element-plus";

const loading = ref(false);
const router = useRouter();

const countDown = ref(true);
const timeout = ref(0);
const verifyForm = reactive({
  email: "",
});
const verifyFormRef = ref<FormInstance>();
const verifyRules: FormRules = {
  email: [
    { required: true, message: "请输入邮箱或手机号", trigger: "blur" },
    {
      pattern:
          /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:\w(?:[\w-]*\w)?\.)+\w(?:[\w-]*\w)?/,
      message: "请输入合法的邮箱",
      trigger: "blur",
    },
  ],
};

const findForm = reactive({
  password: "",
  repeatPassword: "",
  verifyCode: "",
} as UserInfo);
const findFormRef = ref<FormInstance>();
const findRules: FormRules = {
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 16, message: "密码长度为6-16位", trigger: "blur" },
    {
      pattern: /^(?![a-zA-Z]+$)(?!\d+$)(?![^\da-zA-Z\s]+$).{6,16}$/,
      message: "密码由字母、数字、特殊字符中任意两种组成",
      trigger: "blur",
    },
  ],
  repeatPassword: [
    { required: true, message: "请再次输入密码", trigger: "blur" },
    {
      validator: (_rule, value, callback) => {
        if (value !== findForm.password) {
          callback(new Error("两次输入密码不一致"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
  verifyCode: [{ required: true, message: "请输入验证码", trigger: "blur" }],
};

const getVerify = () => {
  verifyFormRef.value!.validate(async (valid) => {
    if (valid) {
      const { data } = await common.verify({
        email: verifyForm.email, connectionId: localStorage.getItem("connection")!
      });
      if (data.code === 0) {
        countDown.value = false;
        timeout.value = Date.now() + 1000 * 60;
        ElMessage.success("验证码已发送，请查看邮箱！");
      }
    }
  });
};

const finish = () => {
  countDown.value = true;
  timeout.value = 0;
};

const submit = () => {
  verifyFormRef.value!.validate((valid1) => {
    if (valid1) {
      findFormRef.value!.validate(async (valid) => {
        if (valid) {
          loading.value = true;
          const params = {
            email: verifyForm.email,
            password: findForm.password,
            verifyCode: findForm.verifyCode,
            connectionId: localStorage.getItem("connection"),
          } as LoginInfo;
          const { data } = await user.retrieve(params);
          if (data.code === 0) {
            ElMessage.success("密码重置成功！");
            await router.push({ path: "/login" });
          }
          loading.value = false;
        }
      });
    }
  });
};
</script>
