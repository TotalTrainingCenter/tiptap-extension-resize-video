export class AttributeParser {
  /**
   * 노드 속성을 실제 <video> 엘리먼트에 옮긴다.
   * 스타일 계열 속성은 컨테이너가 들고 있으므로 여기서는 건너뛴다.
   */
  static parseVideoAttributes(
    nodeAttrs: Record<string, any>,
    videoElement: HTMLVideoElement
  ): void {
    Object.entries(nodeAttrs).forEach(([key, value]) => {
      if (value === undefined || value === null || key === 'wrapperStyle') return;

      if (key === 'containerStyle') {
        const width = (value as string).match(/width:\s*([0-9.]+)px/);
        if (width) {
          videoElement.setAttribute('width', width[1]);
        }
        return;
      }
      videoElement.setAttribute(key, value as string);
    });
  }

  static extractWidthFromStyle(style: string): string | null {
    const width = style.match(/width:\s*([0-9.]+)px/);
    return width ? width[1] : null;
  }
}
