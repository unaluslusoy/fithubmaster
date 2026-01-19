import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

// R2 Client Initialization
const R2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT || "", 
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "fithub-assets";
const R2_PUBLIC_URL_PREFIX = process.env.R2_PUBLIC_URL || "https://pub-xxxx.r2.dev";

export async function uploadToR2(
    fileBuffer: Buffer, 
    fileName: string, 
    contentType: string, 
    folder: string = "uploads"
) {
  try {
    // Generate a clean file path: folder/year/month/uuid-filename.ext
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const uuid = uuidv4();
    const extension = fileName.split(".").pop() || "bin";
    
    // Clean filename from special characters but keep it readable if possible
    const cleanFileName = fileName
        .replace(/[^a-zA-Z0-9.-]/g, "")
        .substring(0, 50);

    const key = `${folder}/${year}/${month}/${uuid}-${cleanFileName}`;

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
    });

    await R2.send(command);

    return {
      success: true,
      url: `${R2_PUBLIC_URL_PREFIX}/${key}`,
      key: key
    };

  } catch (error) {
    console.error("R2 Upload Error:", error);
    return { success: false, error: "Cloud storage upload failed." };
  }
}
