# tiptap-extension-resize-video

TipTap 본문에 영상을 넣는 확장. 업로드한 영상이 그대로 `<video>` 노드가 되고,
귀퉁이를 끌어 크기를, 위쪽 버튼으로 정렬을 바꿀 수 있다.

같은 저장소의 `tiptap-extension-resize-image` 와 짝을 이룬다.
그쪽은 `<img>` 전용이라 영상에는 쓸 수 없어서, 동일한 사용 흐름을 `<video>` 로 다시 만든 것이다.

`npm init tiptap-extension` (TypeScript 템플릿) 로 스캐폴드한 뒤 내용을 채웠다.

## 설치

```bash
npm install tiptap-extension-resize-video
```

이 저장소에서는 `package.json` 에 `file:` 경로로 물려 쓴다.

```json
"tiptap-extension-resize-video": "file:src/dependencies/tiptap-extension-resize-video"
```

## 사용

```ts
import VideoResize from 'tiptap-extension-resize-video'

const editor = useEditor({
  extensions: [
    StarterKit,
    VideoResize,
  ],
})

// 업로드가 끝난 뒤
editor.chain().focus().setVideo({ src: '/file/image/2026/uploaded.mp4' }).run()

// 폭 직접 지정
editor.chain().focus().setVideoWidth('480px').run()
```

## 옵션

| 옵션 | 기본값 | 설명 |
| --- | --- | --- |
| `HTMLAttributes` | `{}` | `<video>` 에 항상 붙일 속성 |
| `controls` | `true` | 재생 컨트롤 표시 여부 |

## 저장되는 형태

```json
{
  "type": "video",
  "attrs": {
    "src": "...",
    "width": "480",
    "containerStyle": "width: 480px; height: auto; cursor: pointer;",
    "wrapperStyle": "display: flex"
  }
}
```

공개 사이트의 TipTap → HTML 변환기는 허용 목록 방식이므로,
본문을 공개로 내보내려면 그쪽에도 `video` 노드 처리를 추가해야 한다.

## 빌드

```bash
npm install
npm run build   # dist/index.js, dist/index.cjs.js, dist/index.d.ts
```
