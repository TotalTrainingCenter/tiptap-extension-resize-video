import { CONSTANTS } from '../constants';
import { VideoElements } from '../types';
import { StyleManager } from '../utils/style-manager';

/** 영상 위쪽에 뜨는 좌/가운데/우 정렬 버튼. */
export class PositionController {
  private elements: VideoElements;
  private dispatchNodeView: () => void;

  constructor(elements: VideoElements, dispatchNodeView: () => void) {
    this.elements = elements;
    this.dispatchNodeView = dispatchNodeView;
  }

  private createControllerIcon(src: string): HTMLElement {
    const controller = document.createElement('img');
    controller.setAttribute('src', src);
    controller.setAttribute(
      'style',
      `width: ${CONSTANTS.ICON_SIZE}; height: ${CONSTANTS.ICON_SIZE}; cursor: pointer;`
    );

    controller.addEventListener('mouseover', (e) => {
      (e.target as HTMLElement).style.opacity = '0.6';
    });

    controller.addEventListener('mouseout', (e) => {
      (e.target as HTMLElement).style.opacity = '1';
    });

    return controller;
  }

  private align(margin: string): void {
    this.elements.container.setAttribute(
      'style',
      `${this.elements.container.style.cssText} margin: ${margin};`
    );
    this.dispatchNodeView();
  }

  createPositionControls(): PositionController {
    const controller = document.createElement('div');
    controller.setAttribute('style', StyleManager.getPositionControllerStyle());

    const left = this.createControllerIcon(CONSTANTS.ICONS.LEFT);
    left.addEventListener('click', () => this.align('0 auto 0 0'));
    controller.appendChild(left);

    const center = this.createControllerIcon(CONSTANTS.ICONS.CENTER);
    center.addEventListener('click', () => this.align('0 auto'));
    controller.appendChild(center);

    const right = this.createControllerIcon(CONSTANTS.ICONS.RIGHT);
    right.addEventListener('click', () => this.align('0 0 0 auto'));
    controller.appendChild(right);

    this.elements.container.appendChild(controller);
    return this;
  }
}
