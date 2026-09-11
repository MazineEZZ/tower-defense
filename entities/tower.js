import { Rect } from "../core/rect.js";

class Tower extends Rect {
  constructor(type, x, y, width, height, zIndex, color) {
    super(type, x, y, width, height, zIndex, color);
  }
}

export { Tower };
