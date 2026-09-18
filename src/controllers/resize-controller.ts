import { ResizeState, VideoElements } from '../types';
import { StyleManager } from '../utils/style-manager';

/**
 * 네 귀퉁이의 점을 끌어 영상 폭을 바꾼다.
 * 높이는 건드리지 않는다. 폭만 정하면 영상 비율은 브라우저가 유지한다.
 */
export class ResizeController {
  private elements: VideoElements;
  private dispatchNodeView: () => void;
  private state: ResizeState = {
    isResizing: false,
    startX: 0,
    startWidth: 0,
  };

  constructor(elements: VideoElements, dispatchNodeView: () => void) {
    this.elements = elements;
    this.dispatchNodeView = dispatchNodeView;
  }

  private applyWidth(clientX: number, index: number): void {
    // 왼쪽 점(0, 2)은 끄는 방향이 반대다.
    const deltaX = index % 2 === 0 ? -(clientX - this.state.startX) : clientX - this.state.startX;
    const newWidth = Math.max(this.state.startWidth + deltaX, 40);

    this.elements.container.style.width = `${newWidth}px`;
    this.elements.video.style.width = `${newWidth}px`;
  }

  private handleMouseMove = (e: MouseEvent, index: number): void => {
    if (!this.state.isResizing) return;
    this.applyWidth(e.clientX, index);
  };

  private handleTouchMove = (e: TouchEvent, index: number): void => {
    if (!this.state.isResizing) return;
    this.applyWidth(e.touches[0].clientX, index);
  };

  private handleEnd = (): void => {
    if (this.state.isResizing) {
      this.state.isResizing = false;
    }
    this.dispatchNodeView();
  };

  createResizeHandle(index: number): HTMLElement {
    const dot = document.createElement('div');
    dot.setAttribute('style', StyleManager.getDotStyle(index));

    dot.addEventListener('mousedown', (e) => {
      e.preventDefault();
      this.state.isResizing = true;
      this.state.startX = e.clientX;
      this.state.startWidth = this.elements.container.offsetWidth;

      const onMouseMove = (event: MouseEvent) => this.handleMouseMove(event, index);
      const onMouseUp = () => {
        this.handleEnd();
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });

    dot.addEventListener(
      'touchstart',
      (e) => {
        e.cancelable && e.preventDefault();
        this.state.isResizing = true;
        this.state.startX = e.touches[0].clientX;
        this.state.startWidth = this.elements.container.offsetWidth;

        const onTouchMove = (event: TouchEvent) => this.handleTouchMove(event, index);
        const onTouchEnd = () => {
          this.handleEnd();
          document.removeEventListener('touchmove', onTouchMove);
          document.removeEventListener('touchend', onTouchEnd);
        };

        document.addEventListener('touchmove', onTouchMove);
        document.addEventListener('touchend', onTouchEnd);
      },
      { passive: false }
    );

    return dot;
  }
}
