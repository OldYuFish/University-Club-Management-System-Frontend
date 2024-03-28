<template>
  <ElDialog
    v-model="_visible"
    width="520"
    @open="openModel"
    @closed="closeModel"
  >
    <ElScrollbar height="250">
      <ElDescriptions :column="2" :title="title">
        <template v-for="item in descData">
          <ElDescriptionsItem v-if="item.value !== ''" :label="item.name+'：'">{{ item.value }}</ElDescriptionsItem>
        </template>
      </ElDescriptions>
    </ElScrollbar>
  </ElDialog>
</template>
<script lang="ts" setup>
import { fund } from "@/api";
import type { FundInfo } from "@/models";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  detailId: {
    type: Number,
    default: 0,
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

const descData = ref<any[]>([]);
const title = ref("");

const openModel = async () => {
  const { data } = await fund.researchDetail({ id: props.detailId });
  if (data.code === 0) {
    const detailData: FundInfo = data.data.fundInfo;
    title.value = detailData.theme;
    descData.value = [
      {
        name: "申请方",
        value: detailData.clubName,
      },
      {
        name: "经费类型",
        value: detailData.type,
      },
      {
        name: "经费总额",
        value: detailData.amount ? detailData.amount.toString() : "--",
      },
      {
        name: "经费结余",
        value: detailData.surplus ? detailData.surplus.toString() : "--",
      },
      {
        name: "拨款时间",
        value: detailData.appropriationTime,
      },
    ];
    if (detailData.type === "活动经费") {
      descData.value.push({
        name: "活动标题",
        value: detailData.title,
      });
    } else if (detailData.type === "竞赛奖金") {
      descData.value = [
        {
          name: "竞赛名称",
          value: detailData.competitionBonus!.competitionName,
        },
        {
          name: "竞赛类型",
          value: detailData.competitionBonus!.type,
        },
        {
          name: "竞赛级别",
          value: detailData.competitionBonus!.competitionLevel,
        },
        {
          name: "所获奖项",
          value: detailData.competitionBonus!.award,
        },
      ].concat(descData.value);
    }
  }
};

const closeModel = () => {
  emits('update:visible', false);
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
