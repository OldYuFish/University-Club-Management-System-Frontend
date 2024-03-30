<template>
  <ElCol :span="12">
    <ElCard class="h-full" shadow="hover">
      <ElRow>
        <ElCol :span="10">
          <img :src="image" style="height: 200px" class="image" alt="nothing interesting" />
        </ElCol>
        <ElCol :span="1" />
        <ElCol :span="13">
          <ElDescriptions :title="title" :column="2">
            <template #extra>
              <ElButton
                  v-if="add"
                  :icon="Plus"
                  link
                  @click="props.create"
              >创建</ElButton>
              <ElButton
                  v-if="edit"
                  :icon="Edit"
                  link
                  @click="props.update"
              >编辑</ElButton>
              <ElButton
                  v-if="remove"
                  :icon="Delete"
                  link
                  @click="props.delete"
              >删除</ElButton>
            </template>
            <template v-for="item in data">
              <ElDescriptionsItem v-if="item.value !== ''" :label="item.name+'：'">
                {{ item.value }}
              </ElDescriptionsItem>
            </template>
          </ElDescriptions>
        </ElCol>
      </ElRow>
    </ElCard>
  </ElCol>
</template>
<script lang="ts" setup>
import { Plus, Edit, Delete } from "@element-plus/icons-vue";
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
  add: {
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
  create: {
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