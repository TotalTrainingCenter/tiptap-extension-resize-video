# tiptap-extension-resize-video

A [Tiptap 3](https://tiptap.dev/) node extension that puts a `<video>` into the document and lets you **resize it by dragging a corner** and **align it** (left / center / right) from a small toolbar — the same workflow as [tiptap-extension-resize-image](https://github.com/TotalTrainingCenter/tiptap-extension-resize-image), but for video.

Made by [Total Training Center](https://training-center.org) for its editors and released under the MIT license. The interaction model follows [bae-sh/tiptap-extension-resize-image](https://github.com/bae-sh/tiptap-extension-resize-image) (MIT).

## Install

```bash
npm install github:TotalTrainingCenter/tiptap-extension-resize-video
```

Peer dependencies: `@tiptap/core` and `@tiptap/pm` 3.x. The package builds itself on install (`prepare`), producing `dist/index.js` (ESM), `dist/index.cjs.js` and type declarations.

## Usage

```ts
import StarterKit from '@tiptap/starter-kit'
import { Editor } from '@tiptap/core'
import VideoResize from 'tiptap-extension-resize-video'

const editor = new Editor({
  extensions: [StarterKit, VideoResize],
})

// after your upload finishes
editor.chain().focus().setVideo({ src: 'https://example.com/clip.mp4' }).run()

// optional: poster image and initial width
editor.chain().focus().setVideo({ src: '/clip.mp4', poster: '/clip.jpg', width: '480' }).run()

// change the width of the selected video
editor.chain().focus().setVideoWidth('480px').run()
```

Works with React, Vue and plain Tiptap — anything that renders a Tiptap 3 editor.

## Options

| Option | Default | Description |
| --- | --- | --- |
| `HTMLAttributes` | `{}` | Attributes always added to the `<video>` element |
| `controls` | `true` | Show the browser's playback controls |

Videos are rendered with `playsinline` so they don't jump to full screen on iOS.

## Stored document shape

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

If you convert Tiptap JSON to HTML on a server with an allow-list, add the `video` node there too.

## Build

```bash
npm install
npm run build   # dist/index.js, dist/index.cjs.js, dist/index.d.ts
```

## 한국어 요약

Tiptap 3 본문에 `<video>` 를 넣고, 귀퉁이를 끌어 크기를 바꾸고 위쪽 버튼으로 정렬하는 확장입니다. 이미지용 [tiptap-extension-resize-image](https://github.com/TotalTrainingCenter/tiptap-extension-resize-image) 와 같은 사용 흐름을 영상에 맞게 다시 만들었습니다. 종합 훈련 센터 에디터에서 쓰며 MIT 라이선스로 공개합니다.

## License

[MIT](./LICENSE)
