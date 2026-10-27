import "server-only";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "./env";

let s3: S3Client | null = null;

function client() {
  if (!s3) {
    s3 = new S3Client({
      region: "auto",
      endpoint: `https://${env("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId: env("R2_ACCESS_KEY_ID"), secretAccessKey: env("R2_SECRET_ACCESS_KEY") },
    });
  }
  return s3;
}

const bucket = () => env("R2_BUCKET");

/** URL para o navegador enviar o arquivo direto ao R2, sem passar pelo servidor. */
export function putUrl(key: string, contentType: string) {
  return getSignedUrl(client(), new PutObjectCommand({ Bucket: bucket(), Key: key, ContentType: contentType }), {
    expiresIn: 60 * 60,
  });
}

/** URL temporária de leitura. Com downloadName, o navegador baixa o arquivo com esse nome. */
export function getUrl(key: string, expiresIn = 60 * 60 * 6, downloadName?: string) {
  return getSignedUrl(
    client(),
    new GetObjectCommand({
      Bucket: bucket(),
      Key: key,
      ResponseContentDisposition: downloadName ? `attachment; filename="${downloadName.replace(/"/g, "")}"` : undefined,
    }),
    { expiresIn },
  );
}

export function photoKeys(galleryId: string, photoId: string, ext: string) {
  const base = `galleries/${galleryId}`;
  return {
    key_full: `${base}/full/${photoId}.${ext}`,
    key_web: `${base}/web/${photoId}.jpg`,
    key_thumb: `${base}/thumb/${photoId}.jpg`,
  };
}
