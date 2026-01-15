<template>
  <div class="post-list">
    <div class="post-grid">
      <article
        v-for="post in filteredPosts"
        :key="post.url"
        class="post-card"
        @click="navigateToPost(post.url)"
      >
        <div class="post-card-content">
          <h2 class="post-title">{{ post.title }}</h2>
          <p class="post-description">{{ post.description || '내용 없음' }}</p>
          <div class="post-meta">
            <span v-if="post.date" class="post-date">{{ formatDate(post.date) }}</span>
            <div class="post-tags">
              <span
                v-for="tag in post.tags"
                :key="tag"
                class="post-tag"
                @click.stop="filterByTag(tag)"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vitepress'

interface Post {
  title: string
  url: string
  description?: string
  date?: string
  tags?: string[]
}

const props = defineProps<{
  posts: Post[]
  selectedTag?: string | null
}>()

const router = useRouter()
const selectedTag = computed(() => props.selectedTag)

const filteredPosts = computed(() => {
  if (!selectedTag.value) {
    return props.posts
  }
  return props.posts.filter(post => 
    post.tags && post.tags.includes(selectedTag.value!)
  )
})

const formatDate = (date: string) => {
  const d = new Date(date)
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const navigateToPost = (url: string) => {
  router.go(url)
}

const emit = defineEmits<{
  (e: 'tag-clicked', tag: string): void
}>()

const filterByTag = (tag: string) => {
  emit('tag-clicked', tag)
}
</script>

<style scoped>
.post-list {
  width: 100%;
}

.post-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-top: 2rem;
}

.post-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: var(--vp-c-bg);
}

.post-card:hover {
  border-color: var(--vp-c-brand);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.post-card-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.post-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: var(--vp-c-text-1);
  line-height: 1.4;
}

.post-description {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  margin: 0;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 0.75rem;
  border-top: 1px solid var(--vp-c-divider);
}

.post-date {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.post-tag {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 4px;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.2s ease;
}

.post-tag:hover {
  background: var(--vp-c-brand);
  color: var(--vp-c-bg);
}

@media (max-width: 960px) {
  .post-grid {
    grid-template-columns: 1fr;
  }
}
</style>
