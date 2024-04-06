<template>
  <div class="gk-table-wrap rounded-b">
    <ElTable :data="data">
      <template #empty>
        <div>暂时没有数据哦！</div>
      </template>
      <template v-for="col in column">
        <ElTableColumn
          :type="col.type"
          :label="col.label"
          :prop="col.prop"
          :sortable="col.sortable"
          :fixed="col.fixed"
        />
      </template>
      <ElTableColumn v-if="showOperation" align="right" fixed="right" label="操作">
        <template #default="{ $index, row }">
          <ElPopconfirm
            title="确定要删除该条目吗？"
            cancel-button-type="text"
            @confirm="operate(OptionType.Delete, row, $index)"
          >
            <template #reference>
              <ElButton
                v-if="showDelete"
                class="m-1"
                :icon="Delete"
                type="info"
                plain
                round
              >删除</ElButton>
            </template>
          </ElPopconfirm>
          <ElButton
            v-if="showUpdate"
            class="m-1"
            :icon="Edit"
            type="info"
            plain
            round
            @click="operate(OptionType.Update, row)"
          >{{ row.statusCode === 1 ? "审批" : "编辑" }}</ElButton>
          <ElButton
            v-if="showDetail"
            class="m-1"
            :icon="Document"
            type="info"
            plain
            round
            @click="operate(OptionType.Detail, row)"
          >{{ row.statusCode === 3 ? "详情" : "预览" }}</ElButton>
          <slot name="customButton" :id="row.id" :row="row"></slot>
        </template>
      </ElTableColumn>
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
import { Delete, Loading, Edit, Document } from "@element-plus/icons-vue";
import type { PropType } from "vue";
import { club, activity, fund, role } from "@/api";
import { ElMessage } from "element-plus";
import type { IColumn } from "@/models/ITable";

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
  column: {
    type: Array as PropType<IColumn[]>,
    default: () => [],
  },
  showOperation: {
    type: Boolean,
    default: true,
  },
  showDelete: {
    type: Boolean,
    default: true,
  },
  showUpdate: {
    type: Boolean,
    default: true,
  },
  showDetail: {
    type: Boolean,
    default: true,
  },
});

const router = useRouter();
const route = useRoute();

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

const operate = async (type: OptionType, row: any, index?: number) => {
  if (type === OptionType.Delete) {
    let code: number = -1;
    const firstName = route.name!.toString().split('-')[0];
    if (firstName === "club") {
      const { data } = await club.delete({ id: row.id });
      code = data.code;
    } else if (firstName === "activity") {
      const { data } = await activity.delete({ id: row.id });
      code = data.code;
    } else if (firstName === "fund") {
      const { data } = await fund.delete({ id: row.id });
      code = data.code;
    } else if (firstName === "role") {
      const { data } = await role.deleteRole({ id: row.id });
      code = data.code;
    }
    if (code === 0) {
      ElMessage.success("删除成功！");
      props.data.splice(index!, 1);
    }
  }
  if (type === OptionType.Update) {
    await router.push({ path: "/"+route.name!.toString().split('-')[0]+"/apply/" + row.id.toString() });
  }
  if (type === OptionType.Detail) {
    await router.push({ path: "/"+route.name!.toString().split('-')[0]+"/detail/"+row.id.toString() });
  }
};

enum OptionType {
  Delete,
  Update,
  Detail,
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
