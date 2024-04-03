<template>
  <div class="h-full rounded bg-white py-6 px-8">
    <ElCard v-if="permissionList.includes('/api/club/research/detail')">
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
          <ElDescriptions :column="2" :title="clubName">
            <template #extra>
              <ElButton
                v-if="permissionList.includes('/api/club/update')"
                :disabled="statusCode !== 3"
                :icon="Edit"
                type="info"
                plain
                round
                @click="router.push({ path: `/club/apply/${route.params.id}` })"
              >编辑</ElButton>
            </template>
            <template v-for="item in detailData">
              <ElDescriptionsItem v-if="item.value !== ''" :label="item.name+'：'">{{ item.value }}</ElDescriptionsItem>
            </template>
          </ElDescriptions>
        </ElCol>
      </ElRow>
      <ElTabs type="border-card">
        <ElCard class="pl-2 py-2" :body-style="{ padding: 0 }" :shadow="false">
          <ElScrollbar height="250px">
            <ElTabPane label="详细描述">
              <div v-html="description" />
            </ElTabPane>
            <ElTabPane label="核心成员">
              <ElRow>
                <template v-for="data in cardDataList">
                  <OFCard :image="data[0].name" :title="data[1].name" :data="data" />
                </template>
              </ElRow>
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
import type { ClubInfo, ICardData } from "@/models";
import OFCard from "@/components/Card/index.vue";
import { club, files, member } from "@/api";
import { Edit } from "@element-plus/icons-vue";

const route = useRoute();
const router = useRouter();

const permissionList = ref<string[]>([]);
store.getters['common/userInfo'].permissionList.forEach((permission: IPermission) => {
  permissionList.value.push(permission.url);
});

const description = ref("");
const cardDataList = ref<any[]>([]);
const detailData = ref<ICardData[]>([]);
const clubName = ref("");
const statusCode = ref<number>();

const imageList = ref<string[]>([]);

const getImageList = async () => {
  const { data } = await files.researchClubImage({ id: Number(route.params.id) });
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
  const { data } = await club.researchDetail({ id: Number(route.params.id) });
  if (data.code === 0) {
    const clubInfo: ClubInfo = data.data.clubInfo;
    detailData.value.push({
      name: "会长",
      value: clubInfo.realName!,
    });
    detailData.value.push({
      name: "学号",
      value: clubInfo.studentNumber!,
    });
    detailData.value.push({
      name: "邮箱",
      value: clubInfo.email!,
    });
    detailData.value.push({
      name: "社团类型",
      value: clubInfo.type,
    });
    detailData.value.push({
      name: "所属学院",
      value: clubInfo.department!,
    });
    detailData.value.push({
      name: "社团等级",
      value: clubInfo.clubLevel!,
    });
    detailData.value.push({
      name: "成立时间",
      value: clubInfo.establishmentTime ? clubInfo.establishmentTime : "暂未成立",
    });
    detailData.value.push({
      name: "现有成员数",
      value: clubInfo.membersNumber ? clubInfo.membersNumber.toString() : "--",
    });
    detailData.value.push({
      name: "经费总额",
      value: clubInfo.totalFund ? clubInfo.totalFund.toString() : "--",
    });
    detailData.value.push({
      name: "经费剩余",
      value: clubInfo.surplusFund ? clubInfo.surplusFund.toString() : "--",
    });
    clubName.value = clubInfo.clubName;
    statusCode.value = clubInfo.statusCode;
    description.value = clubInfo.description ? clubInfo.description : "";
  }
};

const getMember = async () => {
  const { data } = await member.research({ clubId: Number(route.params.id) });
  if (data.code === 0) {
    for (const value of data.data.memberList) {
      const res = await files.researchMember({ studentNumber: value.studentNumber });
      let imageSrc: string = "/image/nothing.png";
      if (res.data.code === 0 && res.data.data.fileName) {
        const response = await files.picture({ fileName: res.data.data.fileName });
        imageSrc = window.URL.createObjectURL(
            new Blob([response.data], { type: "arraybuffer" })
        );
      }
      const memberDetail = [
        {
          name: imageSrc,
          value: "",
        },
        {
          name: value.memberName,
          value: "",
        },
        {
          name: "邮箱",
          value: value.email,
        },
        {
          name: "学号",
          value: value.studentNumber,
        },
        {
          name: "院系",
          value: value.department,
        },
        {
          name: "职务",
          value: value.job,
        },
        {
          name: "荣誉",
          value: value.honor,
        },
      ];
      cardDataList.value.push(memberDetail);
    }
  }
};

getImageList();
getDetail();
getMember();
</script>