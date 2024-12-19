<script lang="ts">
  import { createScaffoldWriteContract } from "$lib/runes/scaffoldWriteContract.svelte";
  import { createReadContract } from "@byteatatime/wagmi-svelte";
  import { fromReadData, tryFinally, type GameSession } from "../util";
  import { closeGame, joinMaze, startNewGame, writeContractFactory } from "./actions";
  import Countdown from "./Countdown.svelte";
  import { createTargetNetwork } from "$lib/runes/targetNetwork.svelte";
  import { createDeployedContractInfo } from "$lib/runes/deployedContractInfo.svelte";
  import RenderMaze from "./RenderMaze.svelte";
  import { encodeMaze } from "../../../../../shared/maze";
  import PlayGame from "./PlayGame.svelte";

  let { contractName, account, mazes, setupMaze } = $props();

  let isLoading = $state(true);

  let joining = $state(false);
  const { writeContractAsync } = $derived.by(createScaffoldWriteContract(contractName));
  const join = async () => {
    joining = true;
    tryFinally({
      t: async () => await joinMaze(writeContract),
      f: async () => {
        joining = false;
      },
    });
  };
  let starting = $state(false);
  const start = async () => {
    starting = true;
    const selected = getSelectedMaze().maze;
    const params = [encodeMaze(selected), selected.length, selected[0].length];
    tryFinally({
      t: async () => await startNewGame(writeContract, params),
      f: async () => {
        starting = false;
      },
    });
  };

  let closing = $state(false);
  const close = async () => {
    closing = true;
    tryFinally({
      t: async () => await closeGame(writeContract),
      f: async () => {
        closing = false;
      },
    });
  };

  const firstMaze = () => Object.values(mazes).at(0);
  const getSelectedMaze = () => mazes[selectedMaze];

  const w3maze: any = firstMaze();

  const { data: deployedContract } = $derived.by(createDeployedContractInfo(contractName));
  const targetNetwork = $derived.by(createTargetNetwork());
  const functionName = "getCurrentGameSession";

  let contractRead: any = $derived.by(
    createReadContract(() => ({
      account: account.address,
      chainId: targetNetwork.id,
      functionName,
      address: deployedContract?.address,
      abi: deployedContract?.abi,
      args: [],
      query: {
        retry: false,
      },
    })),
  );
  const refresh = async () => {
    await contractRead?.refetch();
  };
  const writeContract = writeContractFactory({
    writeFn: () => writeContractAsync,
    refresh,
  });
  let selectedMaze = $state("");
  let session: GameSession | undefined = $state(undefined);
  $effect(() => {
    if (!contractRead.isPending) {
      session = fromReadData(contractRead.data);
      isLoading = false;
    }
  });
</script>

{#if isLoading}
  <button class="btn">
    <span class="loading loading-spinner"></span>
    Loading w3maze game...
  </button>
{:else}
  <div class="p-6">
    <!-- Welcome Section -->
    <div class="bg-primary text-primary-content mb-6 rounded-lg p-6 text-center shadow-md">
      <h1 class="text-2xl font-bold">Welcome to W3Maze!</h1>
      {#if session?.isOpen}
        {#if session?.proofSubmitted}
          {#if session?.proofSuccess}
            <p class="text-xl font-semibold">
              Your submission for current game is valid. Congratulations on completing the maze!
            </p>
          {:else if session?.gameTimeLeft}
            <p class="font-italic font-semibold">
              There was an issue with your submission. Complete the maze and resubmit while there is still time left.!
            </p>
          {:else}
            <p class="font-italic font-semibold">
              There was an issue with your submission. Unfortunately, there is no more time left.!
            </p>
          {/if}
        {/if}
        {#if session?.hasEnded}
          <p class="font-italic font-semibold">Game has ended.</p>
          {#if session?.isOwner}
            <div class="flex flex-col gap-4">
              <div>
                <button disabled={closing} onclick={close} class="btn btn-outline btn-lg btn-secondary">
                  Close game
                </button>
              </div>
            </div>
          {/if}
        {:else if session?.inCountDown}
          <div class="mt-2">
            <p class="font-italic font-semibold">The next rounds starts in:</p>
            <Countdown duration={session?.countDown} {refresh} />
          </div>
        {:else if !session.joined}
          <p class="font-italic mt-2 text-lg font-semibold">
            Join the next round and stand a chance to win big prizes.
          </p>
          <button disabled={joining} onclick={join} class="btn btn-outline btn-lg btn-secondary"> Join </button>
        {:else if session.joined}
          {#if session?.proofSubmitted}
            {#if session?.proofSuccess}
              <p class="font-italic font-semibold">
                Your have completed your turn. Come again next time.
              </p>
            {:else if session?.gameTimeLeft}
              <PlayGame retrying={true} {writeContract} {account} compressedMaze={session.compressedMaze} />
            {/if}
          {:else if session?.compressedMaze?.compressed?.length}
            <PlayGame {writeContract} {account} compressedMaze={session.compressedMaze} />
          {/if}
        {/if}
      {:else}
        <p class="font-bold">Maze is currently closed.</p>
        {#if session?.isOwner}
          <div class="flex flex-col gap-4">
            <div>
              <button
                disabled={starting || selectedMaze.length == 0}
                onclick={start}
                class="btn btn-outline btn-lg btn-secondary"
              >
                Start new game
              </button>
            </div>
            <div>
              <select
                disabled={selectedMaze.length == 0}
                bind:value={selectedMaze}
                class="select select-bordered w-full max-w-xs"
              >
                <option value="" selected>Select w3maze</option>
                <option value={w3maze.uuid}>{w3maze.uuid}</option>
              </select>
            </div>
            <span class="font-italic">Select w3maze below.</span>
          </div>
        {:else}
          <p class=" font-italic mt-2 font-semibold">Please check back later for the next round.</p>
        {/if}
      {/if}
    </div>
  </div>
  {#if session?.isOpen}
    {#if session?.gameTimeLeft > 0}
    <div class="font-bold text-sm font-italic mb-5">Game ends in:</div>
    <Countdown duration={session?.gameTimeLeft} {refresh} />
    {/if}
  {/if}
  {#if session?.isOwner && !session?.isOpen}
    <div class="mb-6 text-center">
      <button onclick={setupMaze} class="btn btn-active btn-sm btn-secondary"> Configure Maze </button>
      <p class="font-italic text-center font-semibold">
        <span> Click to select. </span>
      </p>
      <div class="carousel carousel-vertical rounded-box h-96">
        <button class="carousel-item h-full" onclick={() => (selectedMaze = w3maze.uuid)}>
          <RenderMaze maze={w3maze.maze} />
        </button>
      </div>
    </div>
  {/if}
{/if}
