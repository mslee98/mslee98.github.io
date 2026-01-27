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
import { useRoute, useData } from 'vitepress'
import { useHead } from '@vueuse/head'
import { computed } from 'vue'
import Giscus from '../components/Giscus.vue'

const route = useRoute()
const { site, frontmatter } = useData()

// 페이지별 canonical URL 생성
const canonicalUrl = computed(() => {
  const base = site.value.base.replace(/\/$/, '')
  const path = route.path.endsWith('/')
    ? route.path
    : route.path + '/'

  return `https://mslee98.github.io${base}${path}`
})

// SEO Head 설정
useHead({
  link: [
    {
      rel: 'canonical',
      href: frontmatter.value.canonical ?? canonicalUrl.value
    }
  ]
})
</script>
