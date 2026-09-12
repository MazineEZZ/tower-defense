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
    this.tileMap = this.combineTileData(tileMapJSON);
    console.log(this.tileMap);
    this.tileSetIMG = tileSetIMG;
  }
  getSelectedCoords(mouse) {
    const x = Math.floor(mouse.x / this.cellSize) * this.cellSize;
    const y = Math.floor(mouse.y / this.cellSize) * this.cellSize;
    return { x, y };
  }
  getTileData(json) {
    return json.layers[0].data;
  }
  combineTileData(json) {
    const boolGid = json.tilesets[1].firstgid;
    const walkable = json.layers[1].data;
    const buildable = json.layers[2].data;

    let ctr = -1;
    return this.tileMap.map((row) => {
      return row.map((tile) => {
        ctr++;
        return {
          visual: tile,
          walkable: walkable[ctr] % (boolGid - 1),
          buildable: buildable[ctr] % (boolGid - 1),
        };
      });
    });
  }

  draw(ctx) {
    for (let row = 0; row < this.mapHeight; row++) {
      for (let col = 0; col < this.mapWidth; col++) {
        const gid = this.tileMap[row][col].visual;

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
