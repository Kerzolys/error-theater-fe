import { ObjectCannedACL, PutObjectCommand } from "@aws-sdk/client-s3";
import s3Client from "../yandex-cloud/yc";

export const uploadToYandex = async (folderName: string, file: File) => {
  const arrayBuffer = await file.arrayBuffer();

  const params = {
    Bucket: import.meta.env.VITE_YANDEX_BUCKET_NAME!,
    Key: `${folderName}/${file.name}`,
    Body: new Uint8Array(arrayBuffer),
    ContentType: file.type,
    ChecksumAlgorithm: undefined,
    ACL: ObjectCannedACL.public_read,
  };

  const command = new PutObjectCommand(params);

  try {
    await s3Client.send(command);
    return `https://storage.yandexcloud.net/${import.meta.env.VITE_YANDEX_BUCKET_NAME}/${folderName}/${file.name}`;
  } catch (err) {
    console.error("Error uploading file:", err);
    throw err;
  }
};
