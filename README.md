# Solidity W3Maze Game Full Stack

A dApp based on scaffold-eth-svelte that implements a decentralized maze game.
It consists of 3 smart contracts: W3Maze, MazeStorage, and MazeOracle.

W3Maze -- main contract 
MazeStorage -- stores a compressed representation of a 2D Maze for game history
MazeOracle -- decentralized verification that a player has successfully completed the maze,
currently this is an area that future work can expand on as right now it always returns success
It also contains a frontend that allows deployer/owner to 

 ######  Configure a maze 
  1) Width and Height can be selected while a preview shows the resulting maze
  2) There is an option to solve the maze to see a path to the goal
  3) Each new maze has their own unique id
 
Smart contract transactions 

###### Start new game   
1) Select a maze and start a new game (smart contract)
2) Players must wait for a count down before joining the game
3) After countdown player can join the game (smart contract)

###### Game play
1) Players can move around the maze using keyboard arrows wherever a move is possible 
2) Upon reaching the goal players must submit a proof of completion (smart contract) before the game countdown ends
3) Upon submission player proof is verified by smart contract using maze oracle to verify player completed the maze
4) sucess message is indicated if player proof passess verification consequently player turn ends for current while game count down continues
5) failure message is shown if player proof fails verification
and player can try again before game count down ends
6) When game countdown ends for current game a close game button is available that only the owner can click to close the current game
7) On close start screen is shown again
8) on start screen if player is owner, option to start new game is shown
9) otherwise a message is displayed to player to come back later

## Getting Started

1. Clone this repo

```
git clone https://github.com/rodoard/solidity-w3maze.git
cd solidity-w3maze
yarn
```

2. Run a local chain

```
yarn chain
```

3. On a second terminal, deploy the example contract

```
yarn deploy
```

4. Start the frontend

```
yarn start
```

Your app should now be running on `http://localhost:3000`.

## Documentation

Deployer/OWner View 
![Configure maze!]("./maze-configure-maze.png")
![Start!]("./maze-owner-start.png")
![Countdown!]("./maze-countdown.png")
![Play game!]("./maze-game-play.png")
![Join!]("./maze-join.png")
![Maze completed!]("./maze-completed.png")
![Proof submitted!]("./maze-proof-submitted.png")
![Close game!]("./maze-close-game.png")
