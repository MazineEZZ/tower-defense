const gameSettings = Object.freeze({
  width: 1024,
  height: 640,
  ratio: 16 / 9,
  margin: 5,
  cellSize: 32 * 2,
  bgColor: "rgb(82, 171, 244)",
});

const inputBindings = Object.freeze({
  move_up: "z",
  move_down: "s",
  move_right: "d",
  move_left: "q",
  debug_game: "o",
  pause_game: "p",
  test: "l",
  test2: "m",
});

export { gameSettings, inputBindings };
