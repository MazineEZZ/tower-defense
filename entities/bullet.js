import { Rect } from "../core/rect.js";

class Bullet extends Rect {
  constructor(
    type,
    x,
    y,
    toX,
    toY,
    width,
    height,
    zIndex,
    speed,
    color = "yellow",
  ) {
    super(type, x, y, width, height, zIndex, color);
    this.toX = toX;
    this.toY = toY;
    this.speed = speed;
  }
}

export { Bullet };
