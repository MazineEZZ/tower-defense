import { clamp } from "../utilities/utils.js";
import { gameSettings } from "../data/settings.js";

class TileMap {
	constructor(cellSize) {
		this.cellSize = cellSize
		this.width = gameSettings.width;
		this.height = gameSettings.height;
	}
	drawGrid(ctx) {
		ctx.fillStyle = "red";
		for (let x = 0; x < this.width; x += this.cellSize) {
			for (let y = 0; y < this.height; y += this.cellSize) {
				ctx.fillRect(x, y, this.cellSize, this.cellSize);
			}
		}
	}
}

export { TileMap };