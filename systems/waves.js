class WaveSystem {
  constructor(wavesInfo, enemyFactory, tileMap) {
    this.wavesInfo = wavesInfo;
    this.enemyFactory = enemyFactory;
    this.tileMap = tileMap;
    this.cellSize = this.tileMap.cellSize;

    // Own Prop
    this.currLvl = 0;

    this.spawn();
  }

  spawn() {
    const path = this.tileMap.path;
    const spawnCell = path[0];
    this.enemyFactory.create("zombie", spawnCell.x, spawnCell.y, path);
  }
}

export { WaveSystem };
