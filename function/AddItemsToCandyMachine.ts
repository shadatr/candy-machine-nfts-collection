import { Umi, publicKey } from "@metaplex-foundation/umi";
import { CANDY_MACHINE_PUBLIC_KEY } from "../env";
import { addConfigLines } from "@metaplex-foundation/mpl-candy-machine";

export const AddItemsToCandyMachine = async (umi:Umi) => {
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