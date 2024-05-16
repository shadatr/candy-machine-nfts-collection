import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplCandyMachine } from "@metaplex-foundation/mpl-candy-machine";
import { keypairIdentity } from "@metaplex-foundation/umi";
import {} from "@metaplex-foundation/mpl-candy-machine";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import base58 from "bs58";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { PRIVATE_KEY } from "./env";
import { CreateNftAndCandyMachine } from "./function/CreateNftAndCandyMachine";
import { FetchCandyMachine } from "./function/FetchCandyMachine";
import { UploadNft } from "./function/UploadNft";
import { AddItemsToCandyMachine } from "./function/AddItemsToCandyMachine";
import { MintNft } from "./function/MintNft";
import { UpdateCandyMachineAndGuard } from "./function/UpdateCandyMachineAndGuard";
import { MintFromCandyMachineWithGuards } from "./function/MintFromCandyMachineWithGuards";
import { ChangeTheTokenStandardOfCandyMachine } from "./function/ChangeTheTokenStandardOfCandyMachine";

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

// CreateNftAndCandyMachine(umi);

FetchCandyMachine(umi);

// UploadNft(umi);

// AddItemsToCandyMachine(umi);

// MintNft(umi)

// UpdateCandyMachineAndGuard(umi);

// MintFromCandyMachineWithGuards(umi);

// ChangeTheTokenStandardOfCandyMachine(umi);
