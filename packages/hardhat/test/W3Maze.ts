const { expect } = require("chai");
const { ethers } = require("hardhat");
import { W3Maze } from "../typechain-types";
import { compareMazeArrays } from "./util";
import { defaultMaze as _defaultMaze, decodeMaze, DEFAULT_HEIGHT, DEFAULT_WIDTH, encodeMaze } from "../../shared/maze";

const TEST_PROOF_HASH = "0x88c1bbf9b99c67a811d60121e2b575f7927e1e1e814f68d3f1a3f367c0da50c8"

describe("W3Maze", function () {
  let w3Maze:W3Maze
  let player1:any 
  let player2:any 
  let owner:any  
  let maze:any 
  let defaultMaze:any 
  let decodedMaze:any 
  beforeEach(async function () {
    [owner, player1, player2] = await ethers.getSigners();
    const OracleFactory = await ethers.getContractFactory("MazeOracle");
    const oracle = await OracleFactory.deploy();
    const W3MazeFactory = await ethers.getContractFactory("W3Maze");
    w3Maze = await W3MazeFactory.deploy(oracle);
    await w3Maze.deploymentTransaction()?.wait()
    defaultMaze = _defaultMaze().maze
    maze = encodeMaze(defaultMaze)
    decodedMaze = decodeMaze(maze, defaultMaze.length, defaultMaze[0].length)
  });

  it("decoded maze should be same as default maze", async function () {
    expect(compareMazeArrays(defaultMaze, decodedMaze)).to.equal(true)
  });

  it("should not initialize with a new game", async function () {
    const currentGameId = await w3Maze.getCurrentGameId();
    const [isOpen, endsIn] = await w3Maze.getCurrentGameSession();

    expect(currentGameId).to.equal(0);
    expect(isOpen).to.equal(false);
  });

  it("should not allow a player to join during countdown", async function () {
    await w3Maze.startNewGame(maze, DEFAULT_HEIGHT, DEFAULT_WIDTH)
    await expect(w3Maze.connect(player1).join()).to.be.reverted;
    const currentGameId = await w3Maze.getCurrentGameId();
    const hasJoined = await w3Maze.players(currentGameId, player1.address);

    expect(hasJoined).to.equal(false);
  });

  it("should allow a player to join after countdown", async function () {
    await w3Maze.startNewGame(maze, DEFAULT_HEIGHT, DEFAULT_WIDTH)
    const countDown = await w3Maze.countdownDuration()
    await ethers.provider.send("evm_increaseTime", [Number(countDown)]); // Advance time by 1 hour
    await ethers.provider.send("evm_mine");

    await w3Maze.connect(player1).join();

    const currentGameId = await w3Maze.getCurrentGameId();
    const hasJoined = await w3Maze.players(currentGameId, player1.address);

    expect(hasJoined).to.equal(true);
  });

  
  it("should allow fetching current game maze", async function () {
    await w3Maze.startNewGame(maze, DEFAULT_HEIGHT, DEFAULT_WIDTH)
    const {compressed} = await w3Maze.getCurrentGameMaze()
    const fetched = compressed
    for(let i=0;i<fetched.length;i++) {
      expect(fetched[i]).to.equal(maze[i])
    }
  });

  it("should allow submitting completed proof during game", async function () {
    await w3Maze.startNewGame(maze, DEFAULT_HEIGHT, DEFAULT_WIDTH)
    const countDown = await w3Maze.countdownDuration()
    await ethers.provider.send("evm_increaseTime", [Number(countDown)]); // Advance time by 1 hour
    await ethers.provider.send("evm_mine");
    await w3Maze.join();
    w3Maze.submitProof(TEST_PROOF_HASH)
  });

  it("should not allow submitting completed proof after game", async function () {
    await w3Maze.startNewGame(maze, DEFAULT_HEIGHT, DEFAULT_WIDTH)
    const countDown = await w3Maze.countdownDuration()
    await ethers.provider.send("evm_increaseTime", [Number(countDown)]); // Advance time by 1 hour
    await ethers.provider.send("evm_mine");
    await w3Maze.join();
    const duration  =  await w3Maze.gameDuration()
    await ethers.provider.send("evm_increaseTime", [Number(duration) ]); // Advance time by countdown
    await ethers.provider.send("evm_mine");
    await  expect(w3Maze.submitProof(TEST_PROOF_HASH)).to.be.reverted
  });

  it("should not allow submitting completed proof if not joined current game", async function () {
    await w3Maze.startNewGame(maze, DEFAULT_HEIGHT, DEFAULT_WIDTH)
    const countDown = await w3Maze.countdownDuration()
    await ethers.provider.send("evm_increaseTime", [Number(countDown)]); // Advance time by 1 hour
    await ethers.provider.send("evm_mine");
    await expect(w3Maze.submitProof(TEST_PROOF_HASH)).to.be.reverted
  })

  it("should not allow a player to join twice", async function () {
    await w3Maze.startNewGame(maze, DEFAULT_HEIGHT, DEFAULT_WIDTH)
    const countDown = await w3Maze.countdownDuration()
    await ethers.provider.send("evm_increaseTime", [Number(countDown)]); // Advance time by 1 hour
    await ethers.provider.send("evm_mine");

    await w3Maze.connect(player1).join();
    await expect(w3Maze.connect(player1).join()).to.be.revertedWith("Player already joined");
  });

  it("should not allow the owner to close the current game before duration has passed", async function () {
    await w3Maze.startNewGame(maze, DEFAULT_HEIGHT, DEFAULT_WIDTH)
    
    const countDown = await w3Maze.countdownDuration()
    await ethers.provider.send("evm_increaseTime", [Number(countDown)]); // Advance time by 1 hour
    await ethers.provider.send("evm_mine");

    let [isOpen] = await w3Maze.getCurrentGameSession();

    expect(isOpen).to.equal(true);

    await expect( w3Maze.closeCurrentGame()).to.be.reverted;

    [isOpen] = await w3Maze.getCurrentGameSession();

    expect(isOpen).to.equal(true);
  });

  it("should allow the owner to close the current game after duration has passed", async function () {
    await w3Maze.startNewGame(maze, DEFAULT_HEIGHT, DEFAULT_WIDTH)
    
    let [isOpen] = await w3Maze.getCurrentGameSession();
    expect(isOpen).to.equal(true);

    const countDown = await w3Maze.countdownDuration()
    const duration  =  await w3Maze.gameDuration()
    
    await ethers.provider.send("evm_increaseTime", [Number(countDown + duration) ]); // Advance time by countdown
    await ethers.provider.send("evm_mine");

    await w3Maze.closeCurrentGame();

    [isOpen] = await w3Maze.getCurrentGameSession();

    expect(isOpen).to.equal(false);
  });


  it("should not allow players to join a closed game", async function () {
    await w3Maze.startNewGame(maze, DEFAULT_HEIGHT, DEFAULT_WIDTH)
    const countDown = await w3Maze.countdownDuration()
    const duration  =  await w3Maze.gameDuration()
    
    await ethers.provider.send("evm_increaseTime", [Number(countDown + duration) ]); // Advance time by countdown
    await ethers.provider.send("evm_mine");

    await w3Maze.closeCurrentGame();
    await expect(w3Maze.connect(player1).join()).to.be.revertedWith("Game is closed");
  });

  it("should allow the owner to start a new game", async function () {
    let [isOpen] = await w3Maze.getCurrentGameSession();
    expect(isOpen).to.equal(false);
    
    await w3Maze.startNewGame(maze, DEFAULT_HEIGHT, DEFAULT_WIDTH);

    [isOpen, , ] = await w3Maze.getCurrentGameSession();
    expect(isOpen).to.equal(true);
  });

  it("should not allow starting a new game during countdown", async function () {
    await w3Maze.startNewGame(maze, DEFAULT_HEIGHT, DEFAULT_WIDTH)
    await expect(w3Maze.startNewGame(maze, DEFAULT_HEIGHT, DEFAULT_WIDTH)).to.be.revertedWith("Game is ongoing");
  });

  it("should not allow starting a new game after countdown", async function () {
    await w3Maze.startNewGame(maze, DEFAULT_HEIGHT, DEFAULT_WIDTH)
    const countDown = await w3Maze.countdownDuration()
    await ethers.provider.send("evm_increaseTime", [Number(countDown)]); // Advance time by 1 hour
    await ethers.provider.send("evm_mine");
    await expect(w3Maze.startNewGame(maze, DEFAULT_HEIGHT, DEFAULT_WIDTH)).to.be.revertedWith("Game is ongoing");
  });
});
