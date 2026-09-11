import { gameSettings } from "../data/settings.js";
import { colorToRGB } from "../utilities/utils.js";

class PlacementGrid {
  constructor(tileMap) {
    this.tileMap = tileMap;
    this.width = this.tileMap.width;
    this.height = this.tileMap.height;
    this.cellSize = this.tileMap.cellSize;
    this.selectedCell = { x: -this.cellSize, y: -this.cellSize };
  }
  update(dt, mouse) {
    this.selectedCell = this.tileMap.getSelectedCoords(mouse);
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
    ctx.restore();
  }
  drawSelectedCell(ctx) {
    this.drawFade(
      ctx,
      this.selectedCell.x,
      this.selectedCell.y,
      this.cellSize,
      this.cellSize,
      "#fff",
    );
  }
  drawSelectedTower(ctx) {}
  draw(ctx) {
    this.drawGrid(ctx);
    this.drawSelectedCell(ctx);
  }
}

export { PlacementGrid };
