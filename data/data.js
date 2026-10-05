// Towers types: [turret, ice, rocket, stack];
const towerTypes = [
  { id: "turret", label: "Turret", cost: 50, color: "green" },
  { id: "ice", label: "Ice Tower", cost: 150, color: "blue" },
  { id: "rocket", label: "Rocket Tower", cost: 100, color: "red" },
  { id: "stack", label: "Stack Tower", cost: 200, color: "orange" },
];

const wavesInfo = [
  ["zombie", "zombie", "zombie", "zombie", "sprinter"],
  ["zombie", "zombie", "sprinter", "sprinter", "zombie"],
  ["sprinter", "zombie", "sprinter", "zombie", "buffed"],
];

const enemyTypes = {
  zombie: { health: 200, speed: 120, color: "green" },
  sprinter: { health: 150, speed: 200, color: "blue" },
  buffed: { health: 350, speed: 100, color: "yellow" },
  floppa: { health: 1000000, speed: 80 },
};

export { towerTypes, enemyTypes, wavesInfo };
