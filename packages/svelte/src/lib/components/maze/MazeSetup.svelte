<script lang="ts">
  import Range from "$lib/components/maze/config/range.svelte";
  import { DEFAULT_HEIGHT, DEFAULT_WIDTH, MAX_HEIGHT, MAX_WIDTH, MIN_HEIGHT,  MIN_WIDTH,  generateMaze, solve } from "../../../../../shared/maze";
  import RenderMaze from "./RenderMaze.svelte";

  let {selectMaze}=$props()
  let maze:number[][][] = $state([])  
  let uuid = $state("")
  let mazeWidth = $state(DEFAULT_WIDTH);
  let mazeHeight = $state(DEFAULT_HEIGHT);

  let showSolution = $state(false)

  let solution = $state(new Set());

  const solveMaze = ()=>{
    showSolution = !showSolution
    if (showSolution) {
    const solutionPath = solve({maze});
    solution = new Set();
    solutionPath.forEach((path) => {
      const [x, y] = path;
      solution.add(String(x) + "-" + String(y));
    });
  }
   maze = maze  
  }

  const maxHeight = MAX_HEIGHT;
  const maxWidth = MAX_WIDTH;
  $effect(() => {
    if (maxHeight >=MIN_HEIGHT && maxWidth >=MIN_WIDTH) {
    ({uuid, maze} = generateMaze(mazeWidth, mazeHeight));
    showSolution = false 
    }
  });
  
</script>

<div class="mt-6 grid grid-cols-2 gap-4 p-6">
  <div class="card bg-base-100 p-4 shadow-lg">
    <div class="card-body">
      <h2 class="card-title text-lg font-bold">Configure Maze</h2>
      <div class="grid grid-cols-2 gap-4">
        <div class="parameters">
          <div class="form-control">
            <p class="label-text font-semibold">Height <span class="text-smaller">(max:{maxHeight})</span>  {mazeHeight}</p>
            <Range min={5} max={maxHeight} bind:value={mazeHeight} />
          </div>
          <div class="form-control">
            <p class="label-text font-semibold">Width <span class="text-smaller">(max:{maxWidth})</span> {mazeWidth}</p>
            <Range min={5} max={maxWidth} bind:value={mazeWidth} />
          </div>
        </div>
        <div class="flex items-center">
          <div class="flex flex-row gap-16">
            <button  class="btn btn-outline btn-primary" on:click={solveMaze}>
              Solve Maze
           </button>
           <button class="btn btn-outline btn-primary" on:click={()=>selectMaze({
            uuid, maze
           })}>Select Maze</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="maze-wrapper">
  {#if maze.length}
    <RenderMaze {solution} {showSolution} {maze}/>
    {/if}
  </div>
</div>
