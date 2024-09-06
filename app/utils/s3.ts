import { json } from "@remix-run/node";
import AWS from "aws-sdk";
import { nanoid } from "nanoid";

const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_SECRET_ACCESS_REGION,
  apiVersion: process.env.AWS_SECRET_VERSION,
};

const S3 = new AWS.S3(awsConfig);

export const uploadImage = async ({
  imageFile,
  image,
}: {
  imageFile: any;
  image: Buffer;
}) => {
  try {
    if (!image) return json({ ok: false, error: "No image" }, { status: 400 });

    const uniqueFileName = `uploads/${nanoid()}_${imageFile.name}`;

    const params = {
      Bucket: "ks-web-bucket",
      Key: uniqueFileName,
      Body: image,
      ACL: "public-read",
      ContentEncoding: "base64",
      ContentType: imageFile.type,
    };

    return S3.upload(params).promise();
  } catch (error) {
    return new Error(`Error ${error}`);
  }
};
