import { isMouseOverlapping } from "../ui/ui.js";

class BuildSystem {
  constructor(tileMap, placementGrid, towerFactory) {
    // TileMap
    this.tileMap = tileMap;
    this.placementGrid = placementGrid;
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
    this.selectedCell.position = this.tileMap.getSelectedCoords(mouse.position);
    this.towerFactory.resetPreview();
    this.placementGrid.isSelecting = false;
    if (this.selectedType !== null) {
      this.placementGrid.isSelecting = true;
      this.tryBuildTower(mouse);
      this.showSelectionPreview();
    }
  }
  tryBuildTower(mouse) {
    if (isMouseOverlapping(this.selectedCell, mouse.lastClickPos)) {
      if (!this.placementGrid.isValid) return;
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
      this.addBuiltCell(x, y);
    }
  }
  addBuiltCell(x, y) {
    const row = Math.floor(y / this.cellSize);
    const col = Math.floor(x / this.cellSize);

    this.tileMap.tileMap[row][col].buildable = 0;
    console.log(this.tileMap.tileMap[row][col]);
  }
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
