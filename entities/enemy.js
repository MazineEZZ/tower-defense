import { Rect } from "../core/rect.js";

class Enemy extends Rect {
  constructor(
    type,
    x,
    y,
    width,
    height,
    zIndex,
    path,
    offset,
    events,
    data = { color: "green" },
  ) {
    super(type, x, y, width, height, zIndex, data.color);
    this.currPoint = 0;
    this.speed = data.speed;
    this.health = data.health;
    this.path = path;
    this.offset = offset;
    this.position.x = path[0].x + this.offset.x;
    this.position.y = path[0].y + this.offset.y;
    this.events = events;
    this.isKilled = false;
  }
  takeDamage(dmg) {
    if (this.isKilled) return;
    this.health -= dmg;
    if (this.health <= 0) {
      this.events.emit("enemyKilled", this);
      this.isKilled = true;
    }
  }
  followPath(dt, path) {
    let remainingMove = this.speed * dt;

    while (remainingMove > 0) {
      if (this.currPoint >= this.path.length - 1) {
        this.isKilled = true;
        this.events.emit("enemyExited", this);
        return;
      }
      const wp = this.path[this.currPoint + 1];
      const targetX = wp.x + this.offset.x;
      const targetY = wp.y + this.offset.y;

      const diffX = targetX - this.position.x;
      const diffY = targetY - this.position.y;
      const dist = Math.hypot(diffX, diffY); // It checks whether the move budget is available

      if (dist <= remainingMove) {
        // We reach (or pass) this waypoint this frame.
        this.position.x = targetX;
        this.position.y = targetY;
        this.currPoint++;
        remainingMove -= dist;
      } else {
        // It moves slightly towards the point
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
