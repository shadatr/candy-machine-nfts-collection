import { Umi, generateSigner, publicKey, some, transactionBuilder } from "@metaplex-foundation/umi";
import { CANDY_MACHINE_PUBLIC_KEY, COLLECTION_MINT } from "../env";
import { fetchCandyGuard, fetchCandyMachine, mintV2, updateCandyGuard } from "@metaplex-foundation/mpl-candy-machine";
import { fetchDigitalAsset } from "@metaplex-foundation/mpl-token-metadata";
import base58 from "bs58";
import { setComputeUnitLimit } from "@metaplex-foundation/mpl-toolbox";

export const MintFromCandyMachineWithGuards = async (umi:Umi) => {
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
    console.log(thirdPartySigner)
      const nftMint = generateSigner(umi);
    const asset = await fetchDigitalAsset(umi, publicKey(COLLECTION_MINT))
  
    const mint = await transactionBuilder()
      .add(setComputeUnitLimit(umi, { units: 800_000 }))
      .add(
        mintV2(umi, {
          candyMachine: publicKey(CANDY_MACHINE_PUBLIC_KEY),
          nftMint,
          collectionMint: publicKey(COLLECTION_MINT),
          collectionUpdateAuthority: asset.metadata.updateAuthority,
          mintArgs: {
            thirdPartySigner: some({ signer: thirdPartySigner }),
            mintLimit: some({ id: 1 }),
          },
        })
      )
      .sendAndConfirm(umi, { send: { skipPreflight: true } });
      console.log(base58.encode(Uint8Array.from(mint.signature)))
  };