<template>
  <DefaultTheme.Layout v-bind="$attrs">
    <!-- 모든 페이지 하단에 Giscus 표시 -->
    <template #doc-after>
      <Giscus />
    </template>
  </DefaultTheme.Layout>
</template>

<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import Giscus from '../components/Giscus.vue'

</script>
