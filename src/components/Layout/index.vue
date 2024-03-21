<template>
  <UseWindowSize v-slot="{ height }">
    <ElConfigProvider :locale="zh">
      <ElContainer :style="{ height: `${height}px` }">
        <ElHeader style="background-color: #545c64" class="box-content p-0 header">
          <OFHeader />
        </ElHeader>
        <ElContainer style="background-color: #f5f5f5">
          <ElAside style="background-color: #545c64" class="relative w-auto">
            <OFAside :height="height-72" />
          </ElAside>
          <ElScrollbar :style="{ height: `${height-72}px` }" class="w-full">
            <ElMain class="py-3">
              <OFCrumb />
              <RouterView v-slot="{ Component, route }">
                <Transition
                  v-if="route.meta.keepAlive"
                  :name="route.meta.transition as string || 'fade'"
                  mode="out-in"
                  appear
                >
                  <KeepAlive :max="5">
                    <Component :is="Component" :key="route.meta.key || route.name" />
                  </KeepAlive>
                </Transition>
                <Transition
                  v-if="!route.meta.keepAlive"
                  :name="route.meta.transition as string || 'fade'"
                  mode="out-in"
                  appear
                >
                  <Component :is="Component" :key="route.meta.key || route.name" />
                </Transition>
              </RouterView>
            </ElMain>
          </ElScrollbar>
        </ElContainer>
      </ElContainer>
    </ElConfigProvider>
  </UseWindowSize>
</template>
<script lang="ts" setup>
import { UseWindowSize } from "@vueuse/components";
import zh from "element-plus/es/locale/lang/zh-cn";
import OFHeader from "./Header.vue";
import OFAside from "./Aside.vue";
import OFCrumb from "../Crumb/index.vue";
</script>
<style scoped>
.header {
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
  z-index: 1;
}
</style>