import { Umi, generateSigner, publicKey } from "@metaplex-foundation/umi";
import { CANDY_MACHINE_PUBLIC_KEY, COLLECTION_MINT } from "../env";
import { TokenStandard, fetchDigitalAsset } from "@metaplex-foundation/mpl-token-metadata";
import { fetchCandyMachine, setTokenStandard } from "@metaplex-foundation/mpl-candy-machine";

export const ChangeTheTokenStandardOfCandyMachine =async (umi:Umi)=>{
    const candyMachineAddress = publicKey(CANDY_MACHINE_PUBLIC_KEY);
    const candyMachine = await fetchCandyMachine(umi, candyMachineAddress);
    const asset = await fetchDigitalAsset(umi, publicKey(COLLECTION_MINT))
    const collectionUpdateAuthority = generateSigner(umi);
  
    await setTokenStandard(umi, {
      candyMachine: candyMachine.publicKey,
      collectionMint: candyMachine.collectionMint,
      collectionUpdateAuthority,
      tokenStandard: TokenStandard.ProgrammableNonFungible,
    }).sendAndConfirm(umi)
  }