const joinMaze = async (writeContract:any) => {
  return writeContract({
    fn: "join"
  })
};

export const submitProof = async (writeContract:any,proof:string) => {
  return writeContract({
    fn: "submitProof",
    args: [proof]
  })
};

const closeGame = async (writeContract:any) => {
  return writeContract({
    fn: "closeCurrentGame"
  })
};
const startNewGame = async (writeContract:any, args:any) => {
  return writeContract({
    fn: "startNewGame",
    args
  })
}
const writeContractFactory = ( {writeFn, refresh=()=>{}}: {writeFn:any, refresh:()=>void} ) => async ({args, fn}:{fn:string,args:any[]}) => {
  const writeContractAsync = writeFn()
  await writeContractAsync(
    {
      functionName: fn,
      args
    },
    {
      onBlockConfirmation: (txnReceipt:any) => {
        console.log("📦 Transaction blockHash", txnReceipt.blockHash);
        refresh()
      },
    },
  );
};

export {
  joinMaze,
  writeContractFactory,
  startNewGame,
  closeGame
}