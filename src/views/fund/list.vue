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
          <ElFormItem label="项目名称" prop="theme">
            <ElInput class="w-5/6" v-model.trim="form.theme" placeholder="请输入项目名称" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="6">
          <ElFormItem label="社团名称" prop="clubName">
            <ElInput class="w-5/6" v-model.trim="form.clubName" placeholder="请输入社团名称" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="6">
          <ElFormItem label="经费类型" prop="type">
            <ElSelect class="w-5/6" v-model.trim="form.type" placeholder="请选择经费类型">
              <ElOption v-for="type in fundType" :label="type.label" :value="type.value" />
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
    <div v-if="permissionList.includes('/api/fund/create')" class="p-6 text-right">
      <ElButton
          :icon="Plus"
          type="info"
          plain
          round
          @click="router.push({ path: '/fund/list/apply' })"
      >创建经费</ElButton>
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
import type { FundQuery } from "@/models";
import { fund } from "@/api";
import { fundType } from "@/utils/DataSets";
import type { FormInstance, FormRules } from "element-plus";

const router = useRouter();

const permissionList = ref<string[]>([]);
store.getters['common/userInfo'].permissionList.forEach((permission: IPermission) => {
  permissionList.value.push(permission.url);
});

const activeName = ref("beenAccepted");

const form = reactive({
  theme: "",
  clubName: "",
  type: "",
});
const formRef = ref<FormInstance>();
const rules: FormRules = {
  theme: [{ max: 24, message: "项目名称不超过24个字符", trigger: "blur" }],
  clubName: [{ max: 24, message: "社团名称不超过24个字符", trigger: "blur" }],
};

const clear = () => {
  form.theme = "";
  form.clubName = "";
  form.type = "";
};

const tabPaneData = reactive([
  {
    showTab: permissionList.value.includes("/api/fund/research/been-accepted"),
    tabLabel: "活动中",
    tabName: "beenAccepted",
    loading: false,
    data: [] as FundQuery[],
    pageConfig: {
      pageIndex: 1,
      pageSize: 10,
      total: 0,
    },
    column: [
      {
        type: "default",
        prop: "theme",
        label: "项目名称",
        sortable: false,
        fixed: false,
      },
      {
        type: "default",
        prop: "clubName",
        label: "申报方",
        sortable: false,
        fixed: false,
      },
      {
        type: "default",
        prop: "type",
        label: "经费类型",
        sortable: false,
        fixed: false,
      },
      {
        type: "default",
        prop: "amount",
        label: "申请总额",
        sortable: false,
        fixed: false,
      },
      {
        type: "default",
        prop: "surplus",
        label: "经费余量",
        sortable: false,
        fixed: false,
      },
    ],
    showDelete: permissionList.value.includes("/api/fund/delete"),
    showUpdate: permissionList.value.includes("/api/fund/update") ||
        permissionList.value.includes("/api/fund/approval"),
    showDetail: permissionList.value.includes("/api/fund/research/detail"),
  },
  {
    showTab: permissionList.value.includes("/api/fund/research/not-submit"),
    tabLabel: "未提交",
    tabName: "notSubmit",
    loading: false,
    data: [] as FundQuery[],
    pageConfig: {
      pageIndex: 1,
      pageSize: 10,
      total: 0,
    },
    column: [
      {
        type: "default",
        prop: "theme",
        label: "项目名称",
        sortable: false,
        fixed: false,
      },
      {
        type: "default",
        prop: "clubName",
        label: "申报方",
        sortable: false,
        fixed: false,
      },
      {
        type: "default",
        prop: "type",
        label: "经费类型",
        sortable: false,
        fixed: false,
      },
      {
        type: "default",
        prop: "amount",
        label: "申请总额",
        sortable: false,
        fixed: false,
      },
      {
        type: "default",
        prop: "surplus",
        label: "经费余量",
        sortable: false,
        fixed: false,
      },
    ],
    showDelete: permissionList.value.includes("/api/fund/delete"),
    showUpdate: permissionList.value.includes("/api/fund/update") ||
        permissionList.value.includes("/api/fund/approval"),
    showDetail: permissionList.value.includes("/api/fund/research/detail"),
  },
  {
    showTab: permissionList.value.includes("/api/fund/research/not-approval"),
    tabLabel: "未审批",
    tabName: "notApproval",
    loading: false,
    data: [] as FundQuery[],
    pageConfig: {
      pageIndex: 1,
      pageSize: 10,
      total: 0,
    },
    column: [
      {
        type: "default",
        prop: "theme",
        label: "项目名称",
        sortable: false,
        fixed: false,
      },
      {
        type: "default",
        prop: "clubName",
        label: "申报方",
        sortable: false,
        fixed: false,
      },
      {
        type: "default",
        prop: "type",
        label: "经费类型",
        sortable: false,
        fixed: false,
      },
      {
        type: "default",
        prop: "amount",
        label: "申请总额",
        sortable: false,
        fixed: false,
      },
      {
        type: "default",
        prop: "surplus",
        label: "经费余量",
        sortable: false,
        fixed: false,
      },
    ],
    showDelete: permissionList.value.includes("/api/fund/delete"),
    showUpdate: permissionList.value.includes("/api/fund/update") ||
        permissionList.value.includes("/api/fund/approval"),
    showDetail: permissionList.value.includes("/api/fund/research/detail"),
  },
  {
    showTab: permissionList.value.includes("/api/fund/research/been-rejected"),
    tabLabel: "被驳回",
    tabName: "beenRejected",
    loading: false,
    data: [] as FundQuery[],
    pageConfig: {
      pageIndex: 1,
      pageSize: 10,
      total: 0,
    },
    column: [
      {
        type: "default",
        prop: "theme",
        label: "项目名称",
        sortable: false,
        fixed: false,
      },
      {
        type: "default",
        prop: "clubName",
        label: "申报方",
        sortable: false,
        fixed: false,
      },
      {
        type: "default",
        prop: "type",
        label: "经费类型",
        sortable: false,
        fixed: false,
      },
      {
        type: "default",
        prop: "amount",
        label: "申请总额",
        sortable: false,
        fixed: false,
      },
      {
        type: "default",
        prop: "surplus",
        label: "经费余量",
        sortable: false,
        fixed: false,
      },
    ],
    showDelete: permissionList.value.includes("/api/fund/delete"),
    showUpdate: permissionList.value.includes("/api/fund/update") ||
        permissionList.value.includes("/api/fund/approval"),
    showDetail: permissionList.value.includes("/api/fund/research/detail"),
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
  "beenAccepted": fund.researchBeenAccepted,
  "notSubmit": fund.researchNotSubmit,
  "notApproval": fund.researchNotApproval,
  "beenRejected": fund.researchBeenRejected,
};

const query = async () => {
  const params: FundQuery = {
    theme: form.theme,
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
      tabPaneData[list2Obj[activeName.value]].data = data.data.fundList as FundQuery[];
      tabPaneData[list2Obj[activeName.value]].pageConfig = data.data.pagination as IPagination;
    }
    tabPaneData[list2Obj[activeName.value]].loading = false;
  }
};

query();
</script>