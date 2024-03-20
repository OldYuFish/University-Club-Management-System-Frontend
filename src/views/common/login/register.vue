<template>
  <ElForm :model="registerForm" size="large" ref="registerFormRef" :rules="registerRules">
    <ElFormItem prop="realName">
      <ElInput
        class="w-full"
        v-model.trim="registerForm.realName"
        placeholder="请输入姓名RealName"
        @keyup.enter="submit"
      />
    </ElFormItem>
    <ElFormItem>
      <ElSelect v-model="type" placeholder="请选择您的身份">
        <ElOption label="学生（student）" value="studentNumber" />
        <ElOption label="教师（teacher）" value="teacherNumber" />
      </ElSelect>
    </ElFormItem>
    <template v-if="type === 'teacherNumber'">
      <ElFormItem prop="teacherNumber">
        <ElInput
          class="w-full"
          v-model.trim="registerForm.teacherNumber"
          placeholder="请输入工号TeacherNumber"
          @keyup.enter="submit"
        />
      </ElFormItem>
    </template>
    <template v-else>
      <ElFormItem prop="studentNumber">
        <ElTooltip :disabled="type !== ''" effect="light" content="请先选择您的身份" placement="left">
          <ElInput
            :disabled="!type"
            class="w-full"
            v-model.trim="registerForm.studentNumber"
            placeholder="请输入学号StudentNumber"
            @keyup.enter="submit"
          />
        </ElTooltip>
      </ElFormItem>
    </template>
    <ElFormItem prop="email">
      <ElInput class="w-full" v-model.trim="registerForm.email" placeholder="请输入邮箱Email" @keyup.enter="submit" />
    </ElFormItem>
    <ElFormItem prop="phone">
      <ElInput class="w-full" v-model.trim="registerForm.phone" placeholder="请输入手机号Phone" @keyup.enter="submit" />
    </ElFormItem>
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
            v-model.trim="registerForm.password"
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
        v-model.trim="registerForm.repeatPassword"
        placeholder="请确认密码RepeatPassword"
        @keyup.enter="submit"
      />
    </ElFormItem>
    <ElFormItem prop="verifyCode">
      <ElInput
        class="w-2/3 mr-4"
        v-model.trim="registerForm.verifyCode"
        placeholder="请输入图形验证码VerifyCode"
        @keyup.enter="submit"
      />
      <img :src="imageUrl" class="w-1/4" alt="图形验证码" @onload="onload" @click="getCaptcha" />
    </ElFormItem>
    <ElRow justify="center">
      <ElFormItem>
        <ElButton style="border: 2px solid" type="info" @click="submit" :loading="loading" plain round>注册</ElButton>
      </ElFormItem>
    </ElRow>
  </ElForm>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from "element-plus";
import type { LoginInfo, UserInfo } from "@/models";
import { ElMessage } from "element-plus";
import { common, user } from "@/api";

const loading = ref(false);
const router = useRouter();
const type = ref("");

const imageUrl = ref("");
const getCaptcha = async () => {
  const { data } = await common.captcha({ connectionId: localStorage.getItem("connection")! });
  imageUrl.value = window.URL.createObjectURL(
      new Blob([data], { type: "arraybuffer" })
  );
};

const onload = () => { window.URL.revokeObjectURL(imageUrl.value); };

const registerForm = reactive({
  realName: "",
  studentNumber: "",
  teacherNumber: "",
  phone: "",
  email: "",
  password: "",
  repeatPassword: "",
  verifyCode: "",
} as UserInfo)
const registerFormRef = ref<FormInstance>();
const registerRules: FormRules = {
  realName: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  studentNumber: [
    {
      validator: (_rule, value, callback) => {
        if (type.value === 'studentNumber') {
          if (value === '') {
            callback(new Error("请输入学号"));
          } else if (isNaN(Number(value))) {
            callback(new Error("请输入合法的学号"));
          } else {
            callback();
          }
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
  teacherNumber: [
    {
      validator: (_rule, value, callback) => {
        if (type.value === 'teacherNumber') {
          if (value === '') {
            callback(new Error("请输入工号"));
          } else if (isNaN(Number(value))) {
            callback(new Error("请输入合法的工号"));
          } else {
            callback();
          }
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
  email: [
    { required: true, message: "请输入邮箱或手机号", trigger: "blur" },
    {
      pattern:
          /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:\w(?:[\w-]*\w)?\.)+\w(?:[\w-]*\w)?/,
      message: "请输入合法的邮箱",
      trigger: "blur",
    },
  ],
  phone: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    { len: 11, message: "手机号必须为11位", trigger: "blur" },
    {
      pattern:
          /^(13[0-9]|14[579]|15[0-3,5-9]|166|17[0135678]|18[0-9]|19[89])\d{8}$/,
      message: "请输入合法的手机号",
      trigger: "blur",
    },
  ],
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
        if (value !== registerForm.password) {
          callback(new Error("两次输入密码不一致"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
  verifyCode: [{ required: true, message: "请输入验证码", trigger: "blur" }],
}

const submit = () => {
  registerFormRef.value!.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      const params = {
        realName: registerForm.realName,
        studentNumber: registerForm.studentNumber,
        teacherNumber: registerForm.teacherNumber,
        phone: registerForm.phone,
        email: registerForm.email,
        password: registerForm.password,
        verifyCode: registerForm.verifyCode,
        connectionId: localStorage.getItem("connection"),
      } as UserInfo;
      const { data } = await user.register(params);
      if (data.code === 0) {
          ElMessage.success("注册成功！");
      }
      loading.value = false;
    }
  });
};

getCaptcha();
</script>
