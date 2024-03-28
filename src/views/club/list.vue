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
        <ElCol :span="8">
          <ElFormItem label="社团名称" prop="clubName">
            <ElInput class="w-5/6" v-model.trim="form.clubName" placeholder="请输入社团名称" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="社团类型" prop="type">
            <ElSelect class="w-5/6" v-model.trim="form.type" placeholder="请选择社团类型">
              <ElOption v-for="type in clubType" :label="type.label" :value="type.value" />
            </ElSelect>
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="社团级别" prop="clubLevel">
            <ElSelect class="w-5/6" v-model.trim="form.clubLevel" placeholder="请选择社团级别">
              <ElOption v-for="level in clubLevel" :label="level.label" :value="level.value" />
            </ElSelect>
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow>
        <ElCol :span="8">
          <ElFormItem label="所属学院" prop="department">
            <ElInput class="w-5/6" v-model.trim="form.department" placeholder="请输入所属学院" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="8" />
        <ElCol :span="8">
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
    <div v-if="permissionList.includes('/api/club/create')" class="p-6 text-right">
      <ElButton
          :icon="Plus"
          type="info"
          plain
          round
          @click="router.push({ path: '/club/apply/0' })"
      >创建社团</ElButton>
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
import type { ClubQuery } from "@/models";
import { club } from "@/api";
import { clubLevel, clubType } from "@/utils/DataSets";
import type { FormInstance, FormRules } from "element-plus";

const router = useRouter();

const permissionList = ref<string[]>([]);
store.getters['common/userInfo'].permissionList.forEach((permission: IPermission) => {
  permissionList.value.push(permission.url);
});

const activeName = ref("beenAccepted");

const form = reactive({
  clubName: "",
  type: "",
  clubLevel: "",
  department: "",
});
const formRef = ref<FormInstance>();
const rules: FormRules = {
  clubName: [{ max: 24, message: "社团名称不超过24个字符", trigger: "blur" }],
  department: [{ max: 24, message: "所属学院不超过24个字符", trigger: "blur" }],
};

const clear = () => {
  form.clubName = "";
  form.type = "";
  form.clubLevel = "";
  form.department = "";
};

const tabPaneData = reactive([
  {
    showTab: permissionList.value.includes("/api/club/research/been-accepted"),
    tabLabel: "活动中",
    tabName: "beenAccepted",
    loading: false,
    data: [] as ClubQuery[],
    pageConfig: {
      pageIndex: 1,
      pageSize: 10,
      total: 0,
    },
    column: [
      {
        type: "default",
        prop: "clubName",
        label: "社团名称",
        sortable: false,
        fixed: false,
      },
      {
        type: "default",
        prop: "realName",
        label: "社团会长",
        sortable: false,
        fixed: false,
      },
      {
        type: "default",
        prop: "type",
        label: "社团类型",
        sortable: false,
        fixed: false,
      },
      {
        type: "default",
        prop: "clubLevel",
        label: "社团级别",
        sortable: false,
        fixed: false,
      },
      {
        type: "default",
        prop: "department",
        label: "所属学院",
        sortable: false,
        fixed: false,
      },
    ],
    showDelete: permissionList.value.includes("/api/club/delete"),
    showUpdate: permissionList.value.includes("/api/club/update") ||
        permissionList.value.includes("/api/club/approval"),
    showDetail: permissionList.value.includes("/api/club/research/detail"),
  },
  {
    showTab: permissionList.value.includes("/api/club/research/not-submit"),
    tabLabel: "未提交",
    tabName: "notSubmit",
    loading: false,
    data: [] as ClubQuery[],
    pageConfig: {
      pageIndex: 1,
      pageSize: 10,
      total: 0,
    },
    column: [
      {
        type: "default",
        prop: "clubName",
        label: "社团名称",
        sortable: false,
        fixed: false,
      },
      {
        type: "default",
        prop: "realName",
        label: "社团会长",
        sortable: false,
        fixed: false,
      },
      {
        type: "default",
        prop: "type",
        label: "社团类型",
        sortable: false,
        fixed: false,
      },
      {
        type: "default",
        prop: "clubLevel",
        label: "社团级别",
        sortable: false,
        fixed: false,
      },
      {
        type: "default",
        prop: "department",
        label: "所属学院",
        sortable: false,
        fixed: false,
      },
    ],
    showDelete: permissionList.value.includes("/api/club/delete"),
    showUpdate: permissionList.value.includes("/api/club/update") ||
        permissionList.value.includes("/api/club/approval"),
    showDetail: permissionList.value.includes("/api/club/research/detail"),
  },
  {
    showTab: permissionList.value.includes("/api/club/research/not-approval"),
    tabLabel: "未审批",
    tabName: "notApproval",
    loading: false,
    data: [] as ClubQuery[],
    pageConfig: {
      pageIndex: 1,
      pageSize: 10,
      total: 0,
    },
    column: [
      {
        type: "default",
        prop: "clubName",
        label: "社团名称",
        sortable: false,
        fixed: false,
      },
      {
        type: "default",
        prop: "realName",
        label: "社团会长",
        sortable: false,
        fixed: false,
      },
      {
        type: "default",
        prop: "type",
        label: "社团类型",
        sortable: false,
        fixed: false,
      },
      {
        type: "default",
        prop: "clubLevel",
        label: "社团级别",
        sortable: false,
        fixed: false,
      },
      {
        type: "default",
        prop: "department",
        label: "所属学院",
        sortable: false,
        fixed: false,
      },
    ],
    showDelete: permissionList.value.includes("/api/club/delete"),
    showUpdate: permissionList.value.includes("/api/club/update") ||
        permissionList.value.includes("/api/club/approval"),
    showDetail: permissionList.value.includes("/api/club/research/detail"),
  },
  {
    showTab: permissionList.value.includes("/api/club/research/been-rejected"),
    tabLabel: "被驳回",
    tabName: "beenRejected",
    loading: false,
    data: [] as ClubQuery[],
    pageConfig: {
      pageIndex: 1,
      pageSize: 10,
      total: 0,
    },
    column: [
      {
        type: "default",
        prop: "clubName",
        label: "社团名称",
        sortable: false,
        fixed: false,
      },
      {
        type: "default",
        prop: "realName",
        label: "社团会长",
        sortable: false,
        fixed: false,
      },
      {
        type: "default",
        prop: "type",
        label: "社团类型",
        sortable: false,
        fixed: false,
      },
      {
        type: "default",
        prop: "clubLevel",
        label: "社团级别",
        sortable: false,
        fixed: false,
      },
      {
        type: "default",
        prop: "department",
        label: "所属学院",
        sortable: false,
        fixed: false,
      },
    ],
    showDelete: permissionList.value.includes("/api/club/delete"),
    showUpdate: permissionList.value.includes("/api/club/update") ||
        permissionList.value.includes("/api/club/approval"),
    showDetail: permissionList.value.includes("/api/club/research/detail"),
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
  "beenAccepted": club.researchBeenAccepted,
  "notSubmit": club.researchNotSubmit,
  "notApproval": club.researchNotApproval,
  "beenRejected": club.researchBeenRejected,
};

const query = async () => {
  const params: ClubQuery = {
    clubName: form.clubName,
    type: form.type,
    clubLevel: form.clubLevel,
    department: form.department,
    statusCode: (list2Obj[activeName.value]+3)%4,
    pageIndex: tabPaneData[list2Obj[activeName.value]].pageConfig.pageIndex,
    pageSize: tabPaneData[list2Obj[activeName.value]].pageConfig.pageSize,
  };
  if (tabPaneData[list2Obj[activeName.value]].showTab) {
    tabPaneData[list2Obj[activeName.value]].loading = true;
    const { data } = await list2Func[activeName.value](params);
    if (data.code === 0) {
      tabPaneData[list2Obj[activeName.value]].data = data.data.clubList as ClubQuery[];
      tabPaneData[list2Obj[activeName.value]].pageConfig = data.data.pagination as IPagination;
    }
    tabPaneData[list2Obj[activeName.value]].loading = false;
  }
};

query();
</script>