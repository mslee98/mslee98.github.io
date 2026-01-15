// 빌드 타임에만 실행되는 유틸리티
// @ts-ignore - Node.js 환경에서만 실행됨
import { readdirSync, readFileSync } from 'fs'
// @ts-ignore - Node.js 환경에서만 실행됨
import { join } from 'path'

export interface Post {
  title: string
  url: string
  description?: string
  date?: string
  tags?: string[]
}

// frontmatter 파싱 함수
function parseFrontmatter(content: string): {
  frontmatter: Record<string, any>
  body: string
} {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
  const match = content.match(frontmatterRegex)

  if (!match) {
    return { frontmatter: {}, body: content }
  }

  const frontmatterText = match[1]
  const body = match[2]

  const frontmatter: Record<string, any> = {}
  const lines = frontmatterText.split('\n')
  
  let currentKey = ''
  let arrayValues: string[] = []
  let inArray = false

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    // 배열 항목
    if (trimmed.startsWith('- ')) {
      if (!inArray) {
        arrayValues = []
        inArray = true
      }
      let value = trimmed.slice(2).trim()
      // 따옴표 제거
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }
      arrayValues.push(value)
      frontmatter[currentKey] = arrayValues
    }
    // 키-값 쌍
    else if (trimmed.includes(':')) {
      inArray = false
      const colonIndex = trimmed.indexOf(':')
      const key = trimmed.slice(0, colonIndex).trim()
      let value = trimmed.slice(colonIndex + 1).trim()
      
      currentKey = key
      
      // 따옴표 제거
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }
      // 불리언 처리
      else if (value === 'true') {
        frontmatter[key] = true
        continue
      } else if (value === 'false') {
        frontmatter[key] = false
        continue
      }
      
      frontmatter[key] = value
    }
  }

  return { frontmatter, body }
}

// Article 디렉토리에서 모든 게시글 자동 로드
export function loadPosts(): Post[] {
  try {
    const cwd = typeof process !== 'undefined' ? process.cwd() : ''
    const articleDir = join(cwd, 'sites', 'article')
    const files = readdirSync(articleDir)
    
    const posts: Post[] = []

    for (const file of files) {
      // index.md는 제외
      if (file === 'index.md') continue
      if (!file.endsWith('.md')) continue

      try {
        const filePath = join(articleDir, file)
        const content = readFileSync(filePath, 'utf-8')
        const { frontmatter } = parseFrontmatter(content)

        // 파일명에서 확장자 제거하여 URL 생성
        const fileName = file.replace(/\.md$/, '')
        const url = `/sites/article/${fileName}`

        // frontmatter에서 정보 추출
        const post: Post = {
          title: frontmatter.title || fileName,
          url,
          description: frontmatter.description,
          date: frontmatter.date,
          tags: frontmatter.tags || []
        }

        posts.push(post)
      } catch (error) {
        console.warn(`Failed to parse ${file}:`, error)
      }
    }

    // 날짜순으로 정렬 (최신순)
    return posts.sort((a, b) => {
      if (!a.date || !b.date) return 0
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
  } catch (error) {
    console.warn('Failed to load posts:', error)
    return []
  }
}
