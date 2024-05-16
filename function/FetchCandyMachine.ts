import { Umi, publicKey } from "@metaplex-foundation/umi";
import { CANDY_MACHINE_PUBLIC_KEY } from "../env";
import { fetchCandyGuard, fetchCandyMachine } from "@metaplex-foundation/mpl-candy-machine";

export const FetchCandyMachine = async (umi:Umi) => {
    const candyMachineAddress = publicKey(CANDY_MACHINE_PUBLIC_KEY);
    const candyMachine = await fetchCandyMachine(umi, candyMachineAddress);
    const candyGuard = await fetchCandyGuard(umi, candyMachine.mintAuthority);
  
    console.log(candyMachine);
    console.log(candyGuard);
  };
