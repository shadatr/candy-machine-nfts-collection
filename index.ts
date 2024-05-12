import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  addConfigLines,
  mplCandyMachine,
} from "@metaplex-foundation/mpl-candy-machine";
import {
  createGenericFileFromBrowserFile,
  keypairIdentity,
  publicKey,
  some,
} from "@metaplex-foundation/umi";
import {} from "@metaplex-foundation/mpl-candy-machine";
import {
  createNft,
  mplTokenMetadata,
  TokenStandard,
} from "@metaplex-foundation/mpl-token-metadata";
import { create } from "@metaplex-foundation/mpl-candy-machine";
import { generateSigner, percentAmount } from "@metaplex-foundation/umi";
import base58 from "bs58";
import {
  fetchCandyMachine,
  fetchCandyGuard,
} from "@metaplex-foundation/mpl-candy-machine";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import fs from "fs";
import {CANDY_MACHINE_PUBLIC_KEY, PRIVATE_KEY} from "./env"

const QUICKNODE_RPC =
  "https://still-attentive-mountain.solana-devnet.quiknode.pro/39285c1ec1227a1405f74b521cdc0ba8ade76fdc/";
const umi = createUmi(QUICKNODE_RPC)
  .use(mplCandyMachine())
  .use(mplTokenMetadata());
umi.use(irysUploader());

const keypair = umi.eddsa.createKeypairFromSecretKey(
  Uint8Array.from(
    base58.decode(
        PRIVATE_KEY
    )
  )
);
umi.use(keypairIdentity(keypair));

const CreateNftAndCandyMachine = async () => {
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
    console.log(
      "CreateCandyMachine",
      base58.encode(Uint8Array.from(CreateCandyMachine.signature))
    );
  } catch (err) {
    console.log(err);
  }
};
// CreateNftAndCandyMachine();

const FetchCandyMachine = async () => {
  const candyMachineAddress = publicKey(
    CANDY_MACHINE_PUBLIC_KEY
  );
  const candyMachine = await fetchCandyMachine(umi, candyMachineAddress);
  const candyGuard = await fetchCandyGuard(umi, candyMachine.mintAuthority);

  //   candyMachine.publicKey; // The public key of the Candy Machine account.
  //   candyMachine.mintAuthority; // The mint authority of the Candy Machine which, in most cases, is the Candy Guard address.
  //   candyMachine.data.itemsAvailable; // Total number of NFTs available.
  //   candyMachine.itemsRedeemed; // Number of NFTs minted.
  //   candyMachine.items[0].index; // The index of the first loaded item.
  //   candyMachine.items[0].name; // The name of the first loaded item (with prefix).
  //   candyMachine.items[0].uri; // The URI of the first loaded item (with prefix).
  //   candyMachine.items[0].minted; // Whether the first item has been minted.

  console.log(candyMachine);
};

FetchCandyMachine();

const uploadNft = async () => {
  // Read the local image file
  const imageBlob = fs.readFileSync(
    "/Users/shada/Documents/candy-machine-nfts-collection/image3.png"
  );

  // Create a File object from the image blob
  const localImage = new File([imageBlob], "image.png", { type: "image/png" });

  // Convert the File object to a GenericFile
  const file = await createGenericFileFromBrowserFile(localImage);

  // Upload the image file
  const [imageUri] = await umi.uploader.upload([file]);

  // Upload the JSON metadata
  const uri = await umi.uploader.uploadJson({
    name: "My NFT #3",
    description: "My description",
    image: imageUri,
  });

  console.log("NFT uploaded with metadata URI:", uri);
};

// uploadNft();

const AddItemsToCandyMachine = async () => {
  const candyMachineAddress = publicKey(
    CANDY_MACHINE_PUBLIC_KEY
  );
  await addConfigLines(umi, {
    candyMachine: candyMachineAddress,
    index: 0,
    configLines: [
      { name: "My NFT #1", uri: "https://arweave.net/fKNh_IDlWg3FWgBzz2PFncyEnINof2meG5WR70m1kZI" },
      { name: "My NFT #2", uri: "https://arweave.net/wCR2h-eaPFSrk9PkGVYk2U-dl0fjPD0zh5gJmXdBBtE" },
      { name: "My NFT #3", uri: "https://arweave.net/d5SNRlvM_4jTyfaQxGpF85Uku52hmUH9LZazXNFy-uU" },
    ],
  }).sendAndConfirm(umi);
};

// AddItemsToCandyMachine()