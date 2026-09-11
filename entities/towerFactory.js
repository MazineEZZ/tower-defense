import { FactoryRegistry } from "../systems/factories.js";
import { Tower } from "./tower.js";

class TowerFactory extends FactoryRegistry {
  constructor(towerTypes) {
    super();
    this.towerTypes = towerTypes;
    this.previewTower = new Tower("", -10, -10, 1, 1, 2, "red");
  }
  getTower(id) {
    return this.towerTypes.find((t) => t.id === id);
  }
  create(type, x, y, width, height) {
    const tower = this.getTower(type);
    const newTower = new Tower(type, x, y, width, height, 4, tower.color);
    this.elements.push(newTower);
  }
  showPreview(type, x, y, width, height) {
    const tower = this.getTower(type);
    this.previewTower.type = type;
    this.previewTower.position.x = x;
    this.previewTower.position.y = y;
    this.previewTower.width = width;
    this.previewTower.height = height;
    this.previewTower.color = tower.color;
  }
  draw(ctx) {
    super.draw(ctx);
    this.previewTower.draw(ctx);
  }
}

export { TowerFactory };
