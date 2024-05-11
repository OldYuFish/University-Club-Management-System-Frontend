<template>
  <div class="h-full rounded bg-white pb-6 px-8">
    <div
      class="py-6"
      style="font-size: x-large; font-weight: bold; color: #909399; text-align: center"
    >———— 科大风光 ————</div>
    <ElCarousel :interval="3000" type="card" height="300">
      <ElCarouselItem v-for="item in 5" :key="item">
        <ElImage style="height: 100%; width: 100%" :src="'/image/'+item+'.jpg'" />
      </ElCarouselItem>
    </ElCarousel>
    <div
      class="py-6"
      style="font-size: x-large; font-weight: bold; color: #909399; text-align: center"
    >———— 社团一览 ————</div>
    <ElRow>
      <ElCol :span="6">
        <ElCard style="background-color: #909399; color: white" class="m-1" header="科技类社团">
          <div style="font-size: x-large; font-weight: bold">
            总数：{{ clubCount.science }}
          </div>
        </ElCard>
      </ElCol>
      <ElCol :span="6">
        <ElCard style="background-color: #a8abb2; color: white" class="m-1" header="文体类社团">
          <div style="font-size: x-large; font-weight: bold">
            总数：{{ clubCount.culture }}
          </div>
        </ElCard>
      </ElCol>
      <ElCol :span="6">
        <ElCard style="background-color: #b1b3b8; color: white" class="m-1" header="社工类社团">
          <div style="font-size: x-large; font-weight: bold">
            总数：{{ clubCount.society }}
          </div>
        </ElCard>
      </ElCol>
      <ElCol :span="6">
        <ElCard style="background-color: #c0c4cc; color: white" class="m-1" header="其他社团">
          <div style="font-size: x-large; font-weight: bold">
            总数：{{ clubCount.others }}
          </div>
        </ElCard>
      </ElCol>
    </ElRow>
  </div>
</template>
<script lang="ts" setup>
import { club } from "@/api";
import { Mouse } from "@element-plus/icons-vue";

const clubCount = reactive({
  science: 0,
  culture: 0,
  society: 0,
  others: 0,
});

const getCount = async () => {
  const { data }  = await club.count();
  if (data.code === 0) {
    clubCount.science = data.data.science;
    clubCount.culture = data.data.culture;
    clubCount.society = data.data.society;
    clubCount.others = data.data.others;
  }
}

getCount();
</script>