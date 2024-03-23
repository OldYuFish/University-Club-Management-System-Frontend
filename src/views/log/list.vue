<template>
  <div class="h-full rounded bg-white pb-6 px-8">
    <ElForm
      v-if="permissionList.includes('/api/log/research')"
      class="pt-10 pb-4"
      :model="form"
      ref="formRef"
      :rules="rules"
      labelPosition="right"
    >
      <ElRow>
        <ElCol :span="6">
          <ElFormItem label="操作对象" prop="object">
            <ElInput class="w-5/6" v-model.trim="form.object" placeholder="请输入操作对象" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="6">
          <ElFormItem label="操作名称" prop="operate">
            <ElInput class="w-5/6" v-model.trim="form.operate" placeholder="请输入操作名称" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="6">
          <ElFormItem label="操作人" prop="userNumber">
            <ElInput class="w-5/6" v-model.trim="form.userNumber" placeholder="请输入操作人" />
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
    <OFTable
      v-if="permissionList.includes('/api/log/research')"
      :loading="tableData.loading"
      :data="tableData.data"
      :pageConfig="tableData.pageConfig"
      :column="tableData.column"
      :showOperation="false"
      @pageChange="pageChange"
    />
  </div>
</template>
<script lang="ts" setup>
import store from "@/store";
import type { IPermission } from "@/store/models";
import { FolderDelete, Search } from "@element-plus/icons-vue";
import OFTable from "@/components/Table/index.vue";
import type { IColumn } from "@/models/ITable";
import type { LogQuery } from "@/models";
import { log } from "@/api";
import type { FormInstance, FormRules } from "element-plus";

const permissionList = ref<string[]>([]);
store.getters['common/userInfo'].permissionList.forEach((permission: IPermission) => {
  permissionList.value.push(permission.url);
});

const form = reactive({
  object: "",
  operate: "",
  userNumber: "",
});
const formRef = ref<FormInstance>();
const rules: FormRules = {
  object: [{ max: 12, message: "操作对象不超过12个字符", trigger: "blur" }],
  operate: [{ max: 24, message: "操作名称不超过24个字符", trigger: "blur" }],
  userNumber: [{ max: 24, message: "操作人不超过24个字符", trigger: "blur" }],
};

const clear = () => {
  form.object = "";
  form.operate = "";
  form.userNumber = "";
};

const tableData = reactive({
  loading: false,
  data: [] as LogQuery[],
  pageConfig: {
    pageIndex: 1,
    pageSize: 10,
    total: 0,
  } as IPagination,
  column: [
    {
      type: "default",
      prop: "operateTime",
      label: "操作时间",
      sortable: true,
      fixed: false,
    },
    {
      type: "default",
      prop: "object",
      label: "操作对象",
      sortable: false,
      fixed: false,
    },
    {
      type: "default",
      prop: "operate",
      label: "操作名称",
      sortable: false,
      fixed: false,
    },
    {
      type: "default",
      prop: "userNumber",
      label: "操作人",
      sortable: false,
      fixed: false,
    },
  ] as IColumn[],
});

const pageChange = (pageIndex: number, pageSize: number) => {
  tableData.pageConfig.pageIndex = pageIndex;
  tableData.pageConfig.pageSize = pageSize;
  query();
};

const query = async () => {
  const params: LogQuery = {
    object: form.object,
    operate: form.operate,
    userNumber: form.userNumber,
    pageIndex: tableData.pageConfig.pageIndex,
    pageSize: tableData.pageConfig.pageSize,
  };
  if (permissionList.value.includes("/api/log/research")) {
    tableData.loading = true;
    const { data } = await log.research(params);
    if (data.code === 0) {
      tableData.data = data.data.logList as LogQuery[];
      tableData.pageConfig = data.data.pagination as IPagination;
    }
    tableData.loading = false;
  }
};

query();
</script>