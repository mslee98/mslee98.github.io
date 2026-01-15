<template>
  <div class="posts-page">
    <div class="posts-container">
      <div class="posts-content">
        <h1>Article</h1>
        <p>작성한 글들을 모아둔 페이지입니다.</p>
        
        <PostList :posts="posts" :selected-tag="selectedTag" @tag-clicked="handleTagSelected" />
      </div>
      
      <aside class="posts-sidebar">
        <TagCloud 
          v-if="allTags && allTags.length > 0" 
          :tags="allTags" 
          :selected-tag="selectedTag" 
          @tag-selected="handleTagSelected" 
        />
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import PostList from './PostList.vue'
import TagCloud from './TagCloud.vue'
import { allPosts } from '../utils/postsData'
import { getAllTags } from '../utils/posts'

const posts = allPosts || []
const allTags = getAllTags(posts)
const selectedTag = ref<string | null>(null)

// URL에서 태그 파라미터 읽기
const getTagFromURL = () => {
  if (typeof window === 'undefined') return null
  const params = new URLSearchParams(window.location.search)
  return params.get('tag')
}

const handleTagSelected = (tag: string | null) => {
  selectedTag.value = tag
  
  // URL 업데이트
  if (typeof window !== 'undefined') {
    if (tag) {
      window.history.pushState({}, '', `?tag=${encodeURIComponent(tag)}`)
    } else {
      window.history.pushState({}, '', window.location.pathname)
    }
  }
}

// 마크다운 내용 숨기기 (Article 페이지는 커스텀 컴포넌트로 렌더링)
const hideMarkdownContent = () => {
  nextTick(() => {
    const docContent = document.querySelector('.vp-doc')
    if (docContent) {
      // Article 페이지의 마크다운 내용(# Article, 작성한 글들을...) 숨기기
      const h1 = docContent.querySelector('h1')
      if (h1 && h1.textContent?.trim() === 'Article') {
        // h1과 그 다음 p 태그 숨기기
        let nextSibling = h1.nextElementSibling
        while (nextSibling && nextSibling.tagName === 'P') {
          nextSibling.style.display = 'none'
          nextSibling = nextSibling.nextElementSibling
        }
        h1.style.display = 'none'
      }
    }
  })
}

onMounted(() => {
  hideMarkdownContent()
  selectedTag.value = getTagFromURL()
})

// URL 파라미터 변경 감지 (popstate 이벤트)
if (typeof window !== 'undefined') {
  window.addEventListener('popstate', () => {
    selectedTag.value = getTagFromURL()
  })
}
</script>

<style scoped>
.posts-page {
  width: 100%;
  margin: 0;
  padding: 2rem 0 0;
  box-sizing: border-box;
}

.posts-container {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 2rem;
  max-width: var(--vp-layout-max-width);
  margin: 0 auto;
  padding: 0 1.5rem;
  box-sizing: border-box;
}

.posts-content {
  min-width: 0;
  width: 100%;
}

@media (min-width: 960px) {
  .posts-container {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

@media (min-width: 1440px) {
  .posts-container {
    padding-left: 4rem;
    padding-right: 4rem;
  }
}

.posts-content h1 {
  margin-top: 0;
  margin-bottom: 1rem;
}

.posts-content p {
  margin-bottom: 2rem;
  color: var(--vp-c-text-2);
}

.posts-sidebar {
  position: sticky;
  top: 2rem;
  height: fit-content;
}

@media (max-width: 960px) {
  .posts-container {
    grid-template-columns: 1fr;
    padding: 0 1.5rem;
  }
  
  .posts-sidebar {
    position: static;
    order: -1;
  }
}

@media (max-width: 640px) {
  .posts-container {
    padding: 0 1rem;
  }
}
</style>
