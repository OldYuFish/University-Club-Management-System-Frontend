<template>
  <div class="h-full rounded bg-white pb-6 px-8">
    <div v-if="permissionList.includes('/api/role/create')" class="p-6 text-right">
      <ElButton
        :icon="Plus"
        type="info"
        plain
        round
        @click="operate(OptionType.Edit, { id: 0, roleName: '' })"
      >创建分组</ElButton>
    </div>
    <div v-if="permissionList.includes('/api/role/research/role')" class="gk-table-wrap rounded-b">
      <ElTable :data="filterTableData">
        <template #empty>
          <div>暂时没有数据哦！</div>
        </template>
        <ElTableColumn prop="id" label="编号" sortable />
        <ElTableColumn prop="roleName" label="分组名称" />
        <ElTableColumn align="right">
          <template #header>
            <ElInput v-model="roleName" placeholder="请输入分组名称" />
          </template>
          <template #default="{ $index, row }">
            <ElButton
              v-if="permissionList.includes('/api/role/delete/role')"
              class="m-1"
              :icon="Delete"
              type="info"
              plain
              round
              @click="operate(OptionType.Delete, row, $index)"
            >删除</ElButton>
            <ElButton
              v-if="permissionList.includes('/api/role/update/role')"
              class="m-1"
              :icon="Edit"
              type="info"
              plain
              round
              @click="operate(OptionType.Edit, row)"
            >编辑</ElButton>
            <ElButton
              v-if="permissionList.includes('/api/role/research/permission')"
              class="m-1"
              :icon="Setting"
              type="info"
              plain
              round
              @click="operate(OptionType.Permission, row)"
            >授权</ElButton>
          </template>
        </ElTableColumn>
      </ElTable>
      <div class="flex justify-end pt-4 pb-3 rounded-b bg-white">
        <ElPagination
          v-model:currentPage="tableData.pageConfig.pageIndex"
          v-model:pageSize="tableData.pageConfig.pageSize"
          background
          layout="total, prev, pager, next, sizes, jumper"
          :pageSizes="[10, 20, 30, 50, 70, 100, 150, 200, 300, 500, 1000]"
          :total="tableData.pageConfig.total"
          :hideOnSinglePage="true"
        ></ElPagination>
      </div>
      <div v-if="tableData.loading" class="absolute left-0 top-0 w-full h-full bg-gray-300 bg-opacity-30 z-10">
        <ElIcon class="spin absolute inset-0 m-auto text-3xl text-blue-400">
          <Loading class="align-baseline" />
        </ElIcon>
      </div>
    </div>
    <OFEdit
      v-if="permissionList.includes('/api/role/update/role') || permissionList.includes('/api/role/create')"
      v-model:visible="dialogState.visible"
      :data="dialogState.data"
      @change="editResult"
    />
    <OFPermission
      v-if="permissionList.includes('/api/role/research/permission')"
      v-model:showDrawer="drawerState.showDrawer"
      :defaultCheckedKeys="drawerState.defaultCheckedKeys"
      :updatePermission="updatePermission"
      :roleId="drawerState.roleId"
      @change="drawerResult"
    />
  </div>
</template>
<script lang="ts" setup>
import store from "@/store";
import OFEdit from "./edit.vue";
import OFPermission from "./permission.vue";
import type { IPermission } from "@/store/models";
import type { RoleQuery, RoleInfo } from "@/models";
import { role } from "@/api";
import { Delete, Loading, Plus, Edit, Setting } from "@element-plus/icons-vue";
import { ElMessageBox, ElMessage } from "element-plus";

const permissionList = ref<string[]>([]);
store.getters['common/userInfo'].permissionList.forEach((permission: IPermission) => {
  permissionList.value.push(permission.url);
});

const updatePermission = ref(permissionList.value.includes("/api/role/update/Permission"));

const drawerState = reactive({
  showDrawer: false,
  defaultCheckedKeys: [] as number[],
  roleId: 0,
});

const roleName = ref("");
const filterTableData = computed(() => {
  tableData.data.filter((data) =>
    !roleName.value || data.roleName.includes(roleName.value)
  );
});

const tableData = reactive({
  loading: false,
  data: [] as RoleInfo[],
  pageConfig: {
    pageIndex: 1,
    pageSize: 10,
    total: 0,
  } as IPagination,
  showDelete: permissionList.value.includes("/api/role/delete/role"),
  showUpdate: permissionList.value.includes("/api/role/update/role"),
  showPermission: permissionList.value.includes("/api/role/research/permission"),
});

const dialogState = reactive({
  visible: false,
  data: { id: 0, roleName: "" },
});

const operate = async (type: OptionType, row: RoleInfo, index?: number) => {
  if (type === OptionType.Edit) {
    dialogState.data = { id: row?.id ? row.id : 0, roleName: row?.id ? row.roleName : "" };
    dialogState.visible = true;
  }
  if (type === OptionType.Delete) {
    await ElMessageBox.confirm(
      "是否同时删除组内用户？",
      "危险操作！",
      {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning",
        roundButton: true,
      }
    ).then(() => {
      ElMessageBox.confirm(
        "再次确认后，将同时删除用户组及组内用户！",
        "危险操作！！",
        {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
          roundButton: true,
        }
      ).then(async () => {
        const { data } = await role.deleteUser({ id: row.id! });
        if (data.code === 0) {
          const res = await role.deleteRole({ id: row.id! });
          if (res.data.code === 0) {
            tableData.data.splice(index!, 1);
            ElMessage.success("用户组及其用户删除成功！");
          }
        }
      });
    }).catch(() => {
      ElMessageBox.confirm(
        "是否将组内用户转移至默认分组？",
        "注意",
        {
          confirmButtonText: "是",
          cancelButtonText: "否，转移至指定分组",
          type: "warning",
          roundButton: true,
        }
      ).then(async () => {
        const { data } = await role.updateUser({ id: row.id!, roleName: "默认分组" });
        if (data.code === 0) {
          ElMessage.success("用户转移成功！");
          const res = await role.deleteRole({ id: row.id! });
          if (res.data.code === 0) {
            tableData.data.splice(index!, 1);
            ElMessage.success("用户组删除成功！");
          }
        }
      }).catch(() => {
        ElMessageBox.prompt(
          "请输入指定分组名称：",
          "注意",
          {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            roundButton: true,
          }
        ).then(async ({ value }) => {
          const { data } = await role.updateUser({ id: row.id!, roleName: value });
          if (data.code === 0) {
            ElMessage.success("用户转移成功！");
            const res = await role.deleteRole({ id: row.id! });
            if (res.data.code === 0) {
              tableData.data.splice(index!, 1);
              ElMessage.success("用户组删除成功！");
            }
          }
        });
      });
    });
  }
  if (type === OptionType.Permission) {
    drawerState.showDrawer = true;
    const { data } = await role.researchPermission({ id: row.id! });
    if (data.code === 0) {
      data.data.permissionList.forEach((value: IPermission) => {
        if (value.id >= 7 && value.id <= 44) {
          drawerState.defaultCheckedKeys.push(value.id);
        }
      });
      drawerState.roleId = row.id!;
    }
  }
};

const editResult = () => {
  dialogState.visible = false;
  query();
};

const drawerResult = () => {
  drawerState.showDrawer = false;
};

const query = async () => {
  const params: RoleQuery = {
    roleName: roleName.value,
    pageIndex: tableData.pageConfig.pageIndex,
    pageSize: tableData.pageConfig.pageSize,
  };
  if (permissionList.value.includes("/api/role/research/role")) {
    tableData.loading = true;
    const { data } = await role.researchRole(params);
    if (data.code === 0) {
      tableData.data = data.data.roleList as RoleInfo[];
      tableData.pageConfig = data.data.pagination as IPagination;
    }
    tableData.loading = false;
  }
};

query();

enum OptionType {
  Edit,
  Delete,
  Permission,
}
</script>