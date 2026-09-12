import { gameSettings } from "../data/settings.js";
import { FactoryRegistry } from "../systems/factories.js";
import { Tower } from "./tower.js";

class TowerFactory extends FactoryRegistry {
  constructor(towerTypes) {
    super();
    this.towerTypes = towerTypes;
    this.cellSize = gameSettings.cellSize;
    // Default
    this.previewTower = new Tower(
      towerTypes[0].type,
      -this.cellSize,
      -this.cellSize,
      this.cellSize,
      this.cellSize,
      2,
      "red",
      towerTypes[0].sprite,
    );
  }
  getTower(id) {
    return this.towerTypes.find((t) => t.id === id);
  }
  create(type, x, y, width, height) {
    const tower = this.getTower(type);
    const newTower = new Tower(
      type,
      x,
      y,
      width,
      height,
      4,
      tower.color,
      tower.sprite,
    );
    this.elements.push(newTower);
  }
  showPreview(type, x, y) {
    const tower = this.getTower(type);
    this.previewTower.type = type;
    this.previewTower.position.x = x;
    this.previewTower.position.y = y;
    this.previewTower.color = tower.color;
    this.previewTower.sprite = tower.sprite;
  }
  resetPreview() {
    this.previewTower.position.x = -this.cellSize;
    this.previewTower.position.y = -this.cellSize;
  }
  update(dt, mouse) {
    super.update(dt, mouse);
    this.previewTower.update(dt, mouse);
  }
  draw(ctx) {
    super.draw(ctx);
    this.previewTower.draw(ctx);
  }
}

export { TowerFactory };
