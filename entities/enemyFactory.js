import { zombieData } from "../data/entityData.js";
import { FactoryRegistry } from "../systems/factories.js";
import { Enemy } from "./enemy.js";

class EnemyFactory extends FactoryRegistry {
  constructor() {
    super();
  }
  create(type, x, y, path) {
    const width = zombieData.width;
    const height = zombieData.height;
    const enemy = new Enemy(type, x, y, width, height, 3, path);
    console.log(enemy);
    this.register(enemy);
  }
}

export { EnemyFactory };
