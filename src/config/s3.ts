// Import necessary modules from AWS SDK
import {
  S3Client,
  //   DeleteObjectsCommand,
  GetObjectCommand,
  //   ListObjectsV2Command,
  HeadObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import fs from "fs";

// Initialize an S3 client with provided credentials
const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  // Specify the AWS region from environment variables
  credentials: {
    accessKeyId: process.env.AWS_ACCESSKEYID!, // Access key ID from environment variables
    secretAccessKey: process.env.AWS_SECRETACCESSKEY!, // Secret access key from environment variables
  },
});

// Export folder names for easier reference
export const awsFolderNames = {
  sub1: "sub1",
  sub2: "sub2",
};

export const uploadFileToAws = async (fileName: string, filePath: string) => {
  try {
    // Configure the parameters for the S3 upload
    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: fs.createReadStream(filePath),
    };

    // Upload the file to S3
    await s3Client.send(new PutObjectCommand(uploadParams)).then(() => {
      // Delete the file from the local filesystem after successful upload
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Error deleting file:", err);
          } else {
            console.log("File deleted successfully.");
          }
        });
      }
    });
  } catch (err) {
    console.error("Error ", err);
    return "error";
  }
};

export const createPresignedUrlWithClient = async (
  key: string,
  ContentType?: string,
  ContentLength?: number
) => {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    ContentType,
    ContentLength,
  });
  return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
};

// Export function to get a signed URL for downloading a file from AWS S3
export const getFileUrlFromAws = async (
  fileName: string,
  expireTime = null
) => {
  try {
    // Check if the file is available in the AWS S3 bucket
    const check = await isFileAvailableInAwsBucket(fileName);

    if (check) {
      // Create a GetObjectCommand to retrieve the file from S3
      const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME, // Specify the AWS S3 bucket name
        Key: fileName, // Specify the file name
      });

      // Generate a signed URL with expiration time if provided
      if (expireTime != null) {
        const url = await getSignedUrl(s3Client, command, {
          expiresIn: expireTime,
        });
        return url;
      } else {
        // Generate a signed URL without expiration time
        const url = await getSignedUrl(s3Client, command);
        return url;
      }
    } else {
      // Return an error message if the file is not available in the bucket
      return "error";
    }
  } catch (err) {
    // Handle any errors that occur during the process
    console.log("error ::", err);
    return "error";
  }
};

export const isFileAvailableInAwsBucket = async (fileName: string) => {
  try {
    // Check if the object exists
    await s3Client.send(
      new HeadObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
      })
    );

    // If the object exists, return true
    return true;
  } catch (err) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((err as any).name === "NotFound") {
      // File not found in AWS bucket, return false
      return false;
    } else {
      // Handle other errors
      return false;
    }
  }
};

export const deleteFileFromAws = async (fileName: string) => {
  try {
    // Configure the parameters for the S3 upload
    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
    };
    // Upload the file to S3
    await s3Client.send(new DeleteObjectCommand(uploadParams)).then(() => {});
  } catch (err) {
    console.error("Error ", err);
    return "error";
  }
};
