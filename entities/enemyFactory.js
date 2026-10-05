import { zombieData } from "../data/entityData.js";
import { FactoryRegistry } from "../systems/factories.js";
import { Enemy } from "./enemy.js";
import { enemyTypes } from "../data/data.js";

class EnemyFactory extends FactoryRegistry {
  constructor(path, events) {
    super();
    this.path = path;
    this.events = events;
    this.enemyTypes = enemyTypes;
  }
  create(type) {
    const spawnCell = this.path[0];
    const width = zombieData.width;
    const height = zombieData.height;
    const offset = { x: width / 2, y: height + height / 2 };
    const enemy = new Enemy(
      type,
      spawnCell.x,
      spawnCell.y,
      width,
      height,
      3,
      this.path,
      offset,
      this.events,
      this.enemyTypes[type],
    );
    this.register(enemy);
  }
  update(dt) {
    super.update(dt);
  }
}

export { EnemyFactory };
