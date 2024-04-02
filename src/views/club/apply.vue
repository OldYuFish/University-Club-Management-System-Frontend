<template>
  <div class="h-full rounded bg-white pb-6 px-8">
    <div
      class="pb-6 pt-4"
      style="font-size: x-large; font-weight: bold; color: #909399; text-align: center"
    >———— 社团申请表 ————</div>
    <ElForm :disabled="form.statusCode === 1" :model="form" ref="formRef" :rules="rules">
      <ElRow>
        <ElCol :span="8">
          <ElFormItem label="社团名称" prop="clubName">
            <ElInput
              :disabled="form.statusCode === 3"
              class="w-5/6"
              v-model.trim="form.clubName"
              placeholder="请输入社团名称"
            />
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="社团类型" prop="type">
            <ElSelect
              :disabled="form.statusCode === 3"
              class="w-5/6"
              v-model.trim="form.type"
              placeholder="请选择社团类型"
            >
              <ElOption v-for="option in clubType" :label="option.label" :value="option.value" />
            </ElSelect>
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="社团级别" prop="clubLevel">
            <ElSelect
              :disabled="form.statusCode === 3"
              class="w-5/6"
              v-model.trim="form.clubLevel"
              placeholder="请选择社团级别"
            >
              <ElOption v-for="option in clubLevel" :label="option.label" :value="option.value" />
            </ElSelect>
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow>
        <ElCol :span="8">
          <ElFormItem label="所属院系" prop="department">
            <ElInput
              :disabled="form.statusCode === 3"
              class="w-5/6"
              v-model.trim="form.department"
              placeholder="请输入所属院系"
            />
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="社团人数" prop="membersNumber">
            <ElInputNumber
              class="w-5/6"
              v-model.trim="form.membersNumber"
              :min="1"
            />
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElTabs type="border-card">
        <ElTabPane label="详细描述">
          <ElFormItem prop="description">
            <Editor
              :disabled="form.statusCode === 1"
              v-model="form.description"
              :apiKey="apiKey"
              :init="tinymceConfig.init"
            />
          </ElFormItem>
        </ElTabPane>
<!-- <ElTabPane label="核心成员"></ElTabPane-->
        <ElTabPane v-if="Number(route.params.aid) !== 0" style="height: 320px" label="附件">
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
        <ElTabPane v-if="form.statusCode === 3" style="height: 320px" label="社团照片">
          <div v-html="imageText" />
          <input
            id="uploadImage"
            type="file"
            name="file"
            @change="uploadImage($event)"
            style="display: none"
          />
          <ElButton class="mt-6" type="info" :icon="Upload" plain round @click="clickImageInput">上传</ElButton>
          <template v-for="imageName in imageList">
            <div>
              <span>{{ imageName }}</span>
              <ElButton
                class="ml-2"
                size="small"
                type="info"
                :icon="Delete"
                circle
                plain
                @click="deleteImage(imageName)"
              />
              <ElButton
                class="ml-2"
                size="small"
                type="info"
                :icon="Download"
                circle
                plain
                @click="downloadImage(imageName)"
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
import type { ClubInfo } from "@/models";
import { ElMessage } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import store from "@/store";
import type { IPermission } from "@/store/models";
import {clubLevel, clubType, imageText, text} from "@/utils/DataSets";
import { apiKey, tinymceConfig } from "@/utils/tinymce";
import Editor from "@tinymce/tinymce-vue";
import { Delete, Upload, Download } from "@element-plus/icons-vue";
import { files, club } from "@/api";
import SparkMD5 from "spark-md5";

const route = useRoute();
const router = useRouter();

const permissionList = ref<string[]>([]);
const userInfo = store.getters['common/userInfo'];
userInfo.permissionList.forEach((permission: IPermission) => {
  permissionList.value.push(permission.url);
});

const loading = ref(false);
const fileList = ref<string[]>([]);
const imageList = ref<string[]>([]);

const form = reactive({
  id: Number(route.params.aid) ? Number(route.params.aid) : undefined,
  clubName: "",
  membersNumber: 0,
  type: "",
  clubLevel: "",
  department: "",
  description: "",
  statusCode: 0,
  approvalComment: "",
  loginId: userInfo.id,
} as ClubInfo);
const formRef = ref<FormInstance>();
const rules: FormRules = {
  clubName: [
    { required: true, message: "请填写社团名称！", trigger: "blur" },
    { max: 24, message: "社团名称不得超过24个字符！", trigger: "blur" },
  ],
  membersNumber: [{ required: true, message: "请填写成员数量！", trigger: "blur" }],
  type: [{ required: true, message: "请选择社团类型！", trigger: "change" }],
  department: [{ max: 24, message: "院系名不得超过24个字符！", trigger: "blur" }],
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

const clickFileInput = () => {
  document.getElementById('uploadAvatar')!.click();
};

const clickImageInput = () => {
  document.getElementById('uploadImage')!.click();
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
    console.log(form.id);
    spark.appendBinary(element.target!.result as string);
    const md5 = spark.end();
    formData.append("multipartFile", file);
    formData.append("fileName", fileName);
    formData.append("id", form.id!.toString());
    formData.append("type", "club");
    formData.append("md5Code", md5);
    const { data } = await files.create(formData);
    if (data.code === 0) {
      ElMessage.success("上传成功！");
      await getFileList();
    }
  };
};

const uploadImage = (e) => {
  const file = e.target.files[0];
  const fileName: string = e.target.value.split('\\')[2];
  if (!['png', 'jpg'].includes(fileName.split('.').pop()!)) {
    e.target.value = '';
    ElMessage.error("您上传的图片格式不符，请重新上传！");
    return ;
  }
  if (fileName.length > 22) {
    e.target.value = '';
    ElMessage.error("您上传的图片名称超过22个字符，请重新上传！");
    return ;
  }
  const size: number = file.size/1024/1024;
  if (size > 5) {
    e.target.value = '';
    ElMessage.error("您上传的图片超过5MB，请重新上传！");
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
    formData.append("type", "club");
    formData.append("md5Code", md5);
    const { data } = await files.create(formData);
    if (data.code === 0) {
      ElMessage.success("上传成功！");
      await getImageList();
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

const deleteImage = async (imageName: string) => {
  const { data } = await files.delete({ fileName: imageName });
  if (data.code === 0) {
    ElMessage.success("图片已移除！");
    await getImageList();
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

const downloadImage = async (imageName: string) => {
  const { data } = await files.download({ fileName: imageName });
  const url = window.URL.createObjectURL(
      new Blob([data], { type: "arraybuffer" })
  );
  const link = document.createElement("a");
  link.style.display = "none";
  link.href = url;
  link.setAttribute("download", imageName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const getFileList = async () => {
  const { data } = await files.researchClubFile({ id: form.id! });
  if (data.code === 0) {
    fileList.value = data.data.filesList;
  }
};

const getImageList = async () => {
  const { data } = await files.researchClubImage({ id: form.id! });
  if (data.code === 0) {
    imageList.value = data.data.filesList;
  }
};

const save = () =>{
  formRef.value!.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      const params: ClubInfo = {
        id: form.id,
        clubName: form.clubName,
        membersNumber: form.membersNumber,
        type: form.type,
        clubLevel: form.clubLevel,
        department: form.department,
        description: form.description,
        statusCode: 0,
        approvalComment: "",
        loginId: userInfo.id,
      };
      const { data } = form.id ? await club.update(params) : await club.create(params);
      if (data.code === 0) {
        ElMessage.success("社团申请表保存成功！");
      }
      form.id ? await query() : await router.push({ path: `/club/apply/${data.data.id}` });
      loading.value = false;
    }
  });
};

const submit = () => {
  formRef.value!.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      const params: ClubInfo = {
        id: form.id,
        clubName: form.clubName,
        membersNumber: form.membersNumber,
        type: form.type,
        clubLevel: form.clubLevel,
        department: form.department,
        description: form.description,
        statusCode: 0,
        approvalComment: form.statusCode === 2 ? form.approvalComment : "",
        loginId: userInfo.id,
      };
      if (form.statusCode === 0) params.statusCode = 1;
      else if (form.statusCode === 2) params.statusCode = 1;
      else if (form.statusCode === 3) params.statusCode = 3;
      const { data } = await club.update(params);
      if (data.code === 0) {
        ElMessage.success("社团申请表提交成功！");
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
      const { data } = await club.approval(params);
      if (data.code === 0) {
        ElMessage.success("社团申请表审批成功！");
        await router.push({ path: "/club/list" });
      }
      loading.value = false;
    }
  });
};

const query = async () => {
  const { data } = await club.researchDetail({ id: Number(route.params.aid) });
  if (data.code === 0) {
    const clubInfo: ClubInfo = data.data.clubInfo;
    form.id = clubInfo.id;
    form.clubName = clubInfo.clubName;
    form.membersNumber = clubInfo.membersNumber;
    form.type = clubInfo.type;
    form.clubLevel = clubInfo.clubLevel;
    form.department = clubInfo.department;
    form.description = clubInfo.description;
    form.statusCode = clubInfo.statusCode;
    form.approvalComment = clubInfo.approvalComment;
  }
};

if (Number(route.params.aid)) {
  getFileList();
  query();
}
</script>