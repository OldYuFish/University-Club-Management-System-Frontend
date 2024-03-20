<template>
  <ElCard>
    <img :src="props.image" class="image" alt="nothing interesting" />
    <ElDescriptions :title="props.title" :column="2">
      <template #extra>
        <ElButton
            v-show="props.detail"
            :icon="Document"
            type="info"
            plain
            round
            @click="props.research"
        >查看</ElButton>
        <ElButton
            v-show="props.edit"
            :icon="Edit"
            type="info"
            plain
            round
            @click="props.update"
        >编辑</ElButton>
        <ElButton
            v-show="props.remove"
            :icon="Delete"
            type="info"
            plain
            round
            @click="props.delete"
        >删除</ElButton>
      </template>
      <template v-for="( value, key) in props.data">
        <ElDescriptionsItem :label="key+'：'">{{ value }}</ElDescriptionsItem>
      </template>
    </ElDescriptions>
  </ElCard>
</template>
<script lang="ts" setup>
import { Document, Edit, Delete } from "@element-plus/icons-vue";

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
    type: Object,
    default: () => {
      return {}
    },
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