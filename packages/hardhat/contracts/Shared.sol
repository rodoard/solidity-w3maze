// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

library Shared {
     struct Compressed {
        uint256 rows; 
        uint256 cols;
       uint256[] compressed;
    }
}