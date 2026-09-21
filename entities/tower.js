import { Rect } from "../core/rect.js";
import { Sprite } from "../systems/animation.js";
import { turretData } from "../data/entityData.js";
import { isMouseOverlapping } from "../ui/ui.js";
import { isCircleAndRectColliding } from "../systems/collisions.js";

class Tower extends Rect {
  constructor(
    type,
    x,
    y,
    width,
    height,
    zIndex,
    color,
    enemies,
    sprite = "",
    damage = "",
    fireSpeed = "",
  ) {
    super(type, x, y, width, height, zIndex, color);
    this.sprite = sprite;
    if (this.sprite !== "") {
      this.base = new Sprite(
        this.sprite,
        this.position.x,
        this.position.y,
        this.width,
        this.height,
        turretData.base.startX,
        turretData.base.startY,
        turretData.base.spriteWidth,
        turretData.base.spriteHeight,
      );
      const yOffset = 0;
      const xOffset = this.width / 5;
      this.head = new Sprite(
        this.sprite,
        this.position.x,
        this.position.y,
        this.width,
        this.height,
        turretData.head.startX,
        turretData.head.startY,
        turretData.head.spriteWidth,
        turretData.head.spriteHeight,
        { x: xOffset, y: yOffset },
      );
    }
    this.enemies = enemies;

    // Tower Own Properties
    this.level = 1;
    this.damage = damage;
    this.fireSpeed = fireSpeed;
    this.range = 120;
    this.rangeCircle = {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.height / 2,
      radius: this.range,
    };

    this.isHovering = false;
  }
  calcRotation() {
    for (const enemy of this.enemies) {
      if (isCircleAndRectColliding(this.rangeCircle, enemy)) {
        const dx = enemy.position.x - this.position.x;
        const dy = enemy.position.y - this.position.y;
        this.rotationDeg = -Math.atan2(dx, dy);
      }
    }
  }
  update(dt, mouse) {
    this.calcRotation();
    if (this.sprite !== "") {
      this.base.position = this.position;
      this.head.position.x = this.position.x;
      this.head.position.y = this.position.y;
      this.head.isRotated = true;
      this.head.update(dt, this.rotationDeg);
    }
    this.isHovering = isMouseOverlapping(this, mouse.position);
  }
  drawTowerRange(ctx) {
    ctx.save();
    ctx.strokeStyle = "cyan";
    ctx.beginPath();
    ctx.arc(
      this.rangeCircle.x,
      this.rangeCircle.y,
      this.rangeCircle.radius,
      0,
      Math.PI * 2,
    );
    ctx.stroke();
    ctx.restore();
  }
  draw(ctx) {
    // Hitbox
    // ctx.fillStyle = this.color;
    // ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    // Sprite
    if (this.sprite !== "") {
      this.base.draw(ctx);
      this.head.draw(ctx);
    }
    if (this.isHovering) {
      this.drawTowerRange(ctx);
    }
  }
}

export { Tower };
