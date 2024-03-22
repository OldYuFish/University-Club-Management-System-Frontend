<template>
  <div class="h-full rounded bg-white pb-6 px-8">
    <div class="p-6 text-right">
      <ElButton
        v-show="permissionList.includes('/api/activity/create')"
        :icon="Plus"
        type="info"
        plain
        round
        @click="router.push({ path: '/activity/list/apply' })"
      >创建社团</ElButton>
    </div>
    <ElTabs v-model="activeName">
      <ElTabPane
        v-show="permissionList.includes('/api/activity/research/been-accepted')"
        label="活动中"
        name="beenAccepted"
      >
        <OFTable />
      </ElTabPane>
      <ElTabPane
        v-show="permissionList.includes('/api/activity/research/not-submit')"
        label="未提交"
        name="notSubmit"
      >
        <OFTable />
      </ElTabPane>
      <ElTabPane
        v-show="permissionList.includes('/api/activity/research/not-approval')"
        label="未审批"
        name="notApproval"
      >
        <OFTable />
      </ElTabPane>
      <ElTabPane
        v-show="permissionList.includes('/api/activity/research/been-rejected')"
        label="被驳回"
        name="beenRejected"
      >
        <OFTable />
      </ElTabPane>
    </ElTabs>
  </div>
</template>
<script lang="ts" setup>
import store from "@/store";
import type { IPermission } from "@/store/models";
import { Plus } from "@element-plus/icons-vue";
import OFTable from "@/components/Table/index.vue";

const router = useRouter();

const permissionList = ref<string[]>([]);
store.getters['common/userInfo'].permissionList.forEach((permission: IPermission) => {
  permissionList.value.push(permission.url);
});

const loading = ref(false);
const activeName = ref("beenAccepted");
</script>