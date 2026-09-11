import { isMouseOverlapping } from "../ui/ui.js";

class BuildSystem {
  constructor(tileMap, towerFactory) {
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
    this.selectedType = null;
    this.towerFactory = towerFactory;
  }
  update(dt, mouse) {
    if (this.selectedType !== null) {
      this.tryBuildTower(mouse);
    }
    this.selectedCell.position = this.tileMap.getSelectedCoords(mouse.position);
    this.showSelectionPreview();
  }
  tryBuildTower(mouse) {
    if (isMouseOverlapping(this.selectedCell, mouse.lastClickPos)) {
      const x = this.selectedCell.position.x;
      const y = this.selectedCell.position.y;

      this.towerFactory.create(
        this.selectedType,
        x,
        y,
        this.cellSize,
        this.cellSize,
      );
      this.selectedType = null;
    }
  }
  isValidPlacement() {}
  selectTower(type) {
    this.selectedType = type;
  }
  showSelectionPreview() {
    if (this.selectedType === null) return;
    this.towerFactory.showPreview(
      this.selectedType,
      this.selectedCell.position.x,
      this.selectedCell.position.y,
      this.cellSize,
      this.cellSize,
    );
  }
}

export { BuildSystem };
