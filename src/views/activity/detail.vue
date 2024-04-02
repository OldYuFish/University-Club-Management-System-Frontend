<template>
  <div class="h-full rounded bg-white py-6 px-8">
    <ElCard v-if="permissionList.includes('/api/activity/research/detail')">
      <ElRow class="mb-4">
        <ElCol :span="12">
          <ElCarousel style="border-radius: 16px" :interval="3000" direction="vertical" height="300">
            <template v-if="imageList.length === 0">
              <ElCarouselItem>
                <ElImage style="height: 100%; width: 100%" src="/image/default.png" />
              </ElCarouselItem>
            </template>
            <template v-else>
              <ElCarouselItem v-for="image in imageList">
                <ElImage style="height: 100%; width: 100%" :src="image" />
              </ElCarouselItem>
            </template>
          </ElCarousel>
        </ElCol>
        <ElCol :span="1" />
        <ElCol :span="11">
          <ElDescriptions :column="2" :title="title">
            <template #extra>
              <ElButton
                v-if="permissionList.includes('/api/activity/update')"
                :icon="Edit"
                type="info"
                plain
                round
                @click="router.push({ path: `/activity/apply/${route.params.id}` })"
              >编辑</ElButton>
            </template>
            <template v-for="item in detailData">
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
const detailData = ref<ICardData[]>([]);
const title = ref("");
const imageList = ref<string[]>([]);

const getImageList = async () => {
  const { data } = await files.researchActivity({ id: Number(route.params.id) });
  if (data.code === 0) {
    const fileList: string[] = data.data.filesList;
    for (const fileName of fileList) {
      const res = await files.picture({ fileName: fileName });
      imageList.value.push(window.URL.createObjectURL(
          new Blob([res.data], { type: "arraybuffer" })
      ));
    }
  }
};

const getDetail = async () => {
  const { data } = await activity.researchDetail({ id: Number(route.params.id) });
  if (data.code === 0) {
    const activityInfo: ActivityInfo = data.data.activityInfo;
    detailData.value.push({
      name: "组织者",
      value: activityInfo.clubName!,
    });
    detailData.value.push({
      name: "协办方",
      value: activityInfo.coOrganizer,
    });
    detailData.value.push({
      name: "活动类型",
      value: activityInfo.type,
    });
    detailData.value.push({
      name: "活动地点",
      value: activityInfo.address,
    });
    detailData.value.push({
      name: "活动开始时间",
      value: activityInfo.activityStartTime,
    });
    detailData.value.push({
      name: "活动结束时间",
      value: activityInfo.activityEndTime,
    });
    if (activityInfo.shouldApply === 1) {
      detailData.value.push({
        name: "报名开始时间",
        value: activityInfo.applicationStartTime!,
      });
      detailData.value.push({
        name: "报名截止时间",
        value: activityInfo.applicationEndTime!,
      });
    }
    detailData.value.push({
      name: "最大人数限制",
      value: activityInfo.numberLimit ? activityInfo.numberLimit.toString() : "--",
    });
    detailData.value.push({
      name: "实际参与人数",
      value: activityInfo.realNumber ? activityInfo.realNumber.toString() : "--",
    });
    title.value = activityInfo.title;
    description.value = activityInfo.description ? activityInfo.description : "";
    summarize.value = activityInfo.summarize ? activityInfo.summarize : "";
  }
};

getImageList();
getDetail();
</script>