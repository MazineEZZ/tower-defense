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
    this.tileSetIMG = tileSetIMG;
    // Markers
    this.spawnCell = this.getMarkerCell(tileMapJSON, "Spawn");
    this.exitCell = this.getMarkerCell(tileMapJSON, "Exit");

    this.path = this.extractPath(this.tileMap, this.spawnCell, this.exitCell);
    this.path = this.mapPathToCoords(this.path);
  }
  mapPathToCoords(path) {
    return path.map((obj) => ({
      y: obj.row * this.cellSize,
      x: obj.col * this.cellSize,
    }));
  }
  extractPath(tileMap, spawnCell, exitCell) {
    const rows = tileMap.length;
    const cols = tileMap[0].length;
    const visited = Array.from({ length: rows }, () =>
      new Array(cols).fill(false),
    );
    const path = [];

    const dirs = [
      { dr: -1, dc: 0 },
      { dr: 1, dc: 0 },
      { dr: 0, dc: -1 },
      { dr: 0, dc: 1 },
    ];

    let current = spawnCell;

    if (tileMap[current.row][current.col].walkable !== 1) {
      throw new Error("Spawn point is not a walkable tile");
    }

    while (current) {
      visited[current.row][current.col] = true;
      path.push({ ...current });

      if (current.row === exitCell.row && current.col === exitCell.col) {
        break;
      }

      const unvisitedNeighbor = [];
      for (const { dr, dc } of dirs) {
        const br = current.row + dr;
        const bc = current.col + dc;

        if (
          br >= 0 &&
          br < rows &&
          bc >= 0 &&
          bc < cols &&
          tileMap[br][bc].walkable === 1 &&
          !visited[br][bc]
        ) {
          unvisitedNeighbor.push({ row: br, col: bc });
        }
      }

      if (unvisitedNeighbor.length > 1) {
        console.warn(
          `Branch detected at row:${current.row}, col:${current.col}`,
        );
      }

      current = unvisitedNeighbor[0] ?? null;
    }

    const last = path[path.length - 1];
    if (last.row !== exitCell.row || last.col !== exitCell.col) {
      throw new Error("Path extraction ended before reaching the exit cell");
    }

    return path;
  }
  getMarkerCell(json, name) {
    const marker = this.getLayer(json.layers, "markers");
    const point = marker.objects.find((obj) => obj.name === name);
    return {
      col: Math.floor(point.x / this.tileHeight),
      row: Math.floor(point.y / this.tileWidth),
    };
  }
  getSelectedCoords(mouse) {
    const x = Math.floor(mouse.x / this.cellSize) * this.cellSize;
    const y = Math.floor(mouse.y / this.cellSize) * this.cellSize;
    return { x, y };
  }
  getTileData(json) {
    return json.layers[0].data;
  }
  getLayer(layers, key) {
    return layers.find((obj) => obj["name"] === key);
  }
  getLayerData(layers, key) {
    return this.getLayer(layers, key).data;
  }
  combineTileData(json) {
    const boolGid = json.tilesets[1].firstgid;
    const props = this.getLayerData(json.layers, "props");
    const walkable = this.getLayerData(json.layers, "walkable");
    const buildable = this.getLayerData(json.layers, "buildable");

    let ctr = -1;
    return this.tileMap.map((row) => {
      return row.map((tile) => {
        ctr++;
        return {
          base: tile,
          props: props[ctr],
          walkable: walkable[ctr] % (boolGid - 1),
          buildable: buildable[ctr] % (boolGid - 1),
        };
      });
    });
  }

  draw(ctx) {
    for (let row = 0; row < this.mapHeight; row++) {
      for (let col = 0; col < this.mapWidth; col++) {
        const baseGid = this.tileMap[row][col].base;
        const propsGid = this.tileMap[row][col].props;

        // Skip over empty tiles
        if (baseGid === 0) continue;

        let localId = baseGid - this.firstgid;
        let srcCol = localId % this.columns;
        let srcRow = Math.floor(localId / this.columns);

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

        if (propsGid === 0) continue;

        localId = propsGid - this.firstgid;
        srcCol = localId % this.columns;
        srcRow = Math.floor(localId / this.columns);

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
