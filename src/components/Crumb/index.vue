<template>
  <ElBreadcrumb separator="/" class="pb-3">
    <ElBreadcrumbItem v-for="crumb of store.state.common.crumbs" v-show="crumb.to" :to="crumb.to">
      {{ crumb.title }}
    </ElBreadcrumbItem>
  </ElBreadcrumb>
</template>
<script lang="ts" setup>
import store from "@/store";
</script>