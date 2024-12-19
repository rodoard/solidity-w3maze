import uuid from "short-uuid";


/**
 *
 * @param {number} x - width of maze
 * @param {number} y  - height of maze
 * Cell value: maze[i][j][n] is 0 (has wall) or 1 (no wall)
 * n == 0: north wall, n == 1: east wall
 * n == 2: south wall, n == 3: west wall
 *
 */
export function generateMaze(x:number, y:number) {
   if (x < MIN_HEIGHT){
    throw new Error(`Height is below minimum ${MIN_HEIGHT}`)
   }
   if (y < MIN_WIDTH) {
    throw new Error(`Height is below minimum ${MIN_WIDTH}`)
   }
   if (x > MAX_HEIGHT) {
    throw new Error(`Height is over maximum ${MAX_HEIGHT}`)
   }
   if (y > MAX_WIDTH) {
    throw new Error(`Width is over maximum ${MAX_WIDTH}`)
   }
  // Establish variables and starting grid
  const totalCells = x * y;
  const maze:number[][][] = [];
  const unvisited:boolean[][] = [];
  for (let i = 0; i < y; i++) {
    maze[i] = [];
    unvisited[i] = [];
    for (let j = 0; j < x; j++) {
      maze[i][j] = [0, 0, 0, 0];
      unvisited[i][j] = true;
    }
  }
  // Set a random position to start from
  let currentCell = [
    Math.floor(Math.random() * y),
    Math.floor(Math.random() * x)
  ];
  const path = [currentCell];
  unvisited[currentCell[0]][currentCell[1]] = false;
  let visited = 1;

  // Loop through all available cell positions
  while (visited < totalCells) {
    // Determine neighboring cells
    const pot = [
      [currentCell[0] - 1, currentCell[1], 0, 2],
      [currentCell[0], currentCell[1] + 1, 1, 3],
      [currentCell[0] + 1, currentCell[1], 2, 0],
      [currentCell[0], currentCell[1] - 1, 3, 1]
    ];
    const neighbors = [];

    // Determine if each neighboring cell is in game grid, and whether it has already been checked
    for (let l = 0; l < 4; l++) {
      if (
        pot[l][0] > -1 &&
        pot[l][0] < y &&
        pot[l][1] > -1 &&
        pot[l][1] < x &&
        unvisited[pot[l][0]][pot[l][1]]
      ) {
        neighbors.push(pot[l]);
      }
    }

    // If at least one active neighboring cell has been found
    if (neighbors.length) {
      // Choose one of the neighbors at random
      const next = neighbors[Math.floor(Math.random() * neighbors.length)];

      // Remove the wall between the current cell and the chosen neighboring cell
      maze[currentCell[0]][currentCell[1]][next[2]] = 1;
      maze[next[0]][next[1]][next[3]] = 1;

      // Mark the neighbor as visited, and set it as the current cell
      unvisited[next[0]][next[1]] = false;
      visited++;
      currentCell = [next[0], next[1]];
      path.push(currentCell);
    }
    // Otherwise go back up a step and keep going
    else {
      const cell = path.pop();
      if (cell !== undefined) {
        currentCell = cell;
      }
    }
  }
  return {
    uuid: uuid.generate(),
    maze
  }
}

export const DEFAULT_WIDTH=5
export const DEFAULT_HEIGHT=5
export const MIN_WIDTH=5
export const MIN_HEIGHT=5
export const MAX_HEIGHT=50
export const MAX_WIDTH=50

export function defaultMaze() {
  return generateMaze(DEFAULT_WIDTH, DEFAULT_HEIGHT)
}

export function solve({
  maze,
  startX = 0,
  startY = 0,
  endX = maze.length - 1,
  endY = maze[0].length - 1
}:{maze:number[][][], startX?:number, startY?:number, endX?:number, endY?:number}
) {
  const visited:boolean[][] = [];
  // Mark all cells as unvisited:
  for (let x = 0; x < maze.length; x++) {
    visited[x] = [];
    for (let y = 0; y < maze[x].length; y++) {
      visited[x][y] = false;
    }
  }

  const solution = [];
  let currentX = startX;
  let currentY = startY;
  let options = [];

  while (currentX !== endX || currentY !== endY) {
    visited[currentX][currentY] = true;
    options = getOptions(currentX, currentY, maze, visited);

    if (options.length === 0) {
     const answer = solution.pop()
     if (answer!==undefined) {
      const [newX, newY] = answer;
      currentX = newX;
      currentY = newY;
     }
    } else {
      solution.push([currentX, currentY]);
      const [newX, newY] = options[0];
      currentX = newX;
      currentY = newY;
    }
  }

  solution.push([currentX, currentY]);

  return solution;
}

/*
 * Gets all of the cells we can possibly go to next.
 */
function getOptions(x:number, y:number, maze:number[][][], visited:boolean[][]) {
  const options = [];
  const cell = maze[x][y];
  const rows = maze.length;
  const cols = maze[0].length;

  // can go south
  if (x + 1 < rows && !visited[x + 1][y] && cell[2] === 1) {
    options.push([x + 1, y]);
  }

  // can go east
  if (y + 1 < cols && !visited[x][y + 1] && cell[1] === 1) {
    options.push([x, y + 1]);
  }

  // can go west
  if (y - 1 >= 0 && !visited[x][y - 1] && cell[3] === 1) {
    options.push([x, y - 1]);
  }

  // can go north
  if (x - 1 >= 0 && !visited[x - 1][y] && cell[0] === 1) {
    options.push([x - 1, y]);
  }

  return options;
}

// Function to encode a 2D maze into uint256[] array
export function encodeMaze(mazeWalls:any) {
  const rows = mazeWalls.length;
  const cols = mazeWalls[0]?.length || 0;

  let bitString = "";

  // Flatten mazeWalls into a bit string
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const [top, right, bottom, left] = mazeWalls[row][col];
      bitString += `${top}${right}${bottom}${left}`; // Append each wall's bit
    }
  }

  // Split bit string into 256-bit chunks and convert to uint256 numbers
  const compressedMaze:BigInt[] = [];
  while (bitString.length > 0) {
    const chunk = bitString.slice(0, 256).padEnd(256, "0"); // Ensure each chunk is 256 bits
    compressedMaze.push(BigInt(`0b${chunk}`)); // Convert binary string to BigInt
    bitString = bitString.slice(256); // Remove processed chunk
  }

  return compressedMaze;
}

// Function to decode uint256[] array into 2D maze
export function decodeMaze(compressedMaze:any, rows:any, cols:any) {
  let bitString = "";

  // Convert each uint256 (BigInt) back into a binary string
  for (let chunk of compressedMaze) {
    const binaryChunk = chunk.toString(2).padStart(256, "0"); // Ensure each chunk is 256 bits
    bitString += binaryChunk;
  }

  // Reconstruct mazeWalls from the bit string
  const mazeWalls = [];
  let bitIndex = 0;

  for (let row = 0; row < rows; row++) {
    const rowArray = [];
    for (let col = 0; col < cols; col++) {
      const top = parseInt(bitString[bitIndex++], 2);
      const right = parseInt(bitString[bitIndex++], 2);
      const bottom = parseInt(bitString[bitIndex++], 2);
      const left = parseInt(bitString[bitIndex++], 2);

      rowArray.push([top, right, bottom, left]); // Add cell with 4 walls
    }
    mazeWalls.push(rowArray);
  }

  return mazeWalls;
}
