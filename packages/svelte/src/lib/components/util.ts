export async function tryFinally({ t, f }: {t:()=>Promise<void>, f:()=>Promise<void>}) {
  try {
     await t()
  } finally {
    await f()
   }
}

export type AppState = "game" | "setup-maze"

export type GameSession = {
   isOwner:boolean,
   isOpen:boolean,
   endsIn:number, 
   inCountDown:boolean, 
   joined:boolean,
   hasEnded:boolean,
   proofSubmitted:boolean,
   proofSuccess:boolean,
   gameTimeLeft: number,
   compressedMaze:{compressed:number[], rows:number, cols:number}
   countDown:number, 
}

export function fromReadData(data:GameSession) {
   const {
       countDown, gameTimeLeft, compressedMaze:{rows, cols, compressed}
   } = data 
  const numbers  = Object.entries({countDown, gameTimeLeft}).reduce((acc:{[key:string]:number},[key, val])=>{
    acc[key]=Number(val); return acc
  },{})
  return {
   ...data,
   ...numbers,
   compressedMaze:{compressed, rows:Number(rows), cols:Number(cols)}
  }
 }

export function convertSeconds(seconds:number) {
   const minutes = Math.floor(seconds / 60);
   const hours = Math.floor(minutes / 60);
   const days = Math.floor(hours / 24);

   return {
       days: days,
       hours: hours % 24,
       minutes: minutes % 60,
       seconds: seconds % 60
   };
}