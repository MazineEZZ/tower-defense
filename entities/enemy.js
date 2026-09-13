import { Rect } from "../core/rect.js";

class Enemy extends Rect {
  constructor(type, x, y, width, height, zIndex, path, color = "green") {
    super(type, x, y, width, height, zIndex, color);
    this.currPoint = 0;
    this.speed = 1000;
    this.path = path;
  }
  followPath(dt, path) {
    let remainingMove = this.speed * dt;

    while (remainingMove > 0) {
      if (this.currPoint >= this.path.length - 1) {
        return;
      }

      const target = this.path[this.currPoint + 1];
      const diffX = target.x - this.position.x;
      const diffY = target.y - this.position.y;
      const dist = Math.hypot(diffX, diffY);

      if (dist <= remainingMove) {
        // We reach (or pass) this waypoint this frame.
        this.position.x = target.x;
        this.position.y = target.y;
        this.currPoint++;
        remainingMove -= dist;
      } else {
        this.position.x += (diffX / dist) * remainingMove;
        this.position.y += (diffY / dist) * remainingMove;
        remainingMove = 0;
      }
    }
  }
  update(dt) {
    this.followPath(dt, this.path);
  }
}

export { Enemy };
