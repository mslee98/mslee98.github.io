export interface Post {
  title: string
  url: string
  description?: string
  date?: string
  tags?: string[]
}

// 모든 게시글에서 태그 추출
export function getAllTags(posts: Post[]): { name: string; count: number }[] {
  const tagMap = new Map<string, number>()
  
  posts.forEach(post => {
    if (post.tags) {
      post.tags.forEach(tag => {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1)
      })
    }
  })
  
  return Array.from(tagMap.entries()).map(([name, count]) => ({
    name,
    count
  }))
}


