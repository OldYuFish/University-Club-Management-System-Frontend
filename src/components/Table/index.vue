<template>
  <div class="gk-table-wrap rounded-b">
    <ElTable :data="data">
      <template #default>
        <slot name="tableColumn"></slot>
      </template>
    </ElTable>
    <div class="flex justify-end pt-4 pb-3 rounded-b bg-white">
      <ElPagination
          v-model:currentPage="pageCfg.pageIndex"
          v-model:pageSize="pageCfg.pageSize"
          background
          layout="total, prev, pager, next, sizes, jumper"
          :pageSizes="[10, 20, 30, 50, 70, 100, 150, 200, 300, 500, 1000]"
          :total="pageCfg.total"
          :hideOnSinglePage="true"
          @currentChange="currentChange"
          @sizeChange="currentSizeChange"
      ></ElPagination>
    </div>
    <div v-if="loading" class="absolute left-0 top-0 w-full h-full bg-gray-300 bg-opacity-30 z-10">
      <ElIcon class="spin absolute inset-0 m-auto text-3xl text-blue-400">
        <Loading class="align-baseline" />
      </ElIcon>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { Loading } from '@element-plus/icons-vue'
import type { PropType } from 'vue'
import { computed } from 'vue'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object as PropType<any[]>,
    default() {
      return []
    },
  },
  pageConfig: {
    type: Object as PropType<IPagination>,
    default: () => {
      return {
        pageIndex: 1,
        pageSize: 10,
        total: 0,
      }
    },
  },
});

const emits = defineEmits({
  pageChange: (_pageIndex: number, _pageSize: number) => true,
});

// 分页配置项, 双向绑定, 外部传入值覆盖内部值改变
const pageCfg = computed(() => props.pageConfig)

const currentChange = (pageIndex: number) => {
  emits('pageChange', pageIndex, pageCfg.value.pageSize!)
}
const currentSizeChange = (pageSize: number) => {
  emits('pageChange', 1, pageSize!)
}
</script>
<style lang="scss" scoped>
.gk-table-wrap {
  position: relative;

  :deep(.table-header) {
    background-color: #f8f8f8 !important;
    color: rgba(0, 0, 0, 0.85);
  }

  :deep(.el-empty__description) {
    p {
      font-size: 16px;
      color: #000000 !important;
      font-weight: 400;
    }
  }

  :deep(.btn-prev) {
    border-radius: 8px;
  }

  :deep(.btn-next) {
    border-radius: 8px;
    margin-right: 16px !important;
  }

  .spin {
    animation: rotating 3s linear infinite;
  }
}
</style>
