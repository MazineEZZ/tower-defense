import { gameSettings } from "../data/settings.js";
import { FactoryRegistry } from "../systems/factories.js";
import { Tower } from "./tower.js";

class TowerFactory extends FactoryRegistry {
  constructor(towerTypes, enemies, events, bulletFact) {
    super();
    this.towerTypes = towerTypes;
    this.enemies = enemies;
    this.events = events;
    this.cellSize = gameSettings.cellSize;
    this.bulletFact = bulletFact;
    // Default
    this.previewTower = new Tower(
      towerTypes[0].type,
      -this.cellSize * 2,
      -this.cellSize * 2,
      this.cellSize,
      this.cellSize,
      4,
      "red",
      this.enemies,
      this.events,
      this.bulletFact,
      towerTypes[0].sprite,
    );
    this.register(this.previewTower);
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
      this.enemies,
      this.events,
      this.bulletFact,
      tower.sprite,
    );
    this.register(newTower);
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
    this.previewTower.position.x = -this.cellSize * 2;
    this.previewTower.position.y = -this.cellSize * 2;
  }
  sortByLayers() {
    this.elements.sort((a, b) => a.zIndex - b.zIndex);
  }
  update(dt, mouse) {
    super.update(dt, mouse);
  }
  draw(ctx) {
    super.draw(ctx);
  }
}

export { TowerFactory };
