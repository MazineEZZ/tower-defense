import { Rect } from "../core/rect.js";
import { Sprite } from "../systems/animation.js";
import { turretData } from "../data/entityData.js";
import { isMouseOverlapping } from "../ui/ui.js";
import { isCircleAndRectColliding } from "../systems/collisions.js";
import { colorToRGB } from "../utilities/utils.js";

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
    events,
    bulletFact,
    sprite = "",
    damage = "",
    fireSpeed = 1,
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
    this.events = events;
    // Tower Own Properties
    this.level = 0;
    this.damage = damage;
    this.fireSpeed = fireSpeed;
    this.bulletSpeed = 900;
    this.range = 120;
    this.rangeCircle = {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.height / 2,
      radius: this.range,
    };
    this.bulletFact = bulletFact;
    this.timer = 0;
    this.targets = [];
    this.isHovering = false;
    this.isTargeting = false;
  }
  findTarget() {
    this.targets.length = 0;
    for (const enemy of this.enemies) {
      if (isCircleAndRectColliding(this.rangeCircle, enemy)) {
        this.targets.push(enemy);
      }
    }
    // Calculate rotation for the first found target
    if (this.targets.length > 0) {
      this.calcRotation(this.targets[0]);
      this.isTargeting = true;
      return;
    }
    this.isTargeting = false;
  }
  calcRotation(target) {
    const dx = target.position.x + target.width / 2 - this.rangeCircle.x;
    const dy = target.position.y + target.height / 2 - this.rangeCircle.y;
    this.rotationDeg = -Math.atan2(dx, dy);
  }
  update(dt, mouse) {
    this.findTarget();
    if (this.sprite !== "") {
      this.base.position = this.position;
      this.head.position.x = this.position.x;
      this.head.position.y = this.position.y;
      this.head.isRotated = true;
      this.head.update(dt, this.rotationDeg);
    }
    this.isHovering = isMouseOverlapping(this, mouse.position);

    // Draw the hovered tower above the others.
    // Before this hovered tower's circle can be seen below tower which created bad visuals
    if (this.isHovering) {
      this.zIndex = 6;
      this.events.emit("sortTowers");
    } else {
      this.zIndex = 4;
    }

    this.timer += dt;
    if (this.timer > this.fireSpeed) {
      if (this.isTargeting) {
        this.bulletFact.create(
          this.position.x + this.width / 2,
          this.position.y + this.height / 2,
          this.targets[0].position.x,
          this.targets[0].position.y,
          this.bulletSpeed,
        );
      }
      this.timer -= this.fireSpeed;
    }
  }
  drawTowerRange(ctx) {
    const color = colorToRGB("rgb(44, 210, 210)");
    ctx.save();
    ctx.strokeStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
    ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.2)`;
    ctx.beginPath();
    ctx.arc(
      this.rangeCircle.x,
      this.rangeCircle.y,
      this.rangeCircle.radius,
      0,
      Math.PI * 2,
    );
    ctx.stroke();
    ctx.fill();
    ctx.restore();
  }
  draw(ctx) {
    // Hitbox
    // ctx.fillStyle = this.color;
    // ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    // Sprite
    if (this.isHovering) {
      this.drawTowerRange(ctx);
    }
    if (this.sprite !== "") {
      this.base.draw(ctx);
      this.head.draw(ctx);
    }
  }
}

export { Tower };
