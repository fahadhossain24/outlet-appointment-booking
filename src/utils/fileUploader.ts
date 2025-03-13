// import fs from 'fs';
// import path from 'path';
// import { FileArray, UploadedFile } from 'express-fileupload';
// import CustomError from '../app/errors';

// interface FileUploader {
//     (files: FileArray, directory: string, imageName: string): Promise<string | string[]>;
// }

// const fileUploader: FileUploader = async (files, directory, imageName) => {
//     // check the file
//     if (!files || Object.keys(files).length === 0) {
//         throw new CustomError.NotFoundError('No files were uploaded!');
//     }

//     const folderPath = path.join('uploads', directory);

//     // Ensure the directory exists, if not, create it
//     if (!fs.existsSync(folderPath)) {
//         fs.mkdirSync(folderPath, { recursive: true });
//     }

//     // check one image or two image
//     if (!Array.isArray(files[imageName])) {
//         const file = files[imageName] as UploadedFile;
//         const fileName = file.name;
//         const filePath = path.join(folderPath, fileName);
//         await file.mv(filePath);

//         return filePath;
//     } else if (files[imageName].length > 0) {
//         // Handle multiple file uploads
//         const filePaths: string[] = [];
//         for (const item of files[imageName] as UploadedFile[]) {
//             const fileName = item.name;
//             const filePath = path.join(folderPath, fileName);
//             await item.mv(filePath);
//             filePaths.push(filePath); // Collect all file paths
//         }

//         return filePaths;
//     } else {
//         throw new CustomError.BadRequestError('Invalid file format!');
//     }
// };

// export default fileUploader;

// ............................................upload file to s3 bucket...............................................

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
// import { v4 as uuidv4 } from 'uuid';
import CustomError from '../app/errors';
import { FileArray } from 'express-fileupload';

interface S3Config {
  s3: {
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
    bucket: string;
  };
}

const config: S3Config = {
  s3: {
    region: process.env.REGION || '',
    accessKeyId: process.env.ACCESS_KEY_ID || '',
    secretAccessKey: process.env.SECRET_ACCESS_KEY || '',
    bucket: process.env.BUCKET || '',
  },
};

if (!config.s3.region || !config.s3.accessKeyId || !config.s3.secretAccessKey || !config.s3.bucket) {
  throw new Error('Missing AWS configuration environment variables');
}

const s3 = new S3Client({
  region: config.s3.region,
  credentials: {
    accessKeyId: config.s3.accessKeyId,
    secretAccessKey: config.s3.secretAccessKey,
  },
});

const fileUploader = async (files: FileArray, directory: string, fieldName: string): Promise<string> => {
  if (!files || Object.keys(files).length === 0) {
    throw new CustomError.BadRequestError('No files were uploaded!');
  }

  const file = Array.isArray(files[fieldName]) ? files[fieldName][0] : files[fieldName]; // Handle single or multiple file uploads
  if (!file) {
    throw new CustomError.BadRequestError('No file provided!');
  }

  const fileName = `${directory}_${file.name}`;
  //   console.log('Generated file name:', fileName);

  try {
    const contentType = file.mimetype || 'application/octet-stream'; // Fallback content type
    const uploadParams = {
      Bucket: config.s3.bucket,
      Key: fileName,
      Body: file.data,
      ContentType: contentType,
    };

    // console.log('Upload params:', JSON.stringify(uploadParams));

    const command = new PutObjectCommand(uploadParams);
    await s3.send(command);

    return `https://${config.s3.bucket}.s3.${config.s3.region}.amazonaws.com/${fileName}`;
  } catch (error) {
    console.error('S3 upload error:', error);
    throw new CustomError.BadRequestError('Failed to upload file to S3!');
  }
};

export default fileUploader;
