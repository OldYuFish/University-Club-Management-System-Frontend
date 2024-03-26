<template>
  <div class="h-full rounded bg-white pb-6 px-8">
    <ElCard v-if="permissionList.includes('/api/activity/research/detail')">
      <ElRow class="mb-4">
        <ElCol :span="12">
          <ElCarousel style="border-radius: 16px" :interval="3000" direction="vertical" height="300">
            <ElCarouselItem v-for="image in imageList">
              <ElImage style="height: 100%; width: 100%" :src="image" />
            </ElCarouselItem>
          </ElCarousel>
        </ElCol>
        <ElCol :span="1" />
        <ElCol :span="11">
          <ElDescriptions :column="2" :title="preData.title">
            <template #extra>
              <ElButton
                v-if="permissionList.includes('/api/activity/update')"
                :icon="Edit"
                type="info"
                plain
                round
                @click="router.push({ path: '/activity/list/apply' })"
              >编辑</ElButton>
            </template>
            <template v-for="item in data">
              <ElDescriptionsItem v-if="item.value !== ''" :label="item.name+'：'">{{ item.value }}</ElDescriptionsItem>
            </template>
          </ElDescriptions>
        </ElCol>
      </ElRow>
      <ElTabs type="border-card">
        <ElCard class="pl-3" :body-style="{ padding: 0 }" :shadow="false">
          <ElScrollbar height="250px">
            <ElTabPane label="详细描述">
              <div v-html="description" />
            </ElTabPane>
            <ElTabPane label="活动总结">
              <div v-html="summarize" />
            </ElTabPane>
          </ElScrollbar>
        </ElCard>
      </ElTabs>
    </ElCard>
  </div>
</template>
<script lang="ts" setup>
import store from "@/store";
import type { IPermission } from "@/store/models";
import type { ICardData, ActivityInfo } from "@/models";
import { activity, files } from "@/api";
import { Edit } from "@element-plus/icons-vue";

const route = useRoute();
const router = useRouter();

const permissionList = ref<string[]>([]);
store.getters['common/userInfo'].permissionList.forEach((permission: IPermission) => {
  permissionList.value.push(permission.url);
});

const description = ref("");
const summarize = ref("");

const preData = reactive({
  title: "",
  organizer: "",
  coOrganizer: "",
  type: "",
  address: "",
  activityStartTime: "",
  activityEndTime: "",
  applicationStartTime: "",
  applicationEndTime: "",
  numberLimit: "--",
  realNumber: "--",
});
const data: ICardData[] = [
  {
    name: "组织者",
    value: preData.organizer,
  },
  {
    name: "协办方",
    value: preData.coOrganizer,
  },
  {
    name: "活动类型",
    value: preData.type,
  },
  {
    name: "活动地点",
    value: preData.address,
  },
  {
    name: "活动开始时间",
    value: preData.activityStartTime,
  },
  {
    name: "活动结束时间",
    value: preData.activityEndTime,
  },
  {
    name: "报名开始时间",
    value: preData.applicationStartTime,
  },
  {
    name: "报名截止时间",
    value: preData.applicationEndTime,
  },
  {
    name: "最大人数限制",
    value: preData.numberLimit,
  },
  {
    name: "实际参与人数",
    value: preData.realNumber,
  },
];

const imageList = ref<string[]>([]);

const getImageList = async () => {
  const { data } = await files.researchActivity({ id: Number(route.params.id) });
  if (data.code === 0) {
    const fileList: string[] = data.data.filesList;
    for (const fileName of fileList) {
      const res = await files.picture({ fileName: fileName });
      if (res.data.code === 0) {
        imageList.value.push(window.URL.createObjectURL(
            new Blob([res.data], { type: "arraybuffer" })
        ));
      }
    }
  }
};

const getDetail = async () => {
  const { data } = await activity.researchDetail({ id: Number(route.params.id) });
  if (data.code === 0) {
    const activityInfo: ActivityInfo = data.data.activityInfo;
    preData.title = activityInfo.title;
    preData.organizer = activityInfo.clubName!;
    preData.coOrganizer = activityInfo.coOrganizer;
    preData.type = activityInfo.type;
    preData.address = activityInfo.address;
    preData.activityStartTime = activityInfo.activityStartTime;
    preData.activityEndTime = activityInfo.activityEndTime;
    if (activityInfo.shouldApply === 1) {
      preData.applicationStartTime = activityInfo.applicationStartTime!;
      preData.applicationEndTime = activityInfo.applicationEndTime!;
    }
    preData.numberLimit = activityInfo.numberLimit ? activityInfo.numberLimit.toString() : "--";
    preData.realNumber = activityInfo.realNumber ? activityInfo.realNumber.toString() : "--";
    description.value = activityInfo.description ? activityInfo.description : "";
    summarize.value = activityInfo.summarize ? activityInfo.summarize : "";
  }
};

getImageList();
getDetail();
</script>