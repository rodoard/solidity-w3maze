<script>
  import { convertSeconds } from "../util";
  let {duration, refresh}=$props()
 
  let [days, hours, minutes, seconds ] = $state([0,0,0,0])

  let finished = $state(false)
 function updateCountdown() {
    if (duration > 0) {
       setTimeout(() => {
        duration -= 1;
        updateCountdown(); 
     }, 1000); 
    } else {
      finished = true 
    }
  }
  
  updateCountdown()

  $effect(()=>{
    ({days, hours, minutes, seconds } = convertSeconds(duration)) 
  })
  $effect(()=>{
    if (finished) {
      setTimeout(
       ()=> refresh(),
      5000)
    }
  })
</script>
<div class="grid auto-cols-max grid-flow-col gap-5 text-center justify-center">
  <div class="bg-neutral rounded-box text-neutral-content flex flex-col p-2">
    <span class="countdown font-mono text-5xl">
      <span style="--value:{days};"></span>
    </span>
    days
  </div>
  <div class="bg-neutral rounded-box text-neutral-content flex flex-col p-2">
    <span class="countdown font-mono text-5xl">
      <span style="--value:{hours};"></span>
    </span>
    hours
  </div>
  <div class="bg-neutral rounded-box text-neutral-content flex flex-col p-2">
    <span class="countdown font-mono text-5xl">
      <span style="--value:{minutes};"></span>
    </span>
    min
  </div>
  <div class="bg-neutral rounded-box text-neutral-content flex flex-col p-2">
    <span class="countdown font-mono text-5xl">
      <span style="--value:{seconds};"></span>
    </span>
    sec
  </div>
</div>
{#if finished}
<p class="font-italic  text-secondary ">Block number should update, retrying....</p>
{/if}
