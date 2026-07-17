import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";


export const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function uploadImageToR2(params: {
  buffer: Buffer;
  contentType: string;
  objectKey: string;
}): Promise<{ key: string; url: string }> {
  const { buffer, contentType, objectKey } = params;

  const key = objectKey;

  await r2.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    }),
  );

  const url = `${process.env.R2_PUBLIC_URL}/${key}`;

  return { key, url };
}



//   const extension = contentType.split("/")[1] ?? "webp";
//`${keyPrefix}/${randomUUID()}.${extension}`;//
 //`${keyPrefix}/${randomUUID()}.${extension}`;//