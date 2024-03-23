<template>
  <div class="h-full rounded bg-white pb-6 px-8">
    <ElForm
      v-if="tabPaneData[0].showTab || tabPaneData[1].showTab || tabPaneData[2].showTab || tabPaneData[3].showTab"
      class="pt-10 pb-4"
      :model="form"
      ref="formRef"
      :rules="rules"
      labelPosition="right">
      <ElRow>
        <ElCol :span="6">
          <ElFormItem label="活动标题" prop="title">
            <ElInput class="w-5/6" v-model.trim="form.title" placeholder="请输入活动标题" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="6">
          <ElFormItem label="主办方" prop="clubName">
            <ElInput class="w-5/6" v-model.trim="form.clubName" placeholder="请输入主办方" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="6">
          <ElFormItem label="活动类型" prop="type">
            <ElSelect class="w-5/6" v-model.trim="form.type" placeholder="请选择活动类型">
              <ElOption v-for="type in activityType" :label="type.label" :value="type.value" />
            </ElSelect>
          </ElFormItem>
        </ElCol>
        <ElCol :span="6">
          <ElButton
              :icon="Search"
              type="info"
              plain
              round
              @click="query"
          >查询</ElButton>
          <ElButton
              :icon="FolderDelete"
              type="info"
              plain
              round
              @click="clear"
          >清空</ElButton>
        </ElCol>
      </ElRow>
    </ElForm>
    <div v-if="permissionList.includes('/api/activity/create')" class="p-6 text-right">
      <ElButton
        :icon="Plus"
        type="info"
        plain
        round
        @click="router.push({ path: '/activity/list/apply' })"
      >创建活动</ElButton>
    </div>
    <ElTabs v-model="activeName">
      <template v-for="tab in tabPaneData">
        <ElTabPane v-if="tab.showTab" :label="tab.tabLabel" :name="tab.tabName">
          <OFTable
            :loading="tab.loading"
            :data="tab.data"
            :pageConfig="tab.pageConfig"
            :column="tab.column"
            :showOperation="tab.showDelete || tab.showUpdate || tab.showDetail"
            :showDelete="tab.showDelete"
            :showUpdate="tab.showUpdate"
            :showDetail="tab.showDetail"
            @pageChange="pageChange"
          />
        </ElTabPane>
      </template>
    </ElTabs>
  </div>
</template>
<script lang="ts" setup>
import store from "@/store";
import type { IPermission } from "@/store/models";
import { FolderDelete, Plus, Search } from "@element-plus/icons-vue";
import OFTable from "@/components/Table/index.vue";
import type { ITable } from "@/models/ITable";
import type { ActivityQuery } from "@/models";
import { activity } from "@/api";
import { activityType } from "@/utils/DataSets";
import type { FormInstance, FormRules } from "element-plus";

const router = useRouter();

const permissionList = ref<string[]>([]);
store.getters['common/userInfo'].permissionList.forEach((permission: IPermission) => {
  permissionList.value.push(permission.url);
});

const activeName = ref("beenAccepted");

const form = reactive({
  title: "",
  clubName: "",
  type: "",
});
const formRef = ref<FormInstance>();
const rules: FormRules = {
  title: [{ max: 36, message: "活动标题不超过36个字符", trigger: "blur" }],
  clubName: [{ max: 24, message: "主办方名称不超过24个字符", trigger: "blur" }],
};

const clear = () => {
  form.title = "";
  form.clubName = "";
  form.type = "";
};

const tabPaneData = reactive([
  {
    showTab: permissionList.value.includes("/api/activity/research/been-accepted"),
    tabLabel: "活动中",
    tabName: "beenAccepted",
    loading: false,
    data: [] as ActivityQuery[],
    pageConfig: {
      pageIndex: 1,
      pageSize: 10,
      total: 0,
    },
    column: [
      {
        type: "default",
        prop: "title",
        label: "标题",
        sortable: false,
        fixed: false,
      },
      {
        type: "default",
        prop: "clubName",
        label: "主办方",
        sortable: false,
        fixed: false,
      },
      {
        type: "default",
        prop: "type",
        label: "活动类型",
        sortable: false,
        fixed: false,
      },
      {
        type: "default",
        prop: "numberLimit",
        label: "人数上限",
        sortable: false,
        fixed: false,
      },
    ],
    showDelete: permissionList.value.includes("/api/activity/delete"),
    showUpdate: permissionList.value.includes("/api/activity/update") ||
        permissionList.value.includes("/api/activity/approval"),
    showDetail: permissionList.value.includes("/api/activity/research/detail"),
  },
  {
    showTab: permissionList.value.includes("/api/activity/research/not-submit"),
    tabLabel: "未提交",
    tabName: "notSubmit",
    loading: false,
    data: [] as ActivityQuery[],
    pageConfig: {
      pageIndex: 1,
      pageSize: 10,
      total: 0,
    },
    column: [
      {
        type: "default",
        prop: "title",
        label: "标题",
        sortable: false,
        fixed: false,
      },
      {
        type: "default",
        prop: "clubName",
        label: "主办方",
        sortable: false,
        fixed: false,
      },
      {
        type: "default",
        prop: "type",
        label: "活动类型",
        sortable: false,
        fixed: false,
      },
      {
        type: "default",
        prop: "numberLimit",
        label: "人数上限",
        sortable: false,
        fixed: false,
      },
    ],
    showDelete: permissionList.value.includes("/api/activity/delete"),
    showUpdate: permissionList.value.includes("/api/activity/update") ||
        permissionList.value.includes("/api/activity/approval"),
    showDetail: permissionList.value.includes("/api/activity/research/detail"),
  },
  {
    showTab: permissionList.value.includes("/api/activity/research/not-approval"),
    tabLabel: "未审批",
    tabName: "notApproval",
    loading: false,
    data: [] as ActivityQuery[],
    pageConfig: {
      pageIndex: 1,
      pageSize: 10,
      total: 0,
    },
    column: [
      {
        type: "default",
        prop: "title",
        label: "标题",
        sortable: false,
        fixed: false,
      },
      {
        type: "default",
        prop: "clubName",
        label: "主办方",
        sortable: false,
        fixed: false,
      },
      {
        type: "default",
        prop: "type",
        label: "活动类型",
        sortable: false,
        fixed: false,
      },
      {
        type: "default",
        prop: "numberLimit",
        label: "人数上限",
        sortable: false,
        fixed: false,
      },
    ],
    showDelete: permissionList.value.includes("/api/activity/delete"),
    showUpdate: permissionList.value.includes("/api/activity/update") ||
        permissionList.value.includes("/api/activity/approval"),
    showDetail: permissionList.value.includes("/api/activity/research/detail"),
  },
  {
    showTab: permissionList.value.includes("/api/activity/research/been-rejected"),
    tabLabel: "被驳回",
    tabName: "beenRejected",
    loading: false,
    data: [] as ActivityQuery[],
    pageConfig: {
      pageIndex: 1,
      pageSize: 10,
      total: 0,
    },
    column: [
      {
        type: "default",
        prop: "title",
        label: "标题",
        sortable: false,
        fixed: false,
      },
      {
        type: "default",
        prop: "clubName",
        label: "主办方",
        sortable: false,
        fixed: false,
      },
      {
        type: "default",
        prop: "type",
        label: "活动类型",
        sortable: false,
        fixed: false,
      },
      {
        type: "default",
        prop: "numberLimit",
        label: "人数上限",
        sortable: false,
        fixed: false,
      },
    ],
    showDelete: permissionList.value.includes("/api/activity/delete"),
    showUpdate: permissionList.value.includes("/api/activity/update") ||
        permissionList.value.includes("/api/activity/approval"),
    showDetail: permissionList.value.includes("/api/activity/research/detail"),
  },
] as ITable[]);

const list2Obj = {
  "beenAccepted": 0,
  "notSubmit": 1,
  "notApproval": 2,
  "beenRejected": 3,
};

const pageChange = (pageIndex: number, pageSize: number) => {
  tabPaneData[list2Obj[activeName.value]].pageConfig.pageIndex = pageIndex;
  tabPaneData[list2Obj[activeName.value]].pageConfig.pageSize = pageSize;
  query();
};

watch(
  () => activeName.value,
  () => {
    query();
  },
);

const list2Func = {
  "beenAccepted": activity.researchBeenAccepted,
  "notSubmit": activity.researchNotSubmit,
  "notApproval": activity.researchNotApproval,
  "beenRejected": activity.researchBeenRejected,
};

const query = async () => {
  const params: ActivityQuery = {
    title: form.title,
    clubName: form.clubName,
    type: form.type,
    statusCode: (list2Obj[activeName.value]+3)%4,
    pageIndex: tabPaneData[list2Obj[activeName.value]].pageConfig.pageIndex,
    pageSize: tabPaneData[list2Obj[activeName.value]].pageConfig.pageSize,
  };
  if (tabPaneData[list2Obj[activeName.value]].showTab) {
    tabPaneData[list2Obj[activeName.value]].loading = true;
    const { data } = await list2Func[activeName.value](params);
    if (data.code === 0) {
      tabPaneData[list2Obj[activeName.value]].data = data.data.activityList as ActivityQuery[];
      tabPaneData[list2Obj[activeName.value]].pageConfig = data.data.pagination as IPagination;
    }
    tabPaneData[list2Obj[activeName.value]].loading = false;
  }
};

query();
</script>