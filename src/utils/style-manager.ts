import { CONSTANTS } from '../constants';
import { utils } from './index';

export class StyleManager {
  static getContainerStyle(width?: string): string {
    return `width: ${width || '100%'}; height: auto; cursor: pointer;`;
  }

  static getWrapperStyle(): string {
    return 'display: flex';
  }

  static getPositionControllerStyle(): string {
    return `
      position: absolute;
      top: 0%;
      left: 50%;
      width: 100px;
      height: ${CONSTANTS.CONTROLLER_HEIGHT};
      z-index: 999;
      background-color: ${CONSTANTS.COLORS.BACKGROUND};
      border-radius: 3px;
      border: 1px solid ${CONSTANTS.COLORS.BORDER};
      cursor: pointer;
      transform: translate(-50%, -50%);
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 6px;
    `
      .replace(/\s+/g, ' ')
      .trim();
  }

  static getDotStyle(index: number): string {
    const dotPosition = utils.getDotPosition();
    const dotSize = utils.getDotSize();
    const positions = [
      `top: ${dotPosition}; left: ${dotPosition}; cursor: nwse-resize;`,
      `top: ${dotPosition}; right: ${dotPosition}; cursor: nesw-resize;`,
      `bottom: ${dotPosition}; left: ${dotPosition}; cursor: nesw-resize;`,
      `bottom: ${dotPosition}; right: ${dotPosition}; cursor: nwse-resize;`,
    ];

    return `
      position: absolute;
      z-index: 999;
      width: ${dotSize}px;
      height: ${dotSize}px;
      background-color: ${CONSTANTS.COLORS.BACKGROUND};
      border: 1.5px solid ${CONSTANTS.COLORS.BORDER};
      border-radius: 50%;
      ${positions[index]}
    `
      .replace(/\s+/g, ' ')
      .trim();
  }
}
