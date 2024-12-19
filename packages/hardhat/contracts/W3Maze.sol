// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./MazeOracle.sol";
import "./MazeStorage.sol";
import "./Shared.sol";

interface IOracle {
    function verifyProof(uint256 gameId, bytes32 proofHash) external returns (bool);
}

contract W3Maze is Ownable {
    using Counters for Counters.Counter;

    // Events
    event GameJoined(address indexed player, uint256 indexed gameId);
    event GameStarted(uint256 indexed gameId, uint256 endTime);
    event GameClosed(uint256 indexed gameId);
    event ProofSubmitted(uint256 indexed gameId, address indexed player, bool success, bytes32 proofHash);

    struct ProofStatus {
        bool success;
        bytes32 proofHash; 
    }

    // Game state variables
    struct Game {
        bool isOpen; // Whether the game is closed
        uint256 endsIn; // Timestamp when the game ends
        uint256 startCountDown; // Countdown timestamp for the next game
    }

    mapping(uint256 => Game) public games; // Mapping of gameId to Game
    mapping(uint256 => mapping(address => bool)) public players; // Track if a player joined a game
    mapping(uint256 => mapping(address => ProofStatus)) public playerProofs; // tracks player proofs

    Counters.Counter private gameIdCounter; // Counter for game IDs

    uint256 public gameDuration = 1 hours; // Default game duration
    uint256 public countdownDuration = 30 minutes; // Default countdown before next game


    // Modifiers
    modifier onlyOpenGame(uint256 gameId) {
        require(games[gameId].isOpen, "Game is closed");
        _;
    }

    modifier onlyDuringGame(uint256 gameId) {
        require(games[gameId].endsIn > 0, "There is no game in progress");
        require(games[gameId].isOpen, "Game is closed");
        require(block.timestamp <= games[gameId].endsIn, "Game has ended");
        _;
    }

     modifier onlyAfterCountDown(uint256 gameId) {
        require(block.timestamp >= games[gameId].startCountDown + countdownDuration, "Countdown not completed");
        _;
    }

    modifier onlyAfterGame(uint256 gameId) {
        require(games[gameId].endsIn == 0 || block.timestamp > games[gameId].endsIn, "Game is ongoing");
        _;
    }

    MazeStorage public mazeStorage; 
    IOracle public oracle; 

    constructor(IOracle _oracle) {
        mazeStorage = new MazeStorage();
        oracle = _oracle;
    }
 
    function hasJoinedGame(uint256 gameId) private view returns (bool) {
         return players[gameId][msg.sender] == true;
    }

    // Function to submit proof (a path hash)
    function submitProof(bytes32 proofHash) external  onlyDuringGame(gameIdCounter.current()) {
        uint256 currentGameId = gameIdCounter.current();  
        require(hasJoinedGame(currentGameId), "You must join the game first.");
       
         // Request verification from the oracle
        bool success = IOracle(oracle).verifyProof(currentGameId, proofHash);

        // Store the player's proof
        playerProofs[currentGameId][msg.sender] = ProofStatus(
            {   
                success: success,
                proofHash: proofHash
         });

        // Emit proof submitted
        emit ProofSubmitted(currentGameId, msg.sender, success, proofHash);
    }


    // Join the current game
    function join() external onlyDuringGame(gameIdCounter.current()) onlyAfterCountDown(gameIdCounter.current()){
        uint256 currentGameId = gameIdCounter.current();
        require(!players[currentGameId][msg.sender], "Player already joined");
        players[currentGameId][msg.sender] = true;
        emit GameJoined(msg.sender, currentGameId);
    }

    function currentTimestamp() external view returns (uint256) {
        return block.timestamp;
    }

    // Start a new game
    function startNewGame(uint256[] calldata compressedMaze, uint256 rows, uint256 cols) external onlyOwner onlyAfterGame(gameIdCounter.current()) {
        gameIdCounter.increment();
        uint256 newGameId = gameIdCounter.current();
        uint256 timestamp = block.timestamp;
        uint256 endTime = timestamp + gameDuration + countdownDuration;

        games[newGameId] = Game({
            isOpen: true,
            endsIn: endTime,
            startCountDown: timestamp
        });

        mazeStorage.storeMaze(newGameId, compressedMaze, rows, cols);

        emit GameStarted(newGameId, endTime);
    }

    // Close the current game
    function closeCurrentGame() external onlyOwner onlyAfterGame(gameIdCounter.current()) {
        uint256 currentGameId = gameIdCounter.current();
        require(games[currentGameId].isOpen, "Game already closed");

        games[currentGameId].isOpen = false;
        emit GameClosed(currentGameId);
    }

    // Get the current game ID
    function getCurrentGameId() external view returns (uint256) {
        return gameIdCounter.current();
    }

    struct GameSession {
        bool isOpen; 
        uint256 endsIn; 
        bool inCountDown; 
        uint256 countDown; 
        uint256 startCountDown;
        uint256 gameTimeLeft;
        bool isOwner;
        bool joined;
        bool hasEnded;
        bool proofSubmitted;
        bool proofSuccess;
        Shared.Compressed compressedMaze;
    }

    function getCurrentGameMaze() external onlyDuringGame(gameIdCounter.current()) view returns (Shared.Compressed memory) {
        return mazeStorage.getMaze(gameIdCounter.current());
    }

    // Get the status of the current game
    function getCurrentGameSession() external view returns (GameSession memory) {
        uint256 currentGameId = gameIdCounter.current();
        Game memory game = games[currentGameId];
        uint256 countDown = game.startCountDown + countdownDuration;
        if (block.timestamp < countDown) {
            countDown = countDown - block.timestamp;
        } else {
            countDown = 0;
        }
        bool joined = players[currentGameId][msg.sender];
        Shared.Compressed memory compressedMaze; 
        if (joined) {
            compressedMaze = mazeStorage.getMaze(currentGameId);
        }
        ProofStatus memory proofStatus = playerProofs[currentGameId][msg.sender];
        bool proofSubmitted = proofStatus.proofHash > 0;
        bool proofSuccess = proofStatus.success;
        bool hasEnded = block.timestamp > game.endsIn;
        uint256 gameTimeLeft = 0;
        if (joined && !hasEnded) {
           gameTimeLeft = game.endsIn - block.timestamp;
        }
        return GameSession({
         isOpen : game.isOpen,
         endsIn : game.endsIn,
         hasEnded: hasEnded,  
         gameTimeLeft: gameTimeLeft,
         inCountDown : block.timestamp < game.startCountDown + countdownDuration, 
         countDown: countDown,
         startCountDown: game.startCountDown,
         joined: joined,
         proofSubmitted: proofSubmitted,
         proofSuccess: proofSuccess, 
         isOwner : owner() == msg.sender,
         compressedMaze: compressedMaze
        });
    }

    // Set game duration
    function setGameDuration(uint256 duration) external onlyOwner {
        require(duration > 0, "Duration must be greater than 0");
        gameDuration = duration;
    }

    // Set countdown duration
    function setCountdownDuration(uint256 duration) external onlyOwner {
        require(duration > 0, "Duration must be greater than 0");
        countdownDuration = duration;
    }
}
