# Game Template

## Overview

A tower defense game for my third entry to the [20 Game Challenge](https://20_games_challenge.gitlab.io/challenge/).

## Note to myself

This is a note that I'm to myself so that I can remember where I left the game at after I've been grinding for three months no stop.

What the game is and how it plays: This is a tower defense game, where you put towers and defend the base from incoming enemies. The game will be separated into two maps (hard and easy). The game loop will consist of 30 waves where each one bears increasing difficulty. The player must manage his economy strategically to defeat all 30 waves and protect from the zombies eating up the core of the city. The core of the city is the beeping heart. It's your duty to protect it at all cost!
What systems exist already:

- A tilesystem: it works by reading a tileset.json and extracting useful data like the walkable path for enemies, the tiles to draw, the buildable tiles etc.
- A BFS algorithm / pathfinding for extracting a path/waypoint array.
- A waypoint movement system of which moves the enemies down the path until they reach the end/core. It works by having a movement budget of which is spent each frame (it's a bit more complex than this, since it has two cases one checks if the remainingMovement is enough to place the object at the target and the other is to move the object slightly towards the target).
- A placement Grid: it adds meaningful indication like a grid, and useful colors so the user can understand where it's possible to place the tower.
- A build SYstem: It acts as the layer between the placementGrid and toolbar selection. It manages tower placement and such.
- Factories: Two enemy and tower factory that with build system (for towers) and wave system (for enemies). They manage and keep track of towers, and enemies.

- What you were in the middle of when you stopped: The last thing I implemented was making a zombie move from the spawnCell to the exit cell.
- What the next 2-3 steps were going to be: The next steps were to make the towers fire bullets, and killing off zombies, then working on the wave system properly.

What needs refactoring: Entities, Factories, buildsystem, and placementgrid all need refactoring to keep the game intact.
