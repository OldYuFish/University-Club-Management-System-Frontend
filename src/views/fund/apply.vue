<template>
  <div class="h-full rounded bg-white pb-6 px-8">
    <div
      class="pb-6 pt-4"
      style="font-size: x-large; font-weight: bold; color: #909399; text-align: center"
    >———— 经费申请表 ————</div>
    <ElForm :disabled="form.statusCode === 1" :model="form" ref="formRef" :rules="rules">
      <ElRow>
        <ElCol :span="8">
          <ElFormItem label="经费去向" prop="theme">
            <ElInput
              :disabled="form.statusCode === 3"
              class="w-5/6"
              v-model.trim="form.theme"
              placeholder="请输入经费去向"
            />
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="申报社团" prop="clubName">
            <ElInput
                :disabled="form.statusCode === 3"
                class="w-5/6"
                v-model.trim="form.clubName"
                placeholder="请输入申报社团名称"
            />
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="经费类型" prop="type">
            <ElSelect
              :disabled="form.statusCode === 3"
              class="w-5/6"
              v-model.trim="form.type"
              placeholder="请选择经费类型"
            >
              <ElOption v-for="option in fundType" :label="option.label" :value="option.value" />
            </ElSelect>
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="申报总额" prop="amount">
            <ElInput
              :disabled="form.statusCode === 3"
              class="w-5/6"
              v-model.trim="form.amount"
              placeholder="请输入申报总额"
            />
          </ElFormItem>
        </ElCol>
        <ElCol v-if="form.statusCode === 3" :span="8">
          <ElFormItem label="剩余金额" prop="surplus">
            <ElInput
              class="w-5/6"
              v-model.trim="form.surplus"
              placeholder="请输入剩余金额"
            />
          </ElFormItem>
        </ElCol>
        <ElCol v-if="form.statusCode === 3" :span="8">
          <ElFormItem label="拨款日期" prop="appropriationTime">
            <ElDatePicker
              class="w-5/6"
              v-model.trim="form.appropriationTime"
              type="datetime"
              placeholder="请选择拨款日期"
            />
          </ElFormItem>
        </ElCol>
        <ElCol v-if="form.type === '活动经费'" :span="8">
          <ElFormItem label="活动标题" prop="title">
            <ElInput
              :disabled="form.statusCode === 3"
              class="w-5/6"
              v-model.trim="form.title"
              placeholder="请输入活动标题"
            />
          </ElFormItem>
        </ElCol>
        <ElCol v-if="form.type === '竞赛奖金'" :span="8">
          <ElFormItem label="赛事名称" prop="competitionName">
            <ElInput
              :disabled="form.statusCode === 3"
              class="w-5/6"
              v-model.trim="form.competitionBonus!.competitionName"
              placeholder="请输入赛事名称"
            />
          </ElFormItem>
        </ElCol>
        <ElCol v-if="form.type === '竞赛奖金'" :span="8">
          <ElFormItem label="赛事类型" prop="competitionType">
            <ElSelect
              :disabled="form.statusCode === 3"
              class="w-5/6"
              v-model.trim="form.competitionBonus!.type"
              placeholder="请选择赛事类型"
            >
              <ElOption v-for="option in competitionType" :label="option.label" :value="option.value" />
            </ElSelect>
          </ElFormItem>
        </ElCol>
        <ElCol v-if="form.type === '竞赛奖金'" :span="8">
          <ElFormItem label="赛事级别" prop="competitionLevel">
            <ElSelect
              :disabled="form.statusCode === 3"
              class="w-5/6"
              v-model.trim="form.competitionBonus!.competitionLevel"
              placeholder="请选择赛事级别"
            >
              <ElOption v-for="option in competitionLevel" :label="option.label" :value="option.value" />
            </ElSelect>
          </ElFormItem>
        </ElCol>
        <ElCol v-if="form.type === '竞赛奖金'" :span="8">
          <ElFormItem label="所获奖项" prop="award">
            <ElSelect
              :disabled="form.statusCode === 3"
              class="w-5/6"
              v-model.trim="form.competitionBonus!.award"
              placeholder="请选择所获奖项"
            >
              <ElOption v-for="option in award" :label="option.label" :value="option.value" />
            </ElSelect>
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElTabs v-if="Number(route.params.aid) !== 0" type="border-card">
        <ElTabPane style="height: 320px" label="附件">
          <div v-html="text" />
          <input
            id="uploadAvatar"
            type="file"
            name="file"
            @change="uploadFile($event)"
            style="display: none"
          />
          <ElButton class="mt-6" type="info" :icon="Upload" plain round @click="clickFileInput">上传</ElButton>
          <template v-for="fileName in fileList">
            <div>
              <span>{{ fileName }}</span>
              <ElButton
                class="ml-2"
                size="small"
                type="info"
                :icon="Delete"
                circle
                plain
                @click="deleteFile(fileName)"
              />
              <ElButton
                class="ml-2"
                size="small"
                type="info"
                :icon="Download"
                circle
                plain
                @click="downloadFile(fileName)"
              />
            </div>
          </template>
        </ElTabPane>
        <ElTabPane v-if="[1, 2].includes(form.statusCode!)" label="审核批语">
          <ElFormItem prop="approvalComment">
            <Editor
                :disabled="form.statusCode === 2"
                v-model="form.approvalComment"
                :apiKey="apiKey"
                :init="tinymceConfig.init"
            />
          </ElFormItem>
        </ElTabPane>
      </ElTabs>
    </ElForm>
    <ElRow class="mt-4" justify="center">
      <ElButton
        v-if="form.statusCode === 0"
        :loading="loading"
        class="mx-2"
        type="info"
        plain
        round
        @click="save"
      >保存</ElButton>
      <ElButton
        v-if="form.statusCode !== 1 && form.id"
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
import type { CompetitionInfo, FundInfo } from "@/models";
import { ElMessage } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import store from "@/store";
import type { IPermission } from "@/store/models";
import { fundType, competitionType, competitionLevel, award, text } from "@/utils/DataSets";
import { Delete, Upload, Download } from "@element-plus/icons-vue";
import { files, fund } from "@/api";
import SparkMD5 from "spark-md5";
import {apiKey, tinymceConfig} from "@/utils/tinymce";
import Editor from "@tinymce/tinymce-vue";

const route = useRoute();
const router = useRouter();

const permissionList = ref<string[]>([]);
const userInfo = store.getters['common/userInfo'];
userInfo.permissionList.forEach((permission: IPermission) => {
  permissionList.value.push(permission.url);
});

const loading = ref(false);
const fileList = ref<string[]>([])

const form = reactive({
  id: Number(route.params.aid) ? Number(route.params.aid) : undefined,
  theme: "",
  type: "",
  amount: "",
  surplus: "",
  appropriationTime: "",
  statusCode: 0,
  approvalComment: "",
  applicant: userInfo.id,
  clubId: 0,
  clubName: "",
  competitionId: 0,
  activityId: 0,
  competitionBonus: {
    id: 0,
    competitionName: "",
    type: "",
    competitionLevel: "",
    award: "",
  },
  title: "",
} as FundInfo);
const formRef = ref<FormInstance>();
const rules: FormRules = {
  theme: [
    { required: true, message: "请填写经费去向！", trigger: "blur" },
    { max: 24, message: "经费去向不得超过24个字符！", trigger: "blur" },
  ],
  type: [{ required: true, message: "请选择经费类型！", trigger: "change" }],
  amount: [
    { required: true, message: "请填写申报总额！", trigger: "blur" },
    { pattern: /^\d+(\.\d+)?$/, message: "总金额应为正数！", trigger: "blur" },
  ],
  surplus: [{ pattern: /^\d+(\.\d+)?$/, message: "剩余金额应为正数！", trigger: "blur" }],
  clubName: [
    { required: true, message: "请填写申报社团名称！", trigger: "blur" },
    { max: 24, message: "社团名称不得超过24个字符！", trigger: "blur" },
  ],
  title: [
    { max: 36, message: "活动标题不得超过36个字符！", trigger: "blur" },
    {
      validator: (_rule, value, callback) => {
        if (form.type === "活动经费" && value === "") {
          callback("请填写活动标题！");
        } else {
          callback();
        }
      },
      trigger: "blur"
    },
  ],
  competitionName: [
    { max: 36, message: "赛事名称不得超过36个字符！", trigger: "blur" },
    {
      validator: (_rule, _value, callback) => {
        if (form.type === "竞赛奖金" && form.competitionBonus!.competitionName === "") {
          callback("请填写赛事名称！");
        } else {
          callback();
        }
      },
      trigger: "blur"
    },
  ],
  competitionType: [
    {
      validator: (_rule, _value, callback) => {
        if (form.type === "竞赛奖金" && form.competitionBonus!.type === "") {
          callback("请选择赛事类型！");
        } else {
          callback();
        }
      },
      trigger: "change"
    },
  ],
  competitionLevel: [
    {
      validator: (_rule, _value, callback) => {
        if (form.type === "竞赛奖金" && form.competitionBonus!.competitionLevel === "") {
          callback("请选择赛事级别！");
        } else {
          callback();
        }
      },
      trigger: "change"
    },
  ],
  award: [
    {
      validator: (_rule, _value, callback) => {
        if (form.type === "竞赛奖金" && form.competitionBonus!.award === "") {
          callback("请选择所获奖项！");
        } else {
          callback();
        }
      },
      trigger: "change"
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
      trigger: "blur"
    },
  ],
};

const clickFileInput = () => {
  document.getElementById('uploadAvatar')!.click();
};

const uploadFile = (e) => {
  const file = e.target.files[0];
  const fileName: string = e.target.value.split('\\')[2];
  if (!['pdf', 'doc', 'docx', 'xls', 'xlsx'].includes(fileName.split('.').pop()!)) {
    e.target.value = '';
    ElMessage.error("您上传的文件格式不符，请重新上传！");
    return ;
  }
  if (fileName.length > 22) {
    e.target.value = '';
    ElMessage.error("您上传的文件名称超过22个字符，请重新上传！");
    return ;
  }
  const size: number = file.size/1024/1024;
  if (size > 5) {
    e.target.value = '';
    ElMessage.error("您上传的文件超过5MB，请重新上传！");
    return ;
  }
  const formData = new FormData();
  const fileReader = new FileReader();
  const spark = new SparkMD5();
  fileReader.readAsBinaryString(file);
  fileReader.onload = async (element) => {
    spark.appendBinary(element.target!.result as string);
    const md5 = spark.end();
    formData.append("multipartFile", file);
    formData.append("fileName", fileName);
    formData.append("id", form.id!.toString());
    formData.append("type", "fund");
    formData.append("md5Code", md5);
    const { data } = await files.create(formData);
    if (data.code === 0) {
      ElMessage.success("上传成功！");
      await getFileList();
    }
  };
};

const deleteFile = async (fileName: string) => {
  const { data } = await files.delete({ fileName: fileName });
  if (data.code === 0) {
    ElMessage.success("附件已移除！");
    await getFileList();
  }
};

const downloadFile = async (fileName: string) => {
  const { data } = await files.download({ fileName: fileName });
  const url = window.URL.createObjectURL(
      new Blob([data], { type: "arraybuffer" })
  );
  const link = document.createElement("a");
  link.style.display = "none";
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const getFileList = async () => {
  const { data } = await files.researchFund({ id: form.id! });
  if (data.code === 0) {
    fileList.value = data.data.filesList;
  }
};

const save = () =>{
  formRef.value!.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      const params: FundInfo = {
        id: form.id,
        theme: form.theme,
        type: form.type,
        amount: Number(form.amount),
        surplus: 0,
        appropriationTime: "",
        statusCode: 0,
        approvalComment: "",
        applicant: userInfo.id,
        clubName: form.clubName,
        title: form.type === "活动经费" ? form.title : "",
        competitionBonus: form.type === "竞赛奖金" ? form.competitionBonus : undefined,
      };
      const { data } = form.id ? await fund.update(params) : await fund.create(params);
      if (data.code === 0) {
        ElMessage.success("经费申请表保存成功！");
      }
      form.id ? await query() : await router.push({ path: `/fund/apply/${data.data.id}` });
      loading.value = false;
    }
  });
};

const submit = () => {
  formRef.value!.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      const params: FundInfo = {
        id: form.id,
        theme: form.theme,
        type: form.type,
        amount: Number(form.amount),
        surplus: form.statusCode === 3 && form.surplus ? form.surplus : 0,
        appropriationTime: form.statusCode === 3 && form.appropriationTime ? form.appropriationTime : "",
        statusCode: 0,
        approvalComment: form.statusCode === 2 ? form.approvalComment : "",
        applicant: userInfo.id,
        clubName: form.clubName,
        title: form.type === "活动经费" ? form.title : "",
        competitionBonus: form.type === "竞赛奖金" ? form.competitionBonus : undefined,
      };
      if (form.statusCode === 0) params.statusCode = 1;
      else if (form.statusCode === 2) params.statusCode = 1;
      else if (form.statusCode === 3) params.statusCode = 3;
      const { data } = await fund.update(params);
      if (data.code === 0) {
        ElMessage.success("经费申请表提交成功！");
      }
      await query();
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
      const { data } = await fund.approval(params);
      if (data.code === 0) {
        ElMessage.success("经费申请表审批成功！");
        await router.push({ path: "/fund/list" });
      }
      loading.value = false;
    }
  });
};

const query = async () => {
  const { data } = await fund.researchDetail({ id: Number(route.params.aid) });
  if (data.code === 0) {
    const fundInfo: FundInfo = data.data.fundInfo;
    form.id = fundInfo.id;
    form.theme = fundInfo.theme;
    form.type = fundInfo.type;
    form.amount = fundInfo.amount;
    form.surplus = fundInfo.surplus;
    form.appropriationTime = fundInfo.appropriationTime;
    form.statusCode = fundInfo.statusCode;
    form.approvalComment = fundInfo.approvalComment;
    form.clubId = fundInfo.clubId;
    form.clubName = fundInfo.clubName;
    if (fundInfo.type === "活动经费") {
      form.activityId = fundInfo.activityId;
      form.title = fundInfo.title;
    } else if (fundInfo.type === "竞赛奖金") {
      form.competitionId = fundInfo.competitionId;
      form.competitionBonus = fundInfo.competitionBonus as CompetitionInfo;
    }
  }
};

if (Number(route.params.aid)) {
  getFileList();
  query();
}
</script>