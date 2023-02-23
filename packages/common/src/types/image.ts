import type { default as svgContent } from '*.svg';

export type SVGImages = {
  [key in string]: typeof svgContent;
};
