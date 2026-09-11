import { Rect } from "../core/rect.js";
import { Sprite } from "../systems/animation.js";
import { turretData } from "../data/entityData.js";

class Tower extends Rect {
  constructor(
    type,
    x,
    y,
    width,
    height,
    zIndex,
    color,
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
      this.head = new Sprite(
        this.sprite,
        this.position.x,
        this.position.y + this.height / 5,
        this.width,
        this.height,
        turretData.head.startX,
        turretData.head.startY,
        turretData.head.spriteWidth,
        turretData.head.spriteHeight,
      );
    }
    // Tower Own Properties
    this.level = 1;
    this.damage = damage;
    this.fireSpeed = fireSpeed;
  }
  update(dt) {
    this.base.position = this.position;
    this.head.position.x = this.position.x;
    this.head.position.y = this.position.y + this.height / 5;
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
  }
}

export { Tower };
