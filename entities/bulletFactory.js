import { FactoryRegistry } from "../systems/factories.js";
import { Bullet } from "./bullet.js";
import { bulletData } from "../data/entityData.js";

class BulletFactory extends FactoryRegistry {
  constructor() {
    super();
    this.bulletData = bulletData;
  }
  create(fromX, fromY, toX, toY, speed) {
    const bullet = new Bullet(
      "bullet",
      fromX,
      fromY,
      toX,
      toY,
      this.bulletData.width,
      this.bulletData.height,
      1,
      speed,
      this.bulletData.color,
    );
    this.register(bullet);
  }
  update(dt) {
    super.update(dt);
    for (const bullet of this.elements) {
      console.log(bullet.toX, bullet.speed);
      const diffX = bullet.toX - bullet.position.x;
      const diffY = bullet.toY - bullet.position.y;
      const dist = Math.hypot(diffX, diffY);
      bullet.position.x += (diffX / dist) * bullet.speed * dt;
      bullet.position.y += (diffY / dist) * bullet.speed * dt;

      if (bullet.position.x >= bullet.toX && bullet.position.y >= bullet.toY) {
        this.unregister(bullet);
      }
    }
  }
}

export { BulletFactory };
