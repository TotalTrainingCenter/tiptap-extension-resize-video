import { Node, mergeAttributes, nodeInputRule } from '@tiptap/core';
import { VideoNodeView } from './controllers/video-node-view';
import { StyleManager } from './utils/style-manager';

/**
 * 본문에 영상을 넣기 위한 노드.
 *
 * 이미지는 tiptap-extension-resize-image 가 담당하지만 그 확장은 <img> 전용이라
 * 영상에는 쓸 수 없다. 그래서 같은 사용 흐름(업로드 → 노드 자동 삽입 → 즉시 렌더 →
 * 귀퉁이를 끌어 크기 조절)을 <video> 로 다시 만든 것이다.
 *
 * 저장되는 JSON 은 { type: 'video', attrs: { src, width, containerStyle, ... } } 형태다.
 * 공개 사이트의 TipTap → HTML 변환기는 허용 목록 방식이므로,
 * 이 노드 타입을 거기에도 추가해야 본문에 실제로 나간다.
 */

export interface VideoResizeOptions {
  /** <video> 에 항상 붙일 속성 (클래스 등) */
  HTMLAttributes: Record<string, any>;

  /** 재생 컨트롤 표시 여부 */
  controls: boolean;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    video: {
      /** 커서 위치에 영상 노드를 넣는다. */
      setVideo: (options: { src: string; poster?: string; width?: string }) => ReturnType;

      /** 선택한 영상의 폭을 바꾼다. (예: '480px', '100%') */
      setVideoWidth: (width: string) => ReturnType;
    };
  }
}

// ![](foo.mp4) 형태로 써도 노드로 잡아 준다.
const VIDEO_INPUT_REGEX = /!\[(.+|:?)]\((\S+\.(?:mp4|webm|ogg|mov))\)/;

export const VideoResize = Node.create<VideoResizeOptions>({
  name: 'video',
  group: 'block',
  atom: true,
  draggable: true,
  selectable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
      controls: true,
    };
  },

  addAttributes() {
    return {
      src: {
        default: null,
      },
      poster: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: '100%',
        parseHTML: (element) => element.getAttribute('width') || '100%',
        renderHTML: (attributes) => (attributes.width ? { width: attributes.width } : {}),
      },
      containerStyle: {
        default: StyleManager.getContainerStyle(),
        parseHTML: (element) => {
          const containerStyle =
            element.getAttribute('containerstyle') || element.getAttribute('style');
          if (containerStyle) {
            return containerStyle;
          }

          const width = element.getAttribute('width');
          return width ? StyleManager.getContainerStyle(`${width}px`) : `${element.style.cssText}`;
        },
      },
      wrapperStyle: {
        default: StyleManager.getWrapperStyle(),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'video[src]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'video',
      mergeAttributes(
        {
          controls: this.options.controls ? 'controls' : null,
          preload: 'metadata',
          playsinline: 'true',
          controlslist: 'nodownload',
        },
        this.options.HTMLAttributes,
        HTMLAttributes
      ),
    ];
  },

  addNodeView() {
    return ({ node, editor, getPos }) => {
      const nodeView = new VideoNodeView(
        {
          node,
          editor,
          view: editor.view,
          getPos: typeof getPos === 'function' ? getPos : undefined,
        },
        this.options.controls
      );

      return nodeView.initialize();
    };
  },

  addCommands() {
    return {
      setVideo:
        (options) =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: {
              ...options,
              containerStyle: StyleManager.getContainerStyle(options.width),
            },
          }),

      setVideoWidth:
        (width) =>
        ({ commands }) =>
          commands.updateAttributes(this.name, {
            width,
            containerStyle: StyleManager.getContainerStyle(width),
          }),
    };
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: VIDEO_INPUT_REGEX,
        type: this.type,
        getAttributes: (match) => ({ title: match[1], src: match[2] }),
      }),
    ];
  },
});
