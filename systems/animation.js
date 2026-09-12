class Sprite {
  constructor(
    image,
    x,
    y,
    width,
    height,
    startX,
    startY,
    spriteWidth,
    spriteHeight,
    offset = { x: 0, y: 0 },
  ) {
    this.position = { x, y };
    this.offset = offset;
    this.image = image;
    this.width = width;
    this.height = height;
    this.startX = startX;
    this.startY = startY;
    this.spriteWidth = spriteWidth;
    this.spriteHeight = spriteHeight;
    this.flipH = false;
    this.flipV = false;
    this.isRotated = false;
  }
  flipX(ctx) {
    ctx.scale(-1, 1);
    this.drawX = -this.drawX - this.width;
  }
  flipY(ctx) {
    ctx.scale(1, -1);
    this.drawY = -this.position.y - this.height;
  }
  rotate(ctx, hitWidth, hitHeight) {
    ctx.translate(
      this.position.x + hitWidth / 2,
      this.position.y + hitHeight / 2,
    );
    ctx.rotate(this.degree);
    this.drawY = -this.width + hitWidth / 2 + this.offset.x;
    this.drawX = -this.height + hitHeight / 2;
  }
  update(dt, deg) {
    this.degree = deg;
  }
  draw(ctx) {
    this.drawX = this.position.x;
    this.drawY = this.position.y + this.offset.x;

    ctx.save();
    if (this.flipH) this.flipX(ctx);
    if (this.flipV) this.flipY(ctx);
    if (this.isRotated) this.rotate(ctx, this.width, this.height);

    ctx.drawImage(
      this.image,
      this.startX,
      this.startY,
      this.spriteWidth,
      this.spriteHeight,
      this.drawX,
      this.drawY,
      this.width,
      this.height,
    );
    ctx.restore();
  }
}

class AnimatedSprite extends Sprite {
  constructor(src, x, y, width, height, spriteWidth, spriteHeight, fps = 24) {
    super(src, x, y, width, height);
    this.spriteWidth = spriteWidth;
    this.spriteHeight = spriteHeight;
    this.animations = [];
    this.selected = 0;
    this.colCtr = 0;
    this.fps = fps;
    this.frameDuration = 1 / fps;
    this.timer = 0;
    this.isDone = false;
  }
  add(name, row, col) {
    this.animations.push({ name, row, col });
  }
  remove(name) {
    const i = this.animations.findIndex((anim) => anim.name === name);
    if (i !== -1) this.animations.splice(i, 1);
  }
  select(name) {
    const i = this.animations.findIndex((anim) => anim.name === name);
    if (i !== -1 && this.selected !== i) {
      this.selected = i;
      this.colCtr = 0;
    }
  }
  update(dt) {
    this.timer += dt;

    // Using while instead of if, incase dt gets really large
    while (this.timer >= this.frameDuration) {
      this.colCtr++;
      this.timer -= this.frameDuration; // Subtracting to account for the leftover time
      if (this.colCtr >= this.animations[this.selected].col) {
        this.colCtr = 0;
        this.isDone = true;
      } else {
        this.colCtr = this.colCtr;
      }
    }
  }
  anchorToHitbox(hitWidth, hitHeight) {
    this.drawX = this.position.x - this.width / 2 + hitWidth / 2;
    this.drawY = this.position.y - this.height + hitHeight;
  }
  draw(ctx, hitboxWidth, hitboxHeight) {
    if (this.animations.length === 0) throw new Error("Add an animation!");

    this.anchorToHitbox(hitboxWidth, hitboxHeight);

    ctx.save();
    ctx.imageSmoothingEnabled = false;

    if (this.flipH) this.flipX(ctx);
    if (this.flipV) this.flipY(ctx);
    if (this.isRotated) this.rotate(ctx, hitboxWidth, hitboxHeight);

    const selected = this.animations[this.selected];

    ctx.drawImage(
      this.image,
      this.spriteWidth * this.colCtr,
      this.spriteHeight * selected.row,
      this.spriteWidth,
      this.spriteHeight,
      this.drawX,
      this.drawY,
      this.width,
      this.height,
    );
    ctx.restore();
  }
}

export { Sprite, AnimatedSprite };
