import { FactoryRegistry } from "../systems/factories.js";
import { Bullet } from "./bullet.js";
import { bulletData } from "../data/entityData.js";

class BulletFactory extends FactoryRegistry {
  constructor(events) {
    super();
    this.events = events;
    this.bulletData = bulletData;
  }
  create(fromX, fromY, target, speed, damage) {
    const bullet = new Bullet(
      "bullet",
      fromX,
      fromY,
      target,
      this.bulletData.width,
      this.bulletData.height,
      1,
      speed,
      damage,
      this.bulletData.color,
    );
    this.register(bullet);
  }
  update(dt) {
    super.update(dt);
    for (const bullet of this.elements) {
      const targetPos = {
        x: bullet.target.position.x + bullet.target.width / 2,
        y: bullet.target.position.y + bullet.target.height / 2,
      };
      const diffX = targetPos.x - bullet.position.x;
      const diffY = targetPos.y - bullet.position.y;
      const dist = Math.hypot(diffX, diffY);

      // Because the bullet homing effect is guarding for the bullets to hit the target
      // Making the enemy take damage here is more efficient and less expensive
      const step = bullet.speed * dt;
      if (dist <= step || dist === 0) {
        bullet.position.x = targetPos.x;
        bullet.position.y = targetPos.y;
        this.unregister(bullet);
        this.events.emit("enemyDamaged", {
          target: bullet.target,
          damage: bullet.damage,
        });
        continue;
      }

      bullet.position.x += (diffX / dist) * step;
      bullet.position.y += (diffY / dist) * step;
    }
  }
}

export { BulletFactory };
