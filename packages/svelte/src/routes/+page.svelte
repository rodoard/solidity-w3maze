<script lang="ts">
  import Dashboard from "$lib/components/maze/Dashboard.svelte";
  import MazeSetup from "$lib/components/maze/MazeSetup.svelte";
  import type { AppState } from "$lib/components/util.js";
  import { createAccount } from "@byteatatime/wagmi-svelte";
  import {defaultMaze} from "../../../shared/maze"
  
  const account = $derived.by(createAccount());
  const {data} = $props()
  let w3maze = $state(defaultMaze())
  const SETUP="setup-maze"
  const GAME_MODE="game"
  let appState:AppState = $state(GAME_MODE)
  const setupMaze = ()=> appState = SETUP
  const selectMaze = (selected:any) => {
    w3maze = selected
    appState = GAME_MODE
  }
  const mazes = {
    [w3maze.uuid]:w3maze
  }
</script>

<div class="flex flex-col items-center pt-10">
  {#if !account.address}
    <h1 class="text-medium font-italic text-md text-center font-semibold">Please sign with ethereum.</h1>
  {:else}
    {#if appState === "game"}
    <Dashboard {setupMaze} {mazes} {account} contractName={data.contractName}/>
    {:else if appState === "setup-maze"}
     <MazeSetup {selectMaze} {w3maze}/>
    {/if}
  {/if}
</div>
