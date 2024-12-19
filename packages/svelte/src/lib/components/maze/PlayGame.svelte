<script lang="ts">
  import keccak256 from "keccak256";
  import {toBytes, keccak256 as viemKeccak256 } from "viem"
  import { decodeMaze } from "../../../../../shared/maze";
  import RenderMaze from "./RenderMaze.svelte";
  import { submitProof } from "./actions";

  let {compressedMaze, writeContract}=$props()
  const {compressed, rows, cols} = compressedMaze
  const maze = decodeMaze(compressed, rows, cols )

  let pathHash = ""; // Final path hash

  const updatePath = (position:any)=> {
    const positionString = `(${position.x},${position.y})`;

    if (pathHash.length === 0) {
      // Initial hash
      pathHash = keccak256(positionString);
    } else {
      // Incremental hash: combine previous hash with the new position
      pathHash = keccak256(pathHash + positionString);
    }
  }
  const submit = async ()=>{
    const proofHash = viemKeccak256(toBytes(pathHash) )
    await submitProof(writeContract, proofHash)
  }
</script>
<RenderMaze active={true} {maze} submitProof={submit} {updatePath} />
