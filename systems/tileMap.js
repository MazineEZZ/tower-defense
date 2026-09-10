import { clamp } from "../utilities/utils.js";
import { gameSettings, tileSet } from "../data/settings.js";

class TileMap {
  constructor(cellSize, tileSetJSON, tileSetIMG) {
    this.cellSize = cellSize;
    this.width = gameSettings.width;
    this.height = gameSettings.height;

    const tilesetData = tileSetJSON.tilesets[0];
    this.tileWidth = tilesetData.tilewidth;
    this.tileHeight = tilesetData.tileheight;
    this.mapWidth = tileSetJSON.width;
    this.mapHeight = tileSetJSON.height;
    this.tileMap = this.getTiledData(tileSetJSON);
    this.tileSetIMG = tileSetIMG;
  }
  getTiledData(json) {
    // This func only extracts Tiled software tileset data
    return json.layers[0].data;
  }
  drawGrid(ctx) {
    for (let row = 0; row < this.mapHeight; row++) {
      for (let col = 0; col < this.mapWidth; col++) {
        ctx.drawImage(
          this.tileSetIMG,
          0,
          0,
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
