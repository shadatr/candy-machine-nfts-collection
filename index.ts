import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplCandyMachine } from "@metaplex-foundation/mpl-candy-machine";
import {
  KeypairSigner,
  createSignerFromKeypair,
  keypairIdentity,
  publicKey,
  signerIdentity,
  some,
} from "@metaplex-foundation/umi";
import {
  fetchCandyMachine,
  fetchCandyGuard,
} from "@metaplex-foundation/mpl-candy-machine";
import {
  createNft,
  mplTokenMetadata,
  TokenStandard,
} from "@metaplex-foundation/mpl-token-metadata";
import { create } from "@metaplex-foundation/mpl-candy-machine";
import { generateSigner, percentAmount } from "@metaplex-foundation/umi";


const QUICKNODE_RPC =
  "https://still-attentive-mountain.solana-devnet.quiknode.pro/39285c1ec1227a1405f74b521cdc0ba8ade76fdc/";
  const umi = createUmi(QUICKNODE_RPC).use(mplCandyMachine()).use(mplTokenMetadata());
  const PRIVATE_KEY=[56,89,103,129,94,87,13,1,94,153,12,118,173,26,147,146,27,207,88,84,235,184,36,208,4,7,200,142,119,204,56,246,225,186,93,231,222,227,72,31,84,19,161,246,169,192,171,92,159,232,228,238,253,188,184,212,72,222,160,2,226,253,204,89]
  const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(PRIVATE_KEY));
  umi.use(keypairIdentity(keypair))

const CreateNft = async () => {


  const collectionMint = generateSigner(umi);

  const collectionNft = await createNft(umi, {
    mint: collectionMint,
    authority: umi.identity,
    name: "My Collection NFT",
    uri: "https://mfp2m2qzszjbowdjl2vofmto5aq6rtlfilkcqdtx2nskls2gnnsa.arweave.net/YV-mahmWUhdYaV6q4rJu6CHozWVC1CgOd9NkpctGa2Q",
    sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
    isCollection: true,
  }).sendAndConfirm(umi);
 
  const candyMachine = generateSigner(umi);
  console.log(candyMachine)
  const candyM=await (
    await create(umi, {
      candyMachine,
      collectionMint: collectionMint.publicKey,
      collectionUpdateAuthority: umi.identity,
      tokenStandard: TokenStandard.NonFungible,
      sellerFeeBasisPoints: percentAmount(9.99, 2),
      itemsAvailable: 5000,
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
    })
  ).sendAndConfirm(umi);
  console.log(candyM)
};
CreateNft();

const CreateCandyMachine = async (collectionMint: KeypairSigner) => {
};

