<template>
  <ElDrawer v-model="_showDrawer" @closed="closeModel" title="权限分配树">
    <ElTree
      ref="treeRef"
      showCheckbox
      defaultExpandAll
      nodeKey="id"
      :defaultCheckedKeys="defaultCheckedKeys"
      :data="treeData"
      @check="triggerTreeKeys"
    />
    <template #footer>
      <ElButton
        v-if="updatePermission"
        class="m-1"
        :icon="Select"
        type="info"
        plain
        round
        @click="update"
      >更改</ElButton>
    </template>
  </ElDrawer>
</template>
<script lang="ts" setup>
import { PropType } from "vue";
import { treeData, treeLeaf } from "@/utils/permissionInRoute";
import { Select } from "@element-plus/icons-vue";
import { role } from "@/api";
import { ElMessage } from "element-plus";
import type { TreeInstance } from "element-plus";
import type { PermissionInfo } from "@/models";

const props = defineProps({
  showDrawer: {
    type: Boolean,
    default: false,
  },
  defaultCheckedKeys: {
    type: Array as PropType<number[]>,
    default: () => [],
  },
  updatePermission: {
    type: Boolean,
    default: false,
  },
  roleId: {
    type: Number,
    default: 0,
  },
});

const emits = defineEmits({
  "update:showDrawer": (_v: boolean) => true,
  change: () => true,
});

const treeRef = ref<TreeInstance>();

const _showDrawer = computed({
  get: () => props.showDrawer,
  set: value => emits('update:showDrawer', value),
});

const closeModel = () => {
  emits('update:showDrawer', false);
};

const update = async () => {
  const checkedKey = treeRef.value!.getCheckedKeys(true);
  let permissionList: PermissionInfo[] = [];
  checkedKey.forEach((value) => {
    permissionList.push({ id: value as number });
  });
  const { data } = await role.updatePermission({ id: props.roleId, permissionList: permissionList });
  if (data.code === 0) {
    emits('update:showDrawer', false);
    ElMessage.success("权限修改成功！");
  }
};

const triggerTreeKeys = (data) => {
  const checkedKeys = treeRef.value!.getCheckedKeys(true);
  if (!checkedKeys.includes(10)) {
    if (data.id === 10) {
      const filterKeys = checkedKeys.filter((value) => {
        return !treeLeaf["club"].includes(value as number);
      });
      treeRef.value!.setCheckedKeys(filterKeys);
    } else {
      const flag: boolean = treeLeaf["club"].some((value) => {
        return checkedKeys.includes(value);
      });
      if (flag) {
        treeRef.value!.setCheckedKeys(checkedKeys.concat([10]));
      }
    }
  }
  if (!checkedKeys.includes(19)) {
    if (data.id === 19) {
      const filterKeys = checkedKeys.filter((value) => {
        return !treeLeaf["activity"].includes(value as number);
      });
      treeRef.value!.setCheckedKeys(filterKeys);
    } else {
      const flag: boolean = treeLeaf["activity"].some((value) => {
        return checkedKeys.includes(value);
      });
      if (flag) {
        treeRef.value!.setCheckedKeys(checkedKeys.concat([19]));
      }
    }
  }
  if (!checkedKeys.includes(28)) {
    if (data.id === 28) {
      const filterKeys = checkedKeys.filter((value) => {
        return !treeLeaf["fund"].includes(value as number);
      });
      treeRef.value!.setCheckedKeys(filterKeys);
    } else {
      const flag: boolean = treeLeaf["fund"].some((value) => {
        return checkedKeys.includes(value);
      });
      if (flag) {
        treeRef.value!.setCheckedKeys(checkedKeys.concat([28]));
      }
    }
  }
  if (!checkedKeys.includes(34)) {
    if (data.id === 34) {
      const filterKeys = checkedKeys.filter((value) => {
        return !treeLeaf["user"].includes(value as number);
      });
      treeRef.value!.setCheckedKeys(filterKeys);
    } else {
      const flag: boolean = treeLeaf["user"].some((value) => {
        return checkedKeys.includes(value);
      });
      if (flag) {
        treeRef.value!.setCheckedKeys(checkedKeys.concat([34]));
      }
    }
  }
  if (!checkedKeys.includes(36)) {
    if (data.id === 36) {
      const filterKeys = checkedKeys.filter((value) => {
        return !treeLeaf["role"].includes(value as number);
      });
      treeRef.value!.setCheckedKeys(filterKeys);
    } else {
      const flag: boolean = treeLeaf["role"].some((value) => {
        return checkedKeys.includes(value);
      });
      if (flag) {
        treeRef.value!.setCheckedKeys(checkedKeys.concat([36]));
      }
    }
  }
};
</script>
