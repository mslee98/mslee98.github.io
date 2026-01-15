<template>
  <div class="tag-cloud" v-if="sortedTags.length > 0">
    <h3 class="tag-cloud-title">태그</h3>
    <div class="tag-list">
      <button
        v-for="tag in sortedTags"
        :key="tag.name"
        class="tag-item"
        :class="{ active: currentSelectedTag === tag.name }"
        @click="handleTagClick(tag.name)"
      >
        <span class="tag-name">{{ tag.name }}</span>
        <span class="tag-count">{{ tag.count }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Tag {
  name: string
  count: number
}

const props = defineProps<{
  tags?: Tag[]
  selectedTag?: string | null
}>()

const emit = defineEmits<{
  (e: 'tag-selected', tag: string | null): void
}>()

const currentSelectedTag = computed(() => {
  return props.selectedTag || null
})

const sortedTags = computed(() => {
  if (!props.tags || props.tags.length === 0) {
    return []
  }
  return [...props.tags].sort((a, b) => b.count - a.count)
})

const handleTagClick = (tag: string) => {
  if (currentSelectedTag.value === tag) {
    emit('tag-selected', null)
    window.history.pushState({}, '', window.location.pathname)
  } else {
    emit('tag-selected', tag)
    window.history.pushState({}, '', `?tag=${encodeURIComponent(tag)}`)
  }
}
</script>

<style scoped>
.tag-cloud {
  padding: 1rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  margin-bottom: 2rem;
}

.tag-cloud-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  color: var(--vp-c-text-1);
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.tag-item:hover {
  border-color: var(--vp-c-brand);
  background: var(--vp-c-bg-soft);
}

.tag-item.active {
  background: var(--vp-c-brand);
  border-color: var(--vp-c-brand);
  color: var(--vp-c-bg);
}

.tag-name {
  color: inherit;
}

.tag-count {
  font-size: 0.85rem;
  opacity: 0.8;
}

.tag-item.active .tag-count {
  opacity: 1;
}
</style>
