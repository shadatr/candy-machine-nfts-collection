import { Umi, generateSigner, publicKey, transactionBuilder } from "@metaplex-foundation/umi";
import { CANDY_MACHINE_PUBLIC_KEY, COLLECTION_MINT } from "../env";
import { fetchCandyMachine, mintV2 } from "@metaplex-foundation/mpl-candy-machine";
import { fetchMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { setComputeUnitLimit } from "@metaplex-foundation/mpl-toolbox";

export const MintNft = async (umi:Umi) => {
    const candyMachineAddress = publicKey(CANDY_MACHINE_PUBLIC_KEY);
    const candyMachine = await fetchCandyMachine(umi, candyMachineAddress);
    const nftMint = generateSigner(umi);
    const metadata = await fetchMetadata(umi, publicKey(COLLECTION_MINT));
  
    await transactionBuilder()
      .add(setComputeUnitLimit(umi, { units: 800_000 }))
      .add(
        mintV2(umi, {
          candyMachine: candyMachine.publicKey,
          nftMint,
          collectionMint: publicKey(COLLECTION_MINT),
          collectionUpdateAuthority: metadata.updateAuthority,
          tokenStandard: candyMachine.tokenStandard,
        })
      )
      .sendAndConfirm(umi);
  };