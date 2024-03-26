<template>
  <ElCard>
    <ElRow>
      <ElCol :span="12">
        <img :src="image" class="image" alt="nothing interesting" />
      </ElCol>
      <ElCol :span="1" />
      <ElCol :span="11">
        <ElDescriptions :title="title" :column="2">
          <template #extra>
            <ElButton
                v-if="detail"
                :icon="Document"
                type="info"
                plain
                round
                @click="props.research"
            >查看</ElButton>
            <ElButton
                v-if="edit"
                :icon="Edit"
                type="info"
                plain
                round
                @click="props.update"
            >编辑</ElButton>
            <ElButton
                v-if="remove"
                :icon="Delete"
                type="info"
                plain
                round
                @click="props.delete"
            >删除</ElButton>
          </template>
          <template v-for="item in data">
            <ElDescriptionsItem v-if="item.value !== ''" :label="item.name+'：'">{{ item.value }}</ElDescriptionsItem>
          </template>
        </ElDescriptions>
      </ElCol>
    </ElRow>
  </ElCard>
</template>
<script lang="ts" setup>
import { Document, Edit, Delete } from "@element-plus/icons-vue";
import type { PropType } from "vue";

const props = defineProps({
  image: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
  data: {
    type: Array as PropType<any[]>,
    default: [],
  },
  detailId: {
    type: Number,
    default: 0,
  },
  detail: {
    type: Boolean,
    default: false,
  },
  edit: {
    type: Boolean,
    default: false,
  },
  remove: {
    type: Boolean,
    default: false,
  },
  research: {
    type: Function,
  },
  update: {
    type: Function,
  },
  delete: {
    type: Function,
  }
});
</script>