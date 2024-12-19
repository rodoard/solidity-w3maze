/**
 * This file is autogenerated by Scaffold-ETH.
 * You should not edit it manually or your changes might be overwritten.
 */
import type { GenericContractsDeclaration } from "$lib/utils/scaffold-eth/contract";

const deployedContracts = {
  31337: {
    MazeOracle: {
      address: "0x0E801D84Fa97b50751Dbf25036d067dCf18858bF",
      abi: [
        {
          inputs: [
            {
              internalType: "uint256",
              name: "gameId",
              type: "uint256",
            },
            {
              internalType: "bytes32",
              name: "proofHash",
              type: "bytes32",
            },
          ],
          name: "verifyProof",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "pure",
          type: "function",
        },
      ],
      inheritedFunctions: {},
    },
    W3Maze: {
      address: "0x8f86403A4DE0BB5791fa46B8e795C547942fE4Cf",
      abi: [
        {
          inputs: [
            {
              internalType: "contract IOracle",
              name: "_oracle",
              type: "address",
            },
          ],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "gameId",
              type: "uint256",
            },
          ],
          name: "GameClosed",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "player",
              type: "address",
            },
            {
              indexed: true,
              internalType: "uint256",
              name: "gameId",
              type: "uint256",
            },
          ],
          name: "GameJoined",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "gameId",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "endTime",
              type: "uint256",
            },
          ],
          name: "GameStarted",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "previousOwner",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "newOwner",
              type: "address",
            },
          ],
          name: "OwnershipTransferred",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "gameId",
              type: "uint256",
            },
            {
              indexed: true,
              internalType: "address",
              name: "player",
              type: "address",
            },
            {
              indexed: false,
              internalType: "bool",
              name: "success",
              type: "bool",
            },
            {
              indexed: false,
              internalType: "bytes32",
              name: "proofHash",
              type: "bytes32",
            },
          ],
          name: "ProofSubmitted",
          type: "event",
        },
        {
          inputs: [],
          name: "closeCurrentGame",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "countdownDuration",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "currentTimestamp",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "gameDuration",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "games",
          outputs: [
            {
              internalType: "bool",
              name: "isOpen",
              type: "bool",
            },
            {
              internalType: "uint256",
              name: "endsIn",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "startCountDown",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "getCurrentGameId",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "getCurrentGameMaze",
          outputs: [
            {
              components: [
                {
                  internalType: "uint256",
                  name: "rows",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "cols",
                  type: "uint256",
                },
                {
                  internalType: "uint256[]",
                  name: "compressed",
                  type: "uint256[]",
                },
              ],
              internalType: "struct Shared.Compressed",
              name: "",
              type: "tuple",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "getCurrentGameSession",
          outputs: [
            {
              components: [
                {
                  internalType: "bool",
                  name: "isOpen",
                  type: "bool",
                },
                {
                  internalType: "uint256",
                  name: "endsIn",
                  type: "uint256",
                },
                {
                  internalType: "bool",
                  name: "inCountDown",
                  type: "bool",
                },
                {
                  internalType: "uint256",
                  name: "countDown",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "startCountDown",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "gameTimeLeft",
                  type: "uint256",
                },
                {
                  internalType: "bool",
                  name: "isOwner",
                  type: "bool",
                },
                {
                  internalType: "bool",
                  name: "joined",
                  type: "bool",
                },
                {
                  internalType: "bool",
                  name: "hasEnded",
                  type: "bool",
                },
                {
                  internalType: "bool",
                  name: "proofSubmitted",
                  type: "bool",
                },
                {
                  internalType: "bool",
                  name: "proofSuccess",
                  type: "bool",
                },
                {
                  components: [
                    {
                      internalType: "uint256",
                      name: "rows",
                      type: "uint256",
                    },
                    {
                      internalType: "uint256",
                      name: "cols",
                      type: "uint256",
                    },
                    {
                      internalType: "uint256[]",
                      name: "compressed",
                      type: "uint256[]",
                    },
                  ],
                  internalType: "struct Shared.Compressed",
                  name: "compressedMaze",
                  type: "tuple",
                },
              ],
              internalType: "struct W3Maze.GameSession",
              name: "",
              type: "tuple",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "join",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "mazeStorage",
          outputs: [
            {
              internalType: "contract MazeStorage",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "oracle",
          outputs: [
            {
              internalType: "contract IOracle",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "owner",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          name: "playerProofs",
          outputs: [
            {
              internalType: "bool",
              name: "success",
              type: "bool",
            },
            {
              internalType: "bytes32",
              name: "proofHash",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          name: "players",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "renounceOwnership",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "duration",
              type: "uint256",
            },
          ],
          name: "setCountdownDuration",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "duration",
              type: "uint256",
            },
          ],
          name: "setGameDuration",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256[]",
              name: "compressedMaze",
              type: "uint256[]",
            },
            {
              internalType: "uint256",
              name: "rows",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "cols",
              type: "uint256",
            },
          ],
          name: "startNewGame",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "proofHash",
              type: "bytes32",
            },
          ],
          name: "submitProof",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "newOwner",
              type: "address",
            },
          ],
          name: "transferOwnership",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      inheritedFunctions: {
        owner: "@openzeppelin/contracts/access/Ownable.sol",
        renounceOwnership: "@openzeppelin/contracts/access/Ownable.sol",
        transferOwnership: "@openzeppelin/contracts/access/Ownable.sol",
      },
    },
  },
} as const;

export default deployedContracts satisfies GenericContractsDeclaration;