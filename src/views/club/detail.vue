<template>
  <div class="h-full rounded bg-white pb-6 px-8">
    <ElCard v-if="permissionList.includes('/api/club/research/detail')">
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
          <ElDescriptions :column="2" :title="preData.clubName">
            <template #extra>
              <ElButton
                v-if="permissionList.includes('/api/club/update')"
                :icon="Edit"
                type="info"
                plain
                round
                @click="router.push({ path: '/club/list/apply' })"
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
            <ElTabPane label="核心成员">
              <template v-for="data in cardDataList">
                <OFCard :image="data[0].name" :title="data[1].name" :data="data" />
              </template>
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

const preData = reactive({
  clubName: "",
  realName: "",
  studentNumber: "",
  email: "",
  membersNumber: "--",
  type: "",
  clubLevel: "",
  department: "",
  totalFund: "--",
  surplusFund: "--",
  establishmentTime: "",
});
const data: ICardData[] = [
  {
    name: "会长",
    value: preData.realName,
  },
  {
    name: "学号",
    value: preData.studentNumber,
  },
  {
    name: "邮箱",
    value: preData.email,
  },
  {
    name: "社团类型",
    value: preData.type,
  },
  {
    name: "所属学院",
    value: preData.department,
  },
  {
    name: "社团等级",
    value: preData.clubLevel,
  },
  {
    name: "成立时间",
    value: preData.establishmentTime,
  },
  {
    name: "现有成员数",
    value: preData.membersNumber,
  },
  {
    name: "经费总额",
    value: preData.totalFund,
  },
  {
    name: "经费剩余",
    value: preData.surplusFund,
  },
];

const imageList = ref<string[]>([]);

const getImageList = async () => {
  const { data } = await files.researchClubImage({ id: Number(route.params.id) });
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
  const { data } = await club.researchDetail({ id: Number(route.params.id) });
  if (data.code === 0) {
    const clubInfo: ClubInfo = data.data.clubInfo;
    preData.clubName = clubInfo.clubName;
    preData.realName = clubInfo.realName!;
    preData.studentNumber = clubInfo.studentNumber!;
    preData.email = clubInfo.email!;
    preData.membersNumber = clubInfo.memberNumber ? clubInfo.memberNumber.toString() : "--";
    preData.type = clubInfo.type;
    preData.clubLevel = clubInfo.clubLevel!;
    preData.department = clubInfo.department!;
    preData.totalFund = clubInfo.totalFund ? clubInfo.totalFund.toString() : "--";
    preData.surplusFund = clubInfo.surplusFund ? clubInfo.surplusFund.toString() : "--";
    preData.establishmentTime = clubInfo.establishmentTime!
    description.value = clubInfo.description ? clubInfo.description : "";
  }
};

const getMember = async () => {
  const { data } = await member.research({ clubId: Number(route.params.id) });
  if (data.code === 0) {
    for (const value of data.data.memberList) {
      const res = await files.researchMember({ studentNumber: value.studentNumber });
      let imageSrc: string = "";
      if (res.data.code === 0) {
        const response = await files.picture({ fileName: res.data.data.fileName });
        if (response.data.code === 0) {
          imageSrc = window.URL.createObjectURL(
              new Blob([response.data], { type: "arraybuffer" })
          );
        }
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
        {
          name: "简介",
          value: value.description,
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