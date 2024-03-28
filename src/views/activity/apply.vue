<template>
  <div class="h-full rounded bg-white pb-6 px-8">
    <div
      class="pb-6 pt-4"
      style="font-size: x-large; font-weight: bold; color: #909399; text-align: center"
    >———— 活动申请表 ————</div>
    <ElForm :disabled="form.statusCode === 1" :model="form" ref="formRef" :rules="rules">
      <ElRow>
        <ElCol :span="8">
          <ElFormItem label="活动标题" prop="title">
            <ElInput
              :disabled="form.statusCode === 3"
              class="w-5/6"
              v-model.trim="form.title"
              placeholder="请输入活动标题"
            />
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="主办方" prop="clubName">
            <ElInput
              :disabled="form.statusCode === 3"
              class="w-5/6"
              v-model.trim="form.clubName"
              placeholder="请输入主办方"
            />
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="活动类型" prop="type">
            <ElSelect
              :disabled="form.statusCode === 3"
              class="w-5/6"
              v-model.trim="form.type"
              placeholder="请选择活动类型"
            >
              <ElOption v-for="option in activityType" :label="option.label" :value="option.value" />
            </ElSelect>
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow>
        <ElCol :span="8">
          <ElFormItem label="活动地点" prop="address">
            <ElInput
              :disabled="form.statusCode === 3"
              class="w-5/6"
              v-model.trim="form.address"
              placeholder="请输入活动地点"
            />
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="活动开始时间" prop="activityStartTime">
            <ElDatePicker
              :disabled="form.statusCode === 3"
              class="w-5/6"
              v-model.trim="form.activityStartTime"
              type="datetime"
              placeholder="请选择活动开始时间"
            />
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="活动结束时间" prop="activityEndTime">
            <ElDatePicker
              :disabled="form.statusCode === 3"
              class="w-5/6"
              v-model.trim="form.activityEndTime"
              type="datetime"
              placeholder="请选择活动结束时间"
            />
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow>
        <ElCol :span="8">
          <ElFormItem label="协办方" prop="coOrganizer">
            <ElInput
              :disabled="form.statusCode === 3"
              class="w-5/6"
              v-model.trim="form.coOrganizer"
              placeholder="请输入协办方"
            />
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="预计最大人数" prop="numberLimit">
            <ElInputNumber
              :disabled="form.statusCode === 3"
              class="w-5/6"
              v-model.trim="form.numberLimit"
              :min="0"
            />
          </ElFormItem>
        </ElCol>
        <ElCol v-if="form.statusCode === 3" :span="8">
          <ElFormItem label="实际参与人数" prop="realNumber">
            <ElInputNumber class="w-5/6" v-model.trim="form.realNumber" :min="0" />
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow>
        <ElCol :span="8">
          <ElFormItem label="是否需要报名" prop="shouldApply">
            <ElRadioGroup :disabled="form.statusCode === 3" class="w-5/6" v-model.trim="form.shouldApply">
              <ElRadio :label="0">不需要</ElRadio>
              <ElRadio :label="1">需要</ElRadio>
            </ElRadioGroup>
          </ElFormItem>
        </ElCol>
        <ElCol v-if="form.shouldApply" :span="8">
          <ElFormItem label="报名开始时间" prop="applicationStartTime">
            <ElDatePicker
              :disabled="form.statusCode === 3"
              class="w-5/6"
              v-model.trim="form.applicationStartTime"
              type="datetime"
              placeholder="请选择报名开始时间"
            />
          </ElFormItem>
        </ElCol>
        <ElCol v-if="form.shouldApply" :span="8">
          <ElFormItem label="报名截止时间" prop="applicationEndTime">
            <ElDatePicker
              :disabled="form.statusCode === 3"
              class="w-5/6"
              v-model.trim="form.applicationEndTime"
              type="datetime"
              placeholder="请选择报名截止时间"
            />
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElTabs type="border-card">
        <ElTabPane label="详细描述">
          <ElFormItem prop="description">
            <Editor :disabled="form.statusCode === 1" v-model="form.description" :apiKey="apiKey" :init="tinymceConfig.init" />
          </ElFormItem>
        </ElTabPane>
        <ElTabPane v-if="form.statusCode === 3" label="活动总结">
          <ElFormItem prop="summarize">
            <Editor v-model="form.summarize" :apiKey="apiKey" :init="tinymceConfig.init" />
          </ElFormItem>
        </ElTabPane>
      </ElTabs>
      <ElFormItem v-if="[1, 2].includes(form.statusCode)" class="mt-6" label="审核批语" prop="approvalComment">
        <ElInput :disabled="form.statusCode === 2" class="w-1/3" type="textarea" v-model.trim="form.approvalComment" placeholder="请输入审核批语" />
      </ElFormItem>
    </ElForm>
    <ElRow class="mt-4" justify="center">
      <ElButton
        v-if="Number(route.params.aid) === 0"
        :loading="loading"
        class="mx-2"
        type="info"
        plain
        round
        @click="save"
      >保存</ElButton>
      <ElButton
        v-if="form.statusCode !== 1"
        :loading="loading"
        class="mx-2"
        type="info"
        plain
        round
        @click="submit"
      >提交</ElButton>
      <ElButton
        v-if="form.statusCode === 1 && permissionList.includes('/api/activity/approval')"
        :loading="loading"
        class="mx-2"
        type="info"
        plain
        round
        @click="approval(3)"
      >通过</ElButton>
      <ElButton
        v-if="form.statusCode === 1 && permissionList.includes('/api/activity/approval')"
        :loading="loading"
        class="mx-2"
        type="info"
        plain
        round
        @click="approval(2)"
      >驳回</ElButton>
    </ElRow>
  </div>
</template>
<script lang="ts" setup>
import store from "@/store";
import Editor from "@tinymce/tinymce-vue";
import type { IPermission } from "@/store/models";
import type { ActivityInfo } from "@/models";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import { activityType } from "@/utils/DataSets";
import { apiKey, tinymceConfig } from "@/utils/tinymce";
import dayjs from "dayjs";
import { activity } from "@/api";

const route = useRoute();
const router = useRouter();

const permissionList = ref<string[]>([]);
store.getters['common/userInfo'].permissionList.forEach((permission: IPermission) => {
  permissionList.value.push(permission.url);
});

const loading = ref(false);

const form = reactive({
  id: Number(route.params.aid) ? Number(route.params.aid) : undefined,
  title: "",
  coOrganizer: "",
  type: "",
  address: "",
  activityStartTime: "",
  activityEndTime: "",
  shouldApply: 0,
  applicationStartTime: "",
  applicationEndTime: "",
  numberLimit: 0,
  realNumber: 0,
  description: "",
  summarize: "",
  statusCode: 0,
  approvalComment: "",
  clubId: 0,
  clubName: "",
} as ActivityInfo);
const formRef = ref<FormInstance>();
const rules: FormRules = {
  title: [
    { required: true, message: "请填写活动标题！", trigger: "blur" },
    { max: 36, message: "活动标题不得超过36个字符！", trigger: "blur" },
  ],
  type: [{ required: true, message: "请选择活动类型！", trigger: "change" }],
  address: [
    { required: true, message: "请填写活动地址！", trigger: "blur" },
    { max: 36, message: "活动地址不得超过36个字符", trigger: "blur" },
  ],
  activityStartTime: [{ required: true, message: "请选择活动开始时间！", trigger: "change" }],
  activityEndTime: [{ required: true, message: "请选择活动结束时间！", trigger: "change" }],
  clubName: [
    { required: true, message: "请填写主办社团！", trigger: "blur" },
    { max: 24, message: "社团名称不得超过24个字符！", trigger: "blur" },
  ],
  applicationStartTime: [
    {
      validator: (_rule, value, callback) => {
        if (form.shouldApply && value === "") {
          callback("请选择报名开始时间！");
        } else {
          callback();
        }
      },
      trigger: "change",
    },
  ],
  applicationEndTime: [
    {
      validator: (_rule, value, callback) => {
        if (form.shouldApply && value === "") {
          callback("请选择报名结束时间！");
        } else {
          callback();
        }
      },
      trigger: "change",
    },
  ],
  approvalComment: [
    {
      validator: (_rule, value, callback) => {
        if (form.statusCode === 1 && value === "") {
          callback("请填写审核批语！");
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
};

const save = () =>{
  formRef.value!.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      const params: ActivityInfo = {
        id: form.id,
        title: form.title,
        coOrganizer: form.coOrganizer,
        type: form.type,
        address: form.address,
        activityStartTime: dayjs(form.activityStartTime).format("YYYY-MM-DD HH:mm:ss"),
        activityEndTime: dayjs(form.activityEndTime).format("YYYY-MM-DD HH:mm:ss"),
        shouldApply: form.shouldApply,
        applicationStartTime:
            form.shouldApply ? dayjs(form.applicationStartTime).format("YYYY-MM-DD HH:mm:ss") : "",
        applicationEndTime:
            form.shouldApply ? dayjs(form.applicationEndTime).format("YYYY-MM-DD HH:mm:ss") : "",
        numberLimit: form.numberLimit,
        realNumber: 0,
        description: form.description,
        summarize: "",
        statusCode: 0,
        approvalComment: "",
        clubName: form.clubName,
      };
      const { data } = form.id ? await activity.update(params) : await activity.create(params);
      if (data.code === 0) {
        ElMessage.success("活动申请表保存成功！");
      }
      form.id ? await query() : await router.push({ path: `/activity/apply/${data.data.id}` });
      loading.value = false;
    }
  });
};

const submit = () => {
  formRef.value!.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      const params: ActivityInfo = {
        id: form.id,
        title: form.title,
        coOrganizer: form.coOrganizer,
        type: form.type,
        address: form.address,
        activityStartTime: dayjs(form.activityStartTime).format("YYYY-MM-DD HH:mm:ss"),
        activityEndTime: dayjs(form.activityEndTime).format("YYYY-MM-DD HH:mm:ss"),
        shouldApply: form.shouldApply,
        applicationStartTime:
            form.shouldApply ? dayjs(form.applicationStartTime).format("YYYY-MM-DD HH:mm:ss") : "",
        applicationEndTime:
            form.shouldApply ? dayjs(form.applicationEndTime).format("YYYY-MM-DD HH:mm:ss") : "",
        numberLimit: form.numberLimit,
        realNumber: form.statusCode === 3 ? form.realNumber : 0,
        description: form.description,
        summarize: form.statusCode === 3 ? form.summarize : "",
        statusCode: 0,
        approvalComment: form.statusCode === 2 ? form.approvalComment : "",
        clubName: form.clubName,
      };
      if (form.statusCode === 0) params.statusCode = 1;
      else if (form.statusCode === 2) params.statusCode = 1;
      else if (form.statusCode === 3) params.statusCode = 3;
      const { data } = form.id ? await activity.update(params) : await activity.create(params);
      if (data.code === 0) {
        ElMessage.success("活动申请表提交成功！");
      }
      form.id ? await query() : await router.push({ path: `/activity/apply/${data.data.id}` });
      loading.value = false;
    }
  });
};

const approval = (statusCode: number) => {
  formRef.value!.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      const params = {
        id: form.id!,
        statusCode: statusCode,
        approvalComment: form.approvalComment!,
      };
      const { data } = await activity.approval(params);
      if (data.code === 0) {
        ElMessage.success("活动申请表审批成功！");
        await query();
      }
      loading.value = false;
    }
  });
};

const query = async () => {
  const { data } = await activity.researchDetail({ id: Number(route.params.aid) });
  if (data.code === 0) {
    const activityInfo: ActivityInfo = data.data.activityInfo;
    form.id = activityInfo.id;
    form.title = activityInfo.title;
    form.coOrganizer = activityInfo.coOrganizer;
    form.type = activityInfo.type;
    form.address = activityInfo.address;
    form.activityStartTime = activityInfo.activityStartTime;
    form.activityEndTime = activityInfo.activityEndTime;
    form.shouldApply = activityInfo.shouldApply;
    form.applicationStartTime = activityInfo.applicationStartTime;
    form.applicationEndTime = activityInfo.applicationEndTime;
    form.numberLimit = activityInfo.numberLimit;
    form.realNumber = activityInfo.realNumber;
    form.description = activityInfo.description;
    form.summarize = activityInfo.summarize;
    form.statusCode = activityInfo.statusCode;
    form.approvalComment = activityInfo.approvalComment;
    form.clubName = activityInfo.clubName;
  }
};

if (Number(route.params.aid)) {
  query();
}
</script>