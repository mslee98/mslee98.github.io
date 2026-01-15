<template>
  <div class="giscus-wrapper">
    <div ref="giscusContainer" class="giscus"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()
const giscusContainer = ref<HTMLElement | null>(null)
let giscusScript: HTMLScriptElement | null = null

// 현재 테마 감지 함수
const getCurrentTheme = (): string => {
  if (typeof window === 'undefined') return 'light'
  
  // VitePress는 HTML 요소에 'dark' 클래스를 추가/제거합니다
  const isDark = document.documentElement.classList.contains('dark')
  return isDark ? 'dark' : 'light'
}

// Giscus 테마 변경 (스크립트를 다시 로드하지 않고 메시지로 전달)
const updateGiscusTheme = () => {
  if (typeof window === 'undefined') return
  
  const theme = getCurrentTheme()
  const giscusFrame = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame')
  
  if (giscusFrame && giscusFrame.contentWindow) {
    giscusFrame.contentWindow.postMessage(
      { giscus: { setConfig: { theme } } },
      'https://giscus.app'
    )
  }
}

const loadGiscus = () => {
  if (!giscusContainer.value) return

  // 기존 스크립트가 있으면 제거
  if (giscusScript && giscusScript.parentNode) {
    giscusScript.parentNode.removeChild(giscusScript)
  }

  // 기존 giscus 댓글 영역 제거
  const existingGiscus = giscusContainer.value.querySelector('.giscus')
  if (existingGiscus) {
    existingGiscus.innerHTML = ''
  }

  // 새 스크립트 생성
  const script = document.createElement('script')
  script.src = 'https://giscus.app/client.js'
  script.setAttribute('data-repo', 'mslee98/ms-fundamentals')
  script.setAttribute('data-repo-id', 'R_kgDOQ5cerg')
  script.setAttribute('data-category-id', 'DIC_kwDOQ5cers4C07tC')
  script.setAttribute('data-mapping', 'title')
  script.setAttribute('data-strict', '0')
  script.setAttribute('data-reactions-enabled', '1')
  script.setAttribute('data-emit-metadata', '0')
  script.setAttribute('data-input-position', 'bottom')
  script.setAttribute('data-theme', getCurrentTheme())
  script.setAttribute('data-lang', 'ko')
  script.setAttribute('data-loading', 'lazy')
  script.crossOrigin = 'anonymous'
  script.async = true

  giscusScript = script
  giscusContainer.value.appendChild(script)
}

// 테마 변경 감지를 위한 MutationObserver
let themeObserver: MutationObserver | null = null

onMounted(() => {
  loadGiscus()

  // HTML 요소의 클래스 변경 감지 (다크모드 토글 감지)
  if (typeof window !== 'undefined') {
    themeObserver = new MutationObserver(() => {
      // 테마가 변경되면 Giscus에 메시지만 전달 (다시 로드하지 않음)
      // iframe이 로드될 때까지 약간의 지연
      setTimeout(() => {
        updateGiscusTheme()
      }, 100)
    })

    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
  }
})

onUnmounted(() => {
  if (themeObserver) {
    themeObserver.disconnect()
  }
})

// 페이지 변경 시 Giscus 다시 로드
watch(() => route.path, () => {
  // 약간의 지연을 두어 DOM이 업데이트된 후 실행
  setTimeout(() => {
    loadGiscus()
  }, 100)
})
</script>

<style scoped>
.giscus-wrapper {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--vp-c-divider);
}

.giscus {
  min-height: 200px;
}
</style>
