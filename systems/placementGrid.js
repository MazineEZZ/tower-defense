import { gameSettings } from "../data/settings.js";
import { colorToRGB } from "../utilities/utils.js";

class PlacementGrid {
  constructor(tileMap, events) {
    this.tileMap = tileMap;
    this.width = this.tileMap.width;
    this.height = this.tileMap.height;
    this.cellSize = this.tileMap.cellSize;
    this.selectedCell = { position: { x: -this.cellSize, y: -this.cellSize } };

    // Flags
    this.isValid = false;
    this.isSelecting = false;

    // Constants
    this.NOT_POSSIBLE = "red";
    this.POSSIBLE = "green";
  }
  update(dt, mouse) {
    this.selectedCell.position = this.tileMap.getSelectedCoords(mouse.position);
    if (this.isValidPlacement(this.selectedCell.position)) {
      this.isValid = true;
      this.selectedCellClr = this.POSSIBLE;
    } else {
      this.isValid = false;
      this.selectedCellClr = this.NOT_POSSIBLE;
    }
  }
  drawFade(ctx, x, y, width, height, color) {
    color = colorToRGB(color);
    function addStops(gd) {
      gd.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
      gd.addColorStop(0.8, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
      gd.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0.6)`);
    }

    const directions = [
      [x, height, x + width, height],
      [x + width, height, x, height],
      [x + width, y, x + width, y + height],
      [x + width, y + height, x + width, y],
    ];

    for (const dir of directions) {
      let grad = ctx.createLinearGradient(dir[0], dir[1], dir[2], dir[3]);
      addStops(grad);
      ctx.fillStyle = grad;
      ctx.fillRect(x, y, width, height);
    }
  }
  isValidPlacement(pos) {
    const row = Math.floor(pos.y / this.cellSize);
    const col = Math.floor(pos.x / this.cellSize);

    if (
      row < 0 ||
      col < 0 ||
      row >= this.tileMap.mapHeight ||
      col >= this.tileMap.mapWidth
    ) {
      return false;
    }
    return this.tileMap.tileMap[row][col].buildable === 1;
  }
  drawGrid(ctx) {
    ctx.save();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 3;

    for (let i = 0; i < this.width; i += this.cellSize) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, this.height);
      ctx.stroke();
    }
    for (let i = 0; i < this.height; i += this.cellSize) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(this.width, i);
      ctx.stroke();
    }
    // selectedCell grid lines
    const y = this.selectedCell.position.y;
    const x = this.selectedCell.position.x;
    const directions = [
      [0, y, this.width, y],
      [0, y + this.cellSize, this.width, y + this.cellSize],
      [x, 0, x, this.height],
      [x + this.cellSize, 0, x + this.cellSize, this.height],
    ];

    ctx.strokeStyle = this.selectedCellClr;
    for (const dir of directions) {
      ctx.beginPath();
      ctx.moveTo(dir[0], dir[1]);
      ctx.lineTo(dir[2], dir[3]);
      ctx.stroke();
    }

    ctx.restore();
  }
  drawSelectedCell(ctx) {
    this.drawFade(
      ctx,
      this.selectedCell.position.x,
      this.selectedCell.position.y,
      this.cellSize,
      this.cellSize,
      this.selectedCellClr,
    );
  }
  draw(ctx) {
    if (!this.isSelecting) return;
    this.drawGrid(ctx);
    this.drawSelectedCell(ctx);
  }
}

export { PlacementGrid };
