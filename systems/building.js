import { isMouseOverlapping } from "../ui/ui.js";

class BuildSystem {
  constructor(tileMap, towers) {
    this.tileMap = tileMap;
    this.cellSize = tileMap.cellSize;
    this.selectedCell = { x: -this.cellSize, y: -this.cellSize };

    this.towers = towers;
    this.selectedTower = null;
    this.builtTowers = [];
  }
  update(dt, mouse) {
    this.selectedCell = this.tileMap.getSelectedCoords(mouse.position);
    if (this.selectedTower !== null) {
      this.buildTower(mouse);
    }
  }
  buildTower(mouse) {}
  isValidPlacement() {}
  selectTower(id) {
    this.selectedTower = this.towers.find((t) => t.id === id) || null;
    console.log(this.selectedTower);
  }
  drawSelectedTower(ctx) {
    if (this.selectedTower === null) return;
    ctx.fillStyle = this.selectedTower.color;
    ctx.fillRect(
      this.selectedCell.x,
      this.selectedCell.y,
      this.cellSize,
      this.cellSize,
    );
  }
  draw(ctx) {
    this.drawSelectedTower(ctx);
  }
}

export { BuildSystem };
