import { create } from "@metaplex-foundation/mpl-candy-machine";
import { TokenStandard, createNft } from "@metaplex-foundation/mpl-token-metadata";
import { Umi, dateTime, generateSigner, percentAmount, sol, some } from "@metaplex-foundation/umi";
import base58 from "bs58";

export const CreateNftAndCandyMachine = async (umi:Umi) => {
    const collectionMint = generateSigner(umi);
    console.log("collectionMint", collectionMint.publicKey.toString());
  
    const collectionNft = await createNft(umi, {
      mint: collectionMint,
      authority: umi.identity,
      name: "My Collection NFT",
      uri: "https://mfp2m2qzszjbowdjl2vofmto5aq6rtlfilkcqdtx2nskls2gnnsa.arweave.net/YV-mahmWUhdYaV6q4rJu6CHozWVC1CgOd9NkpctGa2Q",
      sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
      isCollection: true,
    }).sendAndConfirm(umi);


  console.log(
    "collectionNft",
    base58.encode(Uint8Array.from(collectionNft.signature))
  );

  const candyMachine = generateSigner(umi);
  console.log("candyMachine publicKey", candyMachine.publicKey);
  console.log(
    "candyMachine secretKey",
    base58.encode(Uint8Array.from(candyMachine.secretKey))
  );

  try {
    const CreateCandyMachine = await (
      await create(umi, {
        candyMachine,
        collectionMint: collectionMint.publicKey,
        collectionUpdateAuthority: umi.identity,
        tokenStandard: TokenStandard.NonFungible,
        sellerFeeBasisPoints: percentAmount(9.99, 2),
        itemsAvailable: 10,
        creators: [
          {
            address: umi.identity.publicKey,
            verified: true,
            percentageShare: 100,
          },
        ],
        configLineSettings: some({
          prefixName: "",
          nameLength: 32,
          prefixUri: "",
          uriLength: 200,
          isSequential: false,
        }),
        guards: {
          botTax: some({
            lamports: sol(0.01),
            lastInstruction: true,
          }),
          solPayment: some({
            lamports: sol(1.5),
            destination: umi.identity.publicKey,
          }),
          startDate: some({ date: dateTime("2024-01-24T15:30:00.000Z") }),
        },
        groups: [],
      })
    ).sendAndConfirm(umi, { send: { skipPreflight: true } });
    console.log(
      "CreateCandyMachine: ",
      base58.encode(Uint8Array.from(CreateCandyMachine.signature))
    );
  } catch (err) {
    console.log(err);
  }
};