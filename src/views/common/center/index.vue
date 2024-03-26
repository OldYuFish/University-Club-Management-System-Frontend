<template>
  <div class="h-full rounded bg-white pb-6 px-8">
    <div
      class="py-3"
      style="font-size: x-large; font-weight: bold; color: #909399; text-align: center"
    >———— 个人中心 ————</div>
    <ElRow>
      <ElCol :span="12">
        <ElCard :body-style="{ padding: '20px 20px 0px 20px' }" class="m-2 h-full">
          <ElDescriptions :column="1" border>
            <template #title>
              <ElRow>
                <ElAvatar class="mr-4" :src="avatarUrl" :size="60" />
                <input
                    id="uploadAvatar"
                    type="file"
                    name="file"
                    @change="changeAvatar($event)"
                    style="display: none"
                    :multiple="false"
                />
                <ElTooltip effect="light" placement="right">
                  <template #content>
                    <div style="color: #545c64">请上传后缀为"jpg/png"，且大小不超过5MB的图片，</div>
                    <div style="color: #545c64">并保证文件名不超过18个字符</div>
                  </template>
                  <ElButton
                      class="mt-6"
                      :icon="Upload"
                      type="info"
                      plain
                      round
                      @click="clickFileInput"
                  >上传头像</ElButton>
                </ElTooltip>
              </ElRow>
            </template>
            <template v-for="detail of details" :key="detail.id">
              <ElDescriptionsItem width="160px">
                <template #label>
                  <div class="cell-item">
                    <ElIcon>
                      <Component :is="detail.icon" />
                    </ElIcon>
                    {{ detail.label }}
                  </div>
                </template>
                {{ detail.value }}
              </ElDescriptionsItem>
            </template>
          </ElDescriptions>
        </ElCard>
      </ElCol>
      <ElCol :span="12">
        <ElCard :body-style="{ padding: '20px 20px 0px 20px' }" class="m-2 h-full">
          <template #header>
            <div style="color: #545c64; font-size: large">修改密码</div>
          </template>
          <ElForm :model="passwordForm" ref="passwordFormRef" :rules="passwordRules">
            <ElFormItem prop="oldPassword">
              <ElInput v-model.trim="passwordForm.oldPassword" placeholder="请输入原密码OriginalPassword" />
            </ElFormItem>
            <ElFormItem prop="password">
              <ElInput v-model.trim="passwordForm.password" placeholder="请输入新密码NewPassword" />
            </ElFormItem>
            <ElFormItem prop="repeatPassword">
              <ElInput v-model.trim="passwordForm.repeatPassword" placeholder="请再次输入新密码RepeatNewPassword" />
            </ElFormItem>
            <ElFormItem>
              <ElButton type="info" :icon="Edit" round plain :loading="passwordLoading" @click="updatePassword">
                提交
              </ElButton>
            </ElFormItem>
          </ElForm>
        </ElCard>
      </ElCol>
    </ElRow>
    <ElRow>
      <ElCol :span="12">
        <ElCard :body-style="{ padding: '20px 20px 0px 20px' }" class="m-2 h-full">
          <template #header>
            <div style="color: #545c64; font-size: large">修改手机</div>
          </template>
          <ElForm :model="phoneForm" ref="phoneFormRef" :rules="phoneRules">
            <ElFormItem prop="password">
              <ElInput v-model.trim="phoneForm.password" placeholder="请输入密码Password" />
            </ElFormItem>
            <ElFormItem prop="phone">
              <ElInput v-model.trim="phoneForm.phone" placeholder="请输入新手机NewPhone" />
            </ElFormItem>
            <ElFormItem>
              <ElButton type="info" :icon="Edit" round plain :loading="phoneLoading" @click="updatePhone">
                提交
              </ElButton>
            </ElFormItem>
          </ElForm>
        </ElCard>
      </ElCol>
      <ElCol :span="12">
        <ElCard :body-style="{ padding: '20px 20px 0px 20px' }" class="m-2 h-full">
          <template #header>
            <div style="color: #545c64; font-size: large">修改邮箱</div>
          </template>
          <ElForm :model="emailForm" ref="emailFormRef" :rules="emailRules">
            <ElFormItem prop="password">
              <ElInput v-model.trim="emailForm.password" placeholder="请输入密码Password" />
            </ElFormItem>
            <ElFormItem prop="email">
              <ElInput v-model.trim="emailForm.email" placeholder="请输入新邮箱NewEmail" />
            </ElFormItem>
            <ElFormItem>
              <ElButton type="info" :icon="Edit" round plain :loading="emailLoading" @click="updateEmail">
                提交
              </ElButton>
            </ElFormItem>
          </ElForm>
        </ElCard>
      </ElCol>
    </ElRow>
  </div>
</template>
<script lang="ts" setup>
import type { FormInstance, FormRules } from "element-plus";
import { Postcard, User, Iphone, Message, Upload, Edit } from "@element-plus/icons-vue";
import { files, user } from "@/api";
import store from "@/store";
import { UserQuery } from "@/models";
import { ElMessage } from "element-plus";
import SparkMD5 from "spark-md5";

const userInfo = store.getters['common/userInfo'];

const userDetail = reactive({
  realName: "",
  studentNumber: "",
  teacherNumber: "",
  phone: "",
  email: "",
  roleName: userInfo.role.roleName,
} as UserQuery);

const avatarUrl = ref("/image/default-avatar.png");
const avatarName = ref("");
const getAvatar = async () => {
  const { data } = await files.researchLogin({ email: userInfo.email });
  if (data.code === 0) {
    avatarName.value = data.data.fileName;
    const res = await files.picture({ fileName: avatarName.value });
    if (res.data.code === 0) {
      avatarUrl.value = window.URL.createObjectURL(
          new Blob([res.data], { type: "arraybuffer" })
      );
    }
  }
};

const clickFileInput = () => {
  document.getElementById('uploadAvatar')!.click();
};

const changeAvatar = (e) => {
  const file = e.target.files[0];
  const fileName: string = e.target.value.split('\\')[2];
  if (!['jpg', 'png'].includes(fileName.split('.').pop()!)) {
    e.target.value = '';
    ElMessage.error("您上传的文件格式不符，请重新上传！");
    return ;
  }
  if (fileName.length > 22) {
    e.target.value = '';
    ElMessage.error("您上传的文件名称超过18个字符，请重新上传！");
    return ;
  }
  const size: number = file.size/1024/1024;
  if (size > 5) {
    e.target.value = '';
    ElMessage.error("您上传的文件超过5MB，请重新上传！");
    return ;
  }
  const formData = new FormData();
  const fileReader = new FileReader();
  const spark = new SparkMD5();
  fileReader.readAsBinaryString(file);
  fileReader.onload = async (element) => {
    spark.appendBinary(element.target!.result as string);
    const md5 = spark.end();
    formData.append("multipartFile", file);
    formData.append("fileName", fileName);
    formData.append("id", userInfo.id.toString());
    formData.append("type", "user");
    formData.append("md5Code", md5);
    const { data } = await files.create(formData);
    if (data.code === 0) {
      ElMessage.success("上传成功！");
      await getAvatar();
    }
  };
};

const query = async () => {
  const { data } = await user.researchDetail({ email: userInfo.email });
  if (data.code === 0) {
    const loginInfo = data.data.loginInfo;
    userDetail.realName = loginInfo.realName;
    userDetail.studentNumber = loginInfo.studentNumber;
    userDetail.teacherNumber = loginInfo.teacherNumber;
    userDetail.phone = loginInfo.phone;
    userDetail.email = loginInfo.email;
  }
};

const details = [
  {
    id: '1',
    label: '姓名',
    value: userDetail.realName,
    icon: User,
  },
  {
    id: '2',
    label: userDetail.studentNumber ? '学号' : '工号',
    value: userDetail.studentNumber ? userDetail.studentNumber : userDetail.teacherNumber,
    icon: Postcard,
  },
  {
    id: '3',
    label: '手机',
    value: userDetail.phone,
    icon: Iphone,
  },
  {
    id: '4',
    label: '邮箱',
    value: userDetail.email,
    icon: Message,
  },
];

const passwordLoading = ref(false);
const passwordForm = reactive({
  oldPassword: "",
  password: "",
  repeatPassword: "",
});
const passwordFormRef = ref<FormInstance>();
const passwordRules: FormRules = {
  oldPassword: [
    { required: true, message: "请输入原密码", trigger: "blur" },
    {
      pattern: /^(?![a-zA-Z]+$)(?!\d+$)(?![^\da-zA-Z\s]+$).{6,16}$/,
      message: "请检查填写密码是否有误",
      trigger: "blur",
    },
  ],
  password: [
    { min: 6, max: 16, message: "密码长度为6-16位", trigger: "blur" },
    {
      pattern: /^(?![a-zA-Z]+$)(?!\d+$)(?![^\da-zA-Z\s]+$).{6,16}$/,
      message: "密码由字母、数字、特殊字符中任意两种组成",
      trigger: "blur",
    },
  ],
  repeatPassword: [
    {
      validator: (_rule, value, callback) => {
        if (passwordForm.password !== "" && value === "") {
          callback(new Error("请确认新密码"));
        } else if (value !== passwordForm.password) {
          callback(new Error("两次输入密码不一致"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
};

const updatePassword = () => {
  passwordFormRef.value!.validate(async (valid) => {
    if (valid) {
      passwordLoading.value = true;
      const params = {
        email: userInfo.email,
        oldPassword: passwordForm.oldPassword,
        password: passwordForm.password,
      };
      const { data } = await user.updatePassword(params);
      if (data.code === 0) {
        ElMessage.success("密码修改成功！");
      }
      passwordLoading.value = false;
    }
  });
};

const phoneLoading = ref(false);
const phoneForm = reactive({
  password: "",
  phone: "",
});
const phoneFormRef = ref<FormInstance>();
const phoneRules: FormRules = {
  password: [
    { min: 6, max: 16, message: "密码长度为6-16位", trigger: "blur" },
    {
      pattern: /^(?![a-zA-Z]+$)(?!\d+$)(?![^\da-zA-Z\s]+$).{6,16}$/,
      message: "密码由字母、数字、特殊字符中任意两种组成",
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
};

const updatePhone = () => {
  phoneFormRef.value!.validate(async (valid) => {
    if (valid) {
      phoneLoading.value = true;
      const params = {
        email: userInfo.email,
        phone: phoneForm.phone,
        password: phoneForm.password,
      };
      const { data } = await user.updatePhone(params);
      if (data.code === 0) {
        ElMessage.success("手机修改成功！");
      }
      phoneLoading.value = false;
    }
  });
};

const emailLoading = ref(false);
const emailForm = reactive({
  password: "",
  email: "",
});
const emailFormRef = ref<FormInstance>();
const emailRules: FormRules = {
  password: [
    { min: 6, max: 16, message: "密码长度为6-16位", trigger: "blur" },
    {
      pattern: /^(?![a-zA-Z]+$)(?!\d+$)(?![^\da-zA-Z\s]+$).{6,16}$/,
      message: "密码由字母、数字、特殊字符中任意两种组成",
      trigger: "blur",
    },
  ],
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    {
      pattern:
          /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:\w(?:[\w-]*\w)?\.)+\w(?:[\w-]*\w)?/,
      message: "请输入合法的邮箱",
      trigger: "blur",
    },
  ],
};

const updateEmail = () => {
  emailFormRef.value!.validate(async (valid) => {
    if (valid) {
      emailLoading.value = true;
      const params = {
        oldEmail: userInfo.email,
        email: emailForm.email,
        password: emailForm.password,
      };
      const { data } = await user.updateEmail(params);
      if (data.code === 0) {
        ElMessage.success("邮箱修改成功！");
      }
      emailLoading.value = false;
    }
  });
};

query();
getAvatar();
</script>
<style scoped>
.cell-item {
  display: flex;
  align-items: center;
}
</style>
