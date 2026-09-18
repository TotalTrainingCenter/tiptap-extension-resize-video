import { CONSTANTS } from '../constants';
import { VideoElements } from '../types';
import { utils } from '../utils';
import { AttributeParser } from '../utils/attribute-parser';
import { PositionController } from './position-controller';
import { ResizeController } from './resize-controller';

interface NodeViewContext {
  node: any;
  editor: any;
  view: any;
  getPos: (() => number | undefined) | undefined;
}

export class VideoNodeView {
  private context: NodeViewContext;
  private elements: VideoElements;
  private controls: boolean;

  constructor(context: NodeViewContext, controls: boolean) {
    this.context = context;
    this.controls = controls;
    this.elements = {
      wrapper: document.createElement('div'),
      container: document.createElement('div'),
      video: document.createElement('video'),
    };
  }

  private clearContainerBorder = (): void => {
    utils.clearContainerBorder(this.elements.container);
  };

  private removeResizeElements = (): void => {
    utils.removeResizeElements(this.elements.container);
  };

  /** 지금 DOM 에 반영된 크기·정렬을 노드 속성으로 되돌려 저장한다. */
  private dispatchNodeView = (): void => {
    const { view, getPos } = this.context;
    if (typeof getPos !== 'function') return;

    const pos = getPos();
    if (pos === undefined) return;

    this.clearContainerBorder();

    const newAttrs = {
      ...this.context.node.attrs,
      width:
        AttributeParser.extractWidthFromStyle(this.elements.container.style.cssText) ??
        this.context.node.attrs.width,
      containerStyle: `${this.elements.container.style.cssText}`,
      wrapperStyle: `${this.elements.wrapper.style.cssText}`,
    };

    view.dispatch(view.state.tr.setNodeMarkup(pos, null, newAttrs));
  };

  private setupDOMStructure(): void {
    const { wrapperStyle, containerStyle } = this.context.node.attrs;

    this.elements.wrapper.setAttribute('style', wrapperStyle);
    this.elements.wrapper.appendChild(this.elements.container);

    this.elements.container.setAttribute('style', containerStyle);
    this.elements.container.appendChild(this.elements.video);
  }

  private setupVideoAttributes(): void {
    const { video } = this.elements;

    if (this.controls) video.setAttribute('controls', 'controls');
    video.setAttribute('preload', 'metadata');
    video.setAttribute('playsinline', 'true');
    video.setAttribute('controlslist', 'nodownload');
    video.style.width = '100%';

    AttributeParser.parseVideoAttributes(this.context.node.attrs, video);
  }

  private createResizeHandles(): void {
    const resizeController = new ResizeController(this.elements, this.dispatchNodeView);

    Array.from({ length: 4 }, (_, index) => {
      this.elements.container.appendChild(resizeController.createResizeHandle(index));
    });
  }

  private selectVideo = (): void => {
    if (utils.isMobile()) {
      (document.querySelector('.ProseMirror-focused') as HTMLElement)?.blur();
    }

    this.removeResizeElements();
    new PositionController(this.elements, this.dispatchNodeView).createPositionControls();

    this.elements.container.setAttribute(
      'style',
      `position: relative; border: 1px dashed ${CONSTANTS.COLORS.BORDER}; ${this.context.node.attrs.containerStyle}`
    );

    this.createResizeHandles();
  };

  private setupContainerClick(): void {
    // 재생 컨트롤을 누르는 것과 겹치지 않도록, 선택은 테두리 영역 클릭으로 잡는다.
    this.elements.container.addEventListener('click', this.selectVideo);
  }

  private setupOutsideClick(): void {
    document.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickInside =
        this.elements.container.contains(target) ||
        target.style.cssText ===
          `width: ${CONSTANTS.ICON_SIZE}; height: ${CONSTANTS.ICON_SIZE}; cursor: pointer;`;

      if (!isClickInside) {
        this.clearContainerBorder();
        this.removeResizeElements();
      }
    });
  }

  initialize(): { dom: HTMLElement } {
    this.setupDOMStructure();
    this.setupVideoAttributes();

    const { editable } = this.context.editor.options;
    if (editable) {
      this.setupContainerClick();
      this.setupOutsideClick();
    }

    return {
      dom: this.elements.wrapper,
    };
  }
}
