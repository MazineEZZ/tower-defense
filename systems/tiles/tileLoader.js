class TileLoader {
  constructor(src) {
    this.tileMap = this.loadTileMap(src)
      .then((map) => map)
      .catch((err) => console.error(err));
  }
  async loadTileMap(src) {
    const response = await fetch(src);

    return response.json();
  }
  getTileData() {}
}
