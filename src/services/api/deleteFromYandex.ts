import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import s3Client from "../yandex-cloud/yc";

export const deleteFromYandex = async (imageLink: string) => {
  if (imageLink) {
    const url = new URL(imageLink);
    const key = url.pathname.split("/").slice(2).join("/");

    const command = new DeleteObjectCommand({
      Bucket: import.meta.env.VITE_YANDEX_BUCKET_NAME!,
      Key: key,
    });

    await s3Client.send(command);
  }
};
