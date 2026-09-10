import { clamp, construct2DArray } from "../utilities/utils.js";
import { gameSettings } from "../data/settings.js";

class TileMap {
  constructor(cellSize, tileMapJSON, tileSetIMG) {
    this.cellSize = cellSize;
    this.width = gameSettings.width;
    this.height = gameSettings.height;

    // Tiled Specific Manipulation
    const tilesetData = tileMapJSON.tilesets[0];
    this.tileWidth = tilesetData.tilewidth;
    this.tileHeight = tilesetData.tileheight;
    this.columns = tilesetData.columns;
    this.firstgid = tilesetData.firstgid;
    this.mapWidth = tileMapJSON.width;
    this.mapHeight = tileMapJSON.height;
    this.tileMap = construct2DArray(
      this.getTileData(tileMapJSON),
      this.mapHeight,
      this.mapWidth,
    );
    this.tileSetIMG = tileSetIMG;
  }
  getTileData(json) {
    return json.layers[0].data;
  }
  drawGrid(ctx) {
    for (let row = 0; row < this.mapHeight; row++) {
      for (let col = 0; col < this.mapWidth; col++) {
        const gid = this.tileMap[row][col];

        // To avoid mathematical errors
        if (gid === 0) continue;

        const localId = gid - this.firstgid;
        const srcCol = localId % this.columns;
        const srcRow = Math.floor(localId / this.columns);

        ctx.drawImage(
          this.tileSetIMG,
          srcCol * this.tileWidth,
          srcRow * this.tileHeight,
          this.tileWidth,
          this.tileHeight,
          col * this.cellSize,
          row * this.cellSize,
          this.cellSize,
          this.cellSize,
        );
      }
    }
  }
}

export { TileMap };
