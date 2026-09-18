import { CONSTANTS } from '../constants/index';

export const utils = {
  isMobile(): boolean {
    return document.documentElement.clientWidth < CONSTANTS.MOBILE_BREAKPOINT;
  },

  getDotPosition(): string {
    return utils.isMobile() ? CONSTANTS.DOT_POSITION.MOBILE : CONSTANTS.DOT_POSITION.DESKTOP;
  },

  getDotSize(): number {
    return utils.isMobile() ? CONSTANTS.DOT_SIZE.MOBILE : CONSTANTS.DOT_SIZE.DESKTOP;
  },

  clearContainerBorder(container: HTMLElement): void {
    const containerStyle = container.getAttribute('style');
    const newStyle = containerStyle
      ?.replace(`border: 1px dashed ${CONSTANTS.COLORS.BORDER};`, '')
      .replace('border: 1px dashed rgb(108, 108, 108);', '');
    container.setAttribute('style', newStyle as string);
  },

  /**
   * 컨테이너에는 <video> 하나만 남겨 두고, 선택했을 때 붙였던
   * 정렬 컨트롤러와 리사이즈 점들을 걷어낸다.
   */
  removeResizeElements(container: HTMLElement): void {
    while (container.childElementCount > 1) {
      container.removeChild(container.lastChild as Node);
    }
  },
};
