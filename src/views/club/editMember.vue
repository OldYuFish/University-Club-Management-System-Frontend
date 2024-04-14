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
      <div>———— {{ form.id ? "编辑成员" : "添加成员" }} ————</div>
    </template>
    <ElForm :model="form" size="large" ref="formRef" :rules="rules" labelWidth="80px">
      <ElScrollbar height="360px" class="pr-3">
        <ElFormItem class="mt-4" label="成员名称" prop="memberName">
          <ElInput v-model.trim="form.memberName" placeholder="请输入成员名称" />
        </ElFormItem>
        <ElFormItem class="mt-4" label="成员学号" prop="studentNumber">
          <ElInput v-model.trim="form.studentNumber" placeholder="请输入成员学号" />
        </ElFormItem>
        <ElFormItem class="mt-4" label="所在院系" prop="department">
          <ElInput v-model.trim="form.department" placeholder="请输入所在院系" />
        </ElFormItem>
        <ElFormItem class="mt-4" label="成员职务" prop="job">
          <ElSelect v-model.trim="form.job" placeholder="请选择成员职务">
            <ElOption v-for="job in memberJob" :label="job" :value="job" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem class="mt-4" label="成员邮箱" prop="email">
          <ElInput v-model.trim="form.email" placeholder="请输入成员邮箱" />
        </ElFormItem>
        <ElFormItem class="mt-4" label="成员荣誉" prop="honor">
          <ElInput type="textarea" v-model.trim="form.honor" placeholder="请输入成员荣誉" />
        </ElFormItem>
      </ElScrollbar>
    </ElForm>
    <template #footer>
      <span>
        <ElButton type="info" plain round @click="closeModel">取 消</ElButton>
        <ElButton type="info" plain round @click="submit">保 存</ElButton>
      </span>
    </template>
  </ElDialog>
</template>
<script lang="ts" setup>
import { PropType } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import { member } from "@/api";
import type { MemberInfo } from "@/models";
import {memberJob} from "@/utils/DataSets";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object as PropType<{ id: number }>,
    default: () => ({ id: 0 }),
  },
});

const emits = defineEmits({
  "update:visible": (_v: boolean) => true,
  change: () => true,
});

const route = useRoute();

const _visible = computed({
  get: () => props.visible,
  set: value => emits('update:visible', value),
});

const form = reactive({
  id: 0,
  memberName: "",
  department: "",
  job: "",
  studentNumber: "",
  email: "",
  honor: "",
  clubId: Number(route.params.aid),
} as MemberInfo);
const formRef = ref<FormInstance>();
const rules: FormRules = {
  memberName: [
    { required: true, message: "请填写成员名称", trigger: "blur" },
    { max: 36, message: "成员名称不可超过36个字符", trigger: "blur" },
  ],
  studentNumber: [
    { required: true, message: "请填写成员学号", trigger: "blur" },
    { len: 12, message: "成员学号必须为12个数字", trigger: "blur" },
  ],
  department: [
    { required: true, message: "请填写所在院系", trigger: "blur" },
    { max: 24, message: "所在院系不可超过24个字符", trigger: "blur" },
  ],
  job: [{ required: true, message: "请选择成员职务", trigger: "change" }],
  email: [
    {
      pattern:
          /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:\w(?:[\w-]*\w)?\.)+\w(?:[\w-]*\w)?/,
      message: "请输入合法的邮箱",
      trigger: "blur",
    },
  ],
};

const openModel = async () => {
  formRef.value?.clearValidate();
  if (props.data.id) {
    const { data } = await member.researchDetail({ id: props.data.id });
    if (data.code === 0) {
      const memberDetail: MemberInfo = data.data.memberDetail;
      form.id = memberDetail.id;
      form.memberName = memberDetail.memberName;
      form.department = memberDetail.department;
      form.job = memberDetail.job;
      form.studentNumber = memberDetail.studentNumber;
      form.email = memberDetail.email;
      form.honor = memberDetail.honor;
    }
  }
};

const closeModel = () => {
  emits('update:visible', false);
  form.id = 0;
  form.memberName = "";
  form.department = "";
  form.job = "";
  form.studentNumber = "";
  form.email = "";
  form.honor = "";
  formRef.value?.resetFields();
};

const submit = () => {
  formRef.value!.validate(async (valid) => {
    if (valid) {
      const params = {
        id: form.id ? form.id : undefined,
        memberName: form.memberName,
        department: form.department,
        job: form.job,
        studentNumber: form.studentNumber,
        email: form.email,
        honor: form.honor,
        clubId: form.clubId,
      } as MemberInfo;
      const { data } = form.id ? await member.update(params) : await member.create(params);
      const message = form.id ? "成员修改" : "添加成员";
      if (data.code === 0) {
        emits('change');
        ElMessage.success(`${message}成功！`);
      }
    }
  });
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
