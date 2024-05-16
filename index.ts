import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  addConfigLines,
  mintV2,
  mplCandyMachine,
  updateCandyGuard,
} from "@metaplex-foundation/mpl-candy-machine";
import {
  createGenericFileFromBrowserFile,
  dateTime,
  keypairIdentity,
  publicKey,
  sol,
  some,
} from "@metaplex-foundation/umi";
import {} from "@metaplex-foundation/mpl-candy-machine";
import {
  createNft,
  fetchDigitalAsset,
  fetchMetadata,
  mplTokenMetadata,
  TokenStandard,
} from "@metaplex-foundation/mpl-token-metadata";
import { create } from "@metaplex-foundation/mpl-candy-machine";
import base58 from "bs58";
import {
  fetchCandyMachine,
  fetchCandyGuard,
} from "@metaplex-foundation/mpl-candy-machine";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import fs from "fs";
import {
  CANDY_MACHINE_PUBLIC_KEY,
  COLLECTION_MINT,
  PRIVATE_KEY,
} from "./env";
import { setComputeUnitLimit } from "@metaplex-foundation/mpl-toolbox";
import {
  transactionBuilder,
  generateSigner,
  percentAmount,
} from "@metaplex-foundation/umi";
import { fetchDigitalAssetWithTokenByMint } from '@metaplex-foundation/mpl-token-metadata'

const QUICKNODE_RPC =
  "https://still-attentive-mountain.solana-devnet.quiknode.pro/39285c1ec1227a1405f74b521cdc0ba8ade76fdc/";
const umi = createUmi(QUICKNODE_RPC)
  .use(mplCandyMachine())
  .use(mplTokenMetadata());
umi.use(irysUploader());

const keypair = umi.eddsa.createKeypairFromSecretKey(
  Uint8Array.from(base58.decode(PRIVATE_KEY))
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
// CreateNftAndCandyMachine();

const FetchCandyMachine = async () => {
  const candyMachineAddress = publicKey(CANDY_MACHINE_PUBLIC_KEY);
  const candyMachine = await fetchCandyMachine(umi, candyMachineAddress);
  const candyGuard = await fetchCandyGuard(umi, candyMachine.mintAuthority);

  console.log(candyMachine);
  console.log(candyGuard);
};

// FetchCandyMachine();

const uploadNft = async () => {
  // Read the local image file
  const imageBlob = fs.readFileSync(
    "/Users/shada/Documents/candy-machine-nfts-collection/image10.png"
  );

  // Create a File object from the image blob
  const localImage = new File([imageBlob], "image.png", { type: "image/png" });

  // Convert the File object to a GenericFile
  const file = await createGenericFileFromBrowserFile(localImage);

  // Upload the image file
  const [imageUri] = await umi.uploader.upload([file]);

  // Upload the JSON metadata
  const uri = await umi.uploader.uploadJson({
    name: "My NFT #10",
    description: "My description",
    image: imageUri,
  });

  console.log("NFT uploaded with metadata URI:", uri);
};

// uploadNft();

const AddItemsToCandyMachine = async () => {
  const candyMachineAddress = publicKey(CANDY_MACHINE_PUBLIC_KEY);
  await addConfigLines(umi, {
    candyMachine: candyMachineAddress,
    index: 0,
    configLines: [
      {
        name: "My NFT #1",
        uri: "https://arweave.net/fKNh_IDlWg3FWgBzz2PFncyEnINof2meG5WR70m1kZI",
      },
      {
        name: "My NFT #2",
        uri: "https://arweave.net/wCR2h-eaPFSrk9PkGVYk2U-dl0fjPD0zh5gJmXdBBtE",
      },
      {
        name: "My NFT #3",
        uri: "https://arweave.net/d5SNRlvM_4jTyfaQxGpF85Uku52hmUH9LZazXNFy-uU",
      },
      {
        name: "My NFT #4",
        uri: "https://arweave.net/v_P0Tkvg1cFDQmW-WiyEI4hXNsQpubrFbUJ5MCidpYw",
      },
      {
        name: "My NFT #5",
        uri: "https://arweave.net/1-cwCJEVEXTuhLFF9EvwZtGpmsP9ko8nXuKGL1VDq9M",
      },
      {
        name: "My NFT #6",
        uri: "https://arweave.net/zmjGcNlvP0hY18wQ4xOIa9oSN0BdMMTV35XJ6syTHSM",
      },
      {
        name: "My NFT #7",
        uri: "https://arweave.net/A93i1CPaaaLWGojYTDu9uE1iCgMg3CfYaaOA00Ad4Fw",
      },
      {
        name: "My NFT #8",
        uri: "https://arweave.net/JoIQX59v6t79L8NlGiSr6ckCHIS_OsDSRTTPsMz_O74",
      },
      {
        name: "My NFT #9",
        uri: "https://arweave.net/cvfhBU5iAtjrUChOGiLWyG-GWSEWWzwqXJOgSckVrKQ",
      },
      {
        name: "My NFT #10",
        uri: "https://arweave.net/iD0Fv2Gk1X9VVqvpwLzvwNXRckthF2do060jF8fztGw",
      },
    ],
  }).sendAndConfirm(umi);
};

// AddItemsToCandyMachine()

const MintNft = async () => {
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

// MintNft()

const updateCandyMachineAndGuard = async () => {
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

// updateCandyMachineAndGuard();

const MintFromCandyMachineWithGuards = async () => {
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
    // 2G8K1mCuSA1KzGKt6dAN3aQLxK87afihG1WwwmaAeYEPYE7D4F2vj2nwaJAjoud2CNEeJQXCQY91djQ1Dq4rmhWB
};
MintFromCandyMachineWithGuards();
