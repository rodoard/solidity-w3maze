<script lang="ts">
  import { tryFinally } from "../util";

 let {maze, active=false, submitProof,  updatePath, showSolution=false, solution=new Set()} = $props()

 let player = $state({
  x:0, y:0
 })

 const rows = maze.length;
 const cols = maze[0].length;
 
 let finished = $state(false)

 const isCurrentPosition = (i: number, j: number)=>{
   const {x,y} = player
    return i === x && j === y
  }

  const isDestination = (i: number, j: number)=>{
    return  i === maze.length - 1 && j === maze[0].length - 1
  }

 const makeClassName = (i: number, j: number) => {
    let arr = [];
    if (maze[i][j][0] === 0) {
      arr.push("topWall");
    }
    if (maze[i][j][1] === 0) {
      arr.push("rightWall");
    }
    if (maze[i][j][2] === 0) {
      arr.push("bottomWall");
    }
    if (maze[i][j][3] === 0) {
      arr.push("leftWall");
    }

    const destination = isDestination(i,j)
    const currentPos = isCurrentPosition(i,j)

    if (currentPos && destination) {
      arr.push("finished");
      finished = true 
    } else if (currentPos) {
      arr.push("currentPosition");
    } else if (destination){
     arr.push("destination");
    }
    
    if (showSolution && solution.has(String(i) + "-" + String(j))) {
      arr.push("sol");
    }
    return arr.join(" ");
  };

  const handleKeyDown =  (ev:any) => {
    let { x, y } = player;
   // Determine new position based on walls and boundaries
    switch (ev.key) {
      case "ArrowUp":
        if (x > 0 && maze[x][y][0] === 1 && maze[x - 1][y][2] === 1) x--; // Top edge open
        break;
      case "ArrowDown":
        if (x < rows - 1 && maze[x][y][2] === 1 && maze[x + 1][y][0] === 1) x++; // Bottom edge open
        break;
      case "ArrowLeft":
        if (y > 0 && maze[x][y][3] === 1 && maze[x][y - 1][1] === 1) y--; // Left edge open
        break;
      case "ArrowRight":
        if (y < cols - 1 && maze[x][y][1] === 1 && maze[x][y + 1][3] === 1) y++; // Right edge open
        break;
    }
    if (x !== player.x || y !== player.y) {
      // Update player's position
      player = { x, y };
      updatePath({x,y})
    }
}
let submitting = $state(false)
  
  const submit = async () => {
    submitting = true;
    tryFinally({
      t: async () => await submitProof(),
      f: async () => {
        submitting = false;
      },
    });
};

</script>
{#if active && !finished}
<div class="font-italic mt-2 text font-semibold">
  Play game!
</div>
{/if}
{#if active && finished}
 <div class="mt-4 mb-2 grid grid-cols-2">
  <div class="font-semibold font-italic ">Well done!</div>
  <div>
  <button disabled={!finished || submitting} onclick={submitProof} class="btn btn-sm btn-outline btn-glass">Submit solution</button>
  </div>
 </div>
{/if}

<div class="flex align-center justify-center"> 
   <table id="maze">
    <tbody>
      {#each maze as row, i}
        <tr class={`row-${i}`}>
          {#each row as cell, j}
            <td class={`cell-${i}-${j} ${makeClassName(i, j)}`}>
              <div></div>
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<svelte:window on:keydown|preventDefault={active && !finished ? handleKeyDown: ()=>{}} />