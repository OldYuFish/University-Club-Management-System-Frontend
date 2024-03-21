<template>
  <ElMenu
      style="border-color: #545c64"
      backgroundColor="#545c64"
      textColor="#fff"
      activeTextColor="#fff"
      mode="horizontal"
      :ellipsis="false"
  >
    <ElMenuItem index="0">
      <div style="font-weight: bold; font-size: 36px; font-family: STKaiti">大 学 社 团 管 理 系 统</div>
    </ElMenuItem>
    <div class="flex-grow" />
    <ElMenuItem index="1">
      <ElTooltip placement="bottom" effect="light">
        <template #content>
          <ElDescriptions title="个人信息" :column="1">
            <template #extra>
              <ElButton link @click="openMessageBox">注销账号</ElButton>
            </template>
            <ElDescriptionsItem label="姓名：">{{ userInfo.realName }}</ElDescriptionsItem>
            <ElDescriptionsItem label="编号：">{{ userInfo.userNumber }}</ElDescriptionsItem>
            <ElDescriptionsItem label="邮箱：">{{ userInfo.email }}</ElDescriptionsItem>
          </ElDescriptions>
        </template>
        <ElAvatar :src="avatarUrl" :size="50" />
      </ElTooltip>
    </ElMenuItem>
    <ElMenuItem index="2" @click="router.push({ path: '/center' })">
      <template #title>个人中心</template>
    </ElMenuItem>
    <ElMenuItem index="3">
      <ElTooltip placement="bottom" effect="light">
        <template #content>
          <span>退出登录</span>
        </template>
        <ElButton
            type="info"
            size="large"
            circle
            plain
            @click="logout"
        >
          <ElIcon class="m-0">
            <SwitchButton />
          </ElIcon>
        </ElButton>
      </ElTooltip>
    </ElMenuItem>
  </ElMenu>
</template>
<script lang="ts" setup>
import store from "@/store";
import type { IUserInfo } from "@/store/models";
import { ElMessage, ElMessageBox } from "element-plus";
import { common, files } from "@/api";
import { SwitchButton } from "@element-plus/icons-vue";

const router = useRouter();
const userInfo: IUserInfo = store.getters['common/userInfo'];

const logout = () => {
  common.logout({ email: userInfo.email });
};

const avatarUrl = ref("/image/default-avatar.png");
const getAvatar = async () => {
  const { data } = await files.researchLogin({ email: userInfo.email });
  if (data.code === 0) {
    const res = await files.picture({ fileName: data.data.fileName });
    avatarUrl.value = window.URL.createObjectURL(
        new Blob([res.data], { type: "arraybuffer" })
    );
  }
};

const openMessageBox = () => {
  ElMessageBox.prompt('请在下方输入框中输入注册邮箱', '注销账号', {
    confirmButtonClass: 'delete-button',
    confirmButtonText: '确认注销',
    cancelButtonText: '取消',
    inputPattern:
        /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:\w(?:[\w-]*\w)?\.)+\w(?:[\w-]*\w)?/,
    inputErrorMessage: '邮箱格式有误',
  }).then(async ({ value }) => {
    if (value !== userInfo.email) {
      ElMessage.error("输入邮箱与本账号注册邮箱不一致！");
    } else {
      const { data } = await common.delete({ email: value });
      if (data.code === 0) {
        await router.push({ path: '/login' });
        ElMessage.success("账号已注销！");
      } else {
        ElMessage.error("账号注销失败！");
      }
    }
  });
};

getAvatar();
</script>
<style scoped>
.flex-grow {
  flex-grow: 1;
}

.delete-button {
  background-color: red !important;
  color: white !important;
}
</style>
