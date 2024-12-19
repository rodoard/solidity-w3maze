export function compareMazeArrays(originalMaze:any, reconstructedMaze:any) {
  const rows = originalMaze.length;
  const cols = originalMaze[0]?.length || 0;

  if (reconstructedMaze.length !== rows || reconstructedMaze[0]?.length !== cols) {
    return false; // Dimensions do not match
  }

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const originalCell = originalMaze[row][col];
      const reconstructedCell = reconstructedMaze[row][col];

      // Compare each wall in the cell
      if (!originalCell.every((wall:any, index:number) => wall === reconstructedCell[index])) {
        return false; // Cells do not match
      }
    }
  }

  return true; // All cells match
}
