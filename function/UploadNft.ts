import { Umi, createGenericFileFromBrowserFile } from "@metaplex-foundation/umi";
import fs from "fs";

export const UploadNft = async (umi:Umi) => {
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