// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

contract MazeOracle {
     function verifyProof(uint256 gameId,  bytes32 proofHash) external pure returns (bool) {
         if (gameId > 0 && proofHash > 0) {
          return true; 
         }
         return false; 
     }
}