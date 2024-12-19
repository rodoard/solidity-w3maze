<script lang="ts">
 let {value=$bindable(), max, min}=$props()
</script>

<label class="input-group">
  <input type="range" min={min} max={max}  bind:value={value} class="input input-bordered" />
</label>
