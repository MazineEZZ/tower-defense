import { isMouseOverlapping } from "../ui/ui.js";

class BuildSystem {
  constructor(tileMap, towerFactory, towerTypes) {
    // TileMap
    this.tileMap = tileMap;
    this.cellSize = tileMap.cellSize;

    // SelectedCell
    this.selectedCell = {
      position: { x: -this.cellSize, y: -this.cellSize },
      width: this.cellSize,
      height: this.cellSize,
    };

    // Towers
    this.towerTypes = towerTypes;
    this.selectedTower = null;
    this.towerFactory = towerFactory;
  }
  update(dt, mouse) {
    if (this.selectedTower !== null) {
      this.tryBuild(mouse);
    }
    this.selectedCell.position = this.tileMap.getSelectedCoords(mouse.position);
  }
  tryBuild(mouse) {
    if (isMouseOverlapping(this.selectedCell, mouse.lastClickPos)) {
      const x = this.selectedCell.position.x;
      const y = this.selectedCell.position.y;

      this.towerFactory.create(
        this.selectedTower.type,
        x,
        y,
        this.cellSize,
        this.cellSize,
        this.selectedTower.color,
      );
      this.selectedTower = null;
    }
  }
  isValidPlacement() {}
  selectTower(id) {
    this.selectedTower = this.towerTypes.find((t) => t.id === id) || null;
  }
  drawSelectedTower(ctx) {
    if (this.selectedTower === null) return;
    this.towerFactory.showPreview(
      this.selectedTower.type,
      this.selectedCell.position.x,
      this.selectedCell.position.y,
      this.cellSize,
      this.cellSize,
      this.selectedTower.color,
    );
  }
  draw(ctx) {
    this.drawSelectedTower(ctx);
  }
}

export { BuildSystem };
