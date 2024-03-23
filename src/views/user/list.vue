<template>
  <div class="h-full rounded bg-white pb-6 px-8">
    <ElForm
        v-if="permissionList.includes('/api/user/research/basic')"
        class="pt-10 pb-4"
        :model="form"
        ref="formRef"
        :rules="rules"
        labelPosition="right"
    >
      <ElRow>
        <ElCol :span="6">
          <ElFormItem label="用户姓名" prop="realName">
            <ElInput class="w-5/6" v-model.trim="form.realName" placeholder="请输入用户姓名" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="学号/工号" prop="userNumber">
            <ElInput class="w-5/6" v-model.trim="form.userNumber" placeholder="请输入学号/工号">
              <template #prepend>
                <ElSelect style="width: 100px" v-model="form.type" placeholder="请选择">
                  <ElOption label="学号" value="studentNumber" />
                  <ElOption label="工号" value="teacherNumber" />
                </ElSelect>
              </template>
            </ElInput>
          </ElFormItem>
        </ElCol>
        <ElCol :span="6">
          <ElFormItem label="手机号码" prop="phone">
            <ElInput class="w-5/6" v-model.trim="form.phone" placeholder="请输入手机号码" />
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow>
        <ElCol :span="6">
          <ElFormItem label="邮箱地址" prop="email">
            <ElInput class="w-5/6" v-model.trim="form.email" placeholder="请输入邮箱地址" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="6">
          <ElFormItem label="用户状态" prop="isDelete">
            <ElSelect class="w-5/6" v-model="form.isDelete" placeholder="请选择用户状态">
              <ElOption label="活动中" :value="0" />
              <ElOption label="已注销" :value="1" />
            </ElSelect>
          </ElFormItem>
        </ElCol>
        <ElCol :span="6">
          <ElFormItem label="用户组名" prop="roleName">
            <ElInput class="w-5/6" v-model.trim="form.roleName" placeholder="请输入用户组名称" />
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
        v-if="permissionList.includes('/api/user/research/basic')"
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
import type { UserQuery, UserTable } from "@/models";
import { user } from "@/api";
import type { FormInstance, FormRules } from "element-plus";

const permissionList = ref<string[]>([]);
store.getters['common/userInfo'].permissionList.forEach((permission: IPermission) => {
  permissionList.value.push(permission.url);
});

const form = reactive({
  realName: "",
  type: "",
  userNumber: "",
  phone: "",
  email: "",
  isDelete: -1,
  roleName: "",
});
const formRef = ref<FormInstance>();
const rules: FormRules = {
  realName: [{ max: 36, message: "用户姓名不超过36个字符", trigger: "blur" }],
  userNumber: [{ max: 24, message: "学号/工号不超过24个字符", trigger: "blur" }],
  phone: [{ max: 11, message: "手机号码不超过11个字符", trigger: "blur" }],
  email: [{ max: 36, message: "邮箱地址不超过36个字符", trigger: "blur" }],
  roleName: [{ max: 12, message: "用户组名称不超过12个字符", trigger: "blur" }],
};

const clear = () => {
  form.realName = "";
  form.type = "";
  form.userNumber = "";
  form.phone = "";
  form.email = "";
  form.isDelete = -1;
  form.roleName = "";
};

const tableData = reactive({
  loading: false,
  data: [] as UserTable[],
  pageConfig: {
    pageIndex: 1,
    pageSize: 10,
    total: 0,
  } as IPagination,
  column: [
    {
      type: "default",
      prop: "realName",
      label: "用户姓名",
      sortable: false,
      fixed: false,
    },
    {
      type: "default",
      prop: "userNumber",
      label: "学号/工号",
      sortable: false,
      fixed: false,
    },
    {
      type: "default",
      prop: "phone",
      label: "手机号码",
      sortable: false,
      fixed: false,
    },
    {
      type: "default",
      prop: "email",
      label: "邮箱地址",
      sortable: false,
      fixed: false,
    },
    {
      type: "default",
      prop: "isDelete",
      label: "用户状态",
      sortable: false,
      fixed: false,
    },
    {
      type: "default",
      prop: "roleName",
      label: "用户组",
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
  const params: UserQuery = {
    realName: form.realName,
    studentNumber: form.type === "studentNumber" ? form.userNumber : "",
    teacherNumber: form.type === "teacherNumber" ? form.userNumber : "",
    phone: form.phone,
    email: form.email,
    isDelete: form.isDelete,
    roleName: form.roleName,
    pageIndex: tableData.pageConfig.pageIndex,
    pageSize: tableData.pageConfig.pageSize,
  };
  if (permissionList.value.includes("/api/user/research/basic")) {
    tableData.loading = true;
    const { data } = await user.researchBasic(params);
    if (data.code === 0) {
      const loginList = data.data.loginList as UserQuery[];
      loginList.forEach((value) => {
        tableData.data.push({
          realName: value.realName,
          userNumber: value.studentNumber.length > 0 ? value.studentNumber : value.teacherNumber,
          phone: value.phone,
          email: value.email,
          isDelete: value.isDelete,
          roleName: value.roleName,
        });
      });
      tableData.pageConfig = data.data.pagination as IPagination;
    }
    tableData.loading = false;
  }
};

query();
</script>