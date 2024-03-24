<template>
  <ElDialog
    v-model="_visible"
    width="480px"
    @open="openModel"
    @closed="closeModel"
    center
    alignCenter
    :showClose="false"
  >
    <template #header>
      <div>———— {{ form.id ? "编辑分组" : "创建分组" }} ————</div>
    </template>
    <ElForm :model="form" size="large" ref="formRef" :rules="rules" labelWidth="80px">
      <ElScrollbar height="360px" class="pr-3">
        <ElFormItem class="mt-4" label="分组名称" prop="roleName">
          <ElInput v-model.trim="form.roleName" placeholder="请输入分组名称" />
        </ElFormItem>
      </ElScrollbar>
    </ElForm>
    <template #footer>
      <span>
        <ElButton @click="closeModel">取 消</ElButton>
        <ElButton type="info" plain round @click="submit">保 存</ElButton>
      </span>
    </template>
  </ElDialog>
</template>
<script lang="ts" setup>
import { PropType } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import { role } from "@/api";
import type { RoleInfo } from "@/models";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object as PropType<{ id: number, roleName: string }>,
    default: () => ({ id: 0, roleName: "" }),
  },
});

const emits = defineEmits({
  "update:visible": (_v: boolean) => true,
  change: () => true,
});

const _visible = computed({
  get: () => props.visible,
  set: value => emits('update:visible', value),
});

const form = reactive({ id: 0, roleName: "" });
const formRef = ref<FormInstance>();
const rules: FormRules = {
  roleName: [
    { required: true, message: "请输入分组名称", trigger: "blur" },
    { max: 12, message: "分组名不可超过12个字符", trigger: "blur" },
  ],
};

const openModel = () => {
  formRef.value?.clearValidate();
  if (props.data.id) {
    form.id = props.data.id;
    form.roleName = props.data.roleName;
  }
};

const closeModel = () => {
  emits('update:visible', false);
  form.id = 0;
  form.roleName = "";
  formRef.value?.resetFields();
};

const submit = () => {
  formRef.value!.validate(async (valid) => {
    if (valid) {
      const params = {
        id: form.id ? form.id : undefined,
        roleName: form.roleName,
      } as RoleInfo;
      const { data } = form.id ? await role.updateRole(params) : await role.create(params);
      const message = form.id ? "分组修改" : "创建分组";
      if (data.code === 0) {
        emits('change');
        ElMessage.success(`${message}成功！`);
      }
    }
  })
};
</script>
<style scoped>
.el-dialog__header {
  background-color: #545c64;
  margin-right: 0 !important;
  color: white;
  font-size: x-large;
  font-weight: bold;
}

.el-input__wrapper {
  width: 100%;
}
</style>
