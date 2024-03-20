<template>
  <ElHeader height="160px"></ElHeader>
  <ElResult
    icon="error"
    :title="props.title"
    :subTitle="props.subTitle"
  >
    <template #extra>
      <ElButton type="danger" @click="back" round plain>
        <ElCountdown
          format="s"
          :value="Date.now() + 1000 * 5"
          prefix="返回 "
          suffix="s"
          @finish="back"
        />
      </ElButton>
    </template>
  </ElResult>
</template>

<script lang="ts" setup>
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  subTitle: {
    type: String,
    default: '',
  },
});

const router = useRouter();

const back = () => {
  router.push({ path: "/home" });
}
</script>
