// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "./Shared.sol";

contract MazeStorage {
  
    mapping(uint256 => Shared.Compressed) private compressedMazes; // Game ID -> Compressed Maze

    event MazeStored(uint256 indexed gameId, uint256 mazeLength);

    /// @dev Stores a compressed maze for a specific game ID
    /// @param gameId The ID of the game
    /// @param compressedMaze An array of uint256 representing the compressed maze
    function storeMaze(uint256 gameId, uint256[] calldata compressedMaze, uint256 rows, uint256 cols) external {
        require(compressedMaze.length > 0, "Compressed maze cannot be empty");
        require(compressedMaze.length <= 40, "Maze too large"); // Precomputed value for (50 * 50) / 64 + 1
        compressedMazes[gameId] = Shared.Compressed({
            compressed: compressedMaze,
            rows:rows,
            cols: cols
        });
        emit MazeStored(gameId, compressedMaze.length);
    }

    /// @dev Retrieves the compressed maze for a given game
    /// @param gameId The ID of the game
    /// @return The compressed maze as an array of uint256
    function getMaze(uint256 gameId) external view returns (Shared.Compressed memory) {
        return compressedMazes[gameId];
    }
}
