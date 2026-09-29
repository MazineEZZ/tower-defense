import { Rect } from "../core/rect.js";

class Bullet extends Rect {
  constructor(
    type,
    x,
    y,
    target,
    width,
    height,
    zIndex,
    speed,
    damage,
    color = "yellow",
  ) {
    super(type, x, y, width, height, zIndex, color);
    this.target = target;
    this.speed = speed;
    this.damage = damage;
  }
}

export { Bullet };
