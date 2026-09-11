import { FactoryRegistry } from "../systems/factories.js";
import { Tower } from "./tower.js";

class TowerFactory extends FactoryRegistry {
  constructor() {
    super();
    this.previewTower = new Tower("", -10, -10, 1, 1, 2, "red");
  }
  create(type, x, y, width, height, color) {
    const tower = new Tower(type, x, y, width, height, 4, color);
    this.elements.push(tower);
  }
  showPreview(type, x, y, width, height, color) {
    this.previewTower.type = type;
    this.previewTower.position.x = x;
    this.previewTower.position.y = y;
    this.previewTower.width = width;
    this.previewTower.height = height;
    this.previewTower.color = color;
  }
  draw(ctx) {
    super.draw(ctx);
    this.previewTower.draw(ctx);
  }
}

export { TowerFactory };
