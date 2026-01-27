// 빌드 타임에만 실행되는 유틸리티
// @ts-ignore - Node.js 환경에서만 실행됨
import { readdirSync, readFileSync, statSync } from 'fs'
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

    if (trimmed.startsWith('- ')) {
      if (!inArray) {
        arrayValues = []
        inArray = true
      }
      let value = trimmed.slice(2).trim()
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }
      arrayValues.push(value)
      frontmatter[currentKey] = arrayValues
    } else if (trimmed.includes(':')) {
      inArray = false
      const colonIndex = trimmed.indexOf(':')
      const key = trimmed.slice(0, colonIndex).trim()
      let value = trimmed.slice(colonIndex + 1).trim()

      currentKey = key

      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      } else if (value === 'true') {
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
    const posts: Post[] = []

    function scanDirectory(
      dir: string,
      relativePath: string = '',
      isRootLevel: boolean = true,
      parentFrontmatter?: Record<string, any>
    ): void {
      const items = readdirSync(dir)

      for (const item of items) {
        const itemPath = join(dir, item)
        const stat = statSync(itemPath)

        if (stat.isDirectory()) {
          const indexPath = join(itemPath, 'index.md')
          let currentDirFrontmatter = parentFrontmatter

          try {
            if (statSync(indexPath).isFile()) {
              const content = readFileSync(indexPath, 'utf-8')
              const { frontmatter } = parseFrontmatter(content)
              currentDirFrontmatter = frontmatter

              const url = relativePath
                ? `/sites/article/${relativePath}/${item}/`
                : `/sites/article/${item}/`

              posts.push({
                title: frontmatter.title || item,
                url,
                description: frontmatter.description,
                date: frontmatter.date,
                tags: frontmatter.tags || []
              })
            }
          } catch {
            // index.md 없음
          }

          const newRelativePath = relativePath ? `${relativePath}/${item}` : item
          scanDirectory(itemPath, newRelativePath, false, currentDirFrontmatter)
        }

        // 루트 레벨 md 파일
        else if (stat.isFile() && item.endsWith('.md')) {
          if (item === 'index.md') continue
          if (!isRootLevel) continue

          const content = readFileSync(itemPath, 'utf-8')
          const { frontmatter } = parseFrontmatter(content)

          const fileName = item.replace(/\.md$/, '')
          const url = `/sites/article/${fileName}`

          posts.push({
            title: frontmatter.title || fileName,
            url,
            description: frontmatter.description,
            date: frontmatter.date ?? parentFrontmatter?.date,
            tags: frontmatter.tags || parentFrontmatter?.tags || []
          })
        }
      }
    }

    scanDirectory(articleDir, '', true)

    return posts.sort((a, b) => {
      if (!a.date || !b.date) return 0
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
  } catch (error) {
    console.warn('Failed to load posts:', error)
    return []
  }
}
