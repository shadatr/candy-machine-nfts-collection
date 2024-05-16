import { fetchCandyGuard, fetchCandyMachine, updateCandyGuard } from "@metaplex-foundation/mpl-candy-machine";
import { Umi, generateSigner, publicKey, some } from "@metaplex-foundation/umi";
import { CANDY_MACHINE_PUBLIC_KEY } from "../env";

export const UpdateCandyMachineAndGuard = async (umi:Umi) => {
    const thirdPartySigner = generateSigner(umi)
  
    const candyMachineAddress = publicKey(CANDY_MACHINE_PUBLIC_KEY);
    const candyMachine = await fetchCandyMachine(umi, candyMachineAddress);
    const candyGuard = await fetchCandyGuard(umi, candyMachine.mintAuthority);
    const updateCandy = await updateCandyGuard(umi, {
      candyGuard: candyGuard.publicKey,
      guards: {
        guards: {
          thirdPartySigner: some({ signer: thirdPartySigner.publicKey }),
          mintLimit: some({ id: 1, limit: 3 }),
        },
      },
      groups: [],
    }).sendAndConfirm(umi, { send: { skipPreflight: true } });
    console.log(candyGuard.guards.thirdPartySigner);
    console.log(thirdPartySigner)
  };