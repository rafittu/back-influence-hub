import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { AppError } from '../errors/Error';

@Injectable()
export class S3BucketService {
  private s3: AWS.S3;
  private readonly bucketName = process.env.AWS_S3_BUCKET_NAME;

  constructor() {
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
    this.s3 = new AWS.S3();
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    const fileKey = `${Date.now()}_${file.originalname}`;

    const uploadParams = {
      Bucket: this.bucketName,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    try {
      const { Location } = await this.s3.upload(uploadParams).promise();

      return Location;
    } catch (error) {
      throw new AppError('aws-s3-bucket.uploadImage', 500, error.message);
    }
  }

  async deleteImage(fileUrl: string): Promise<null> {
    const url = new URL(fileUrl);
    const fileKey = url.pathname.substring(1);

    const params = {
      Bucket: this.bucketName,
      Key: fileKey,
    };

    try {
      await this.s3.deleteObject(params).promise();
      return null;
    } catch (error) {
      throw new AppError('aws-s3-bucket.deleteImage', 500, error.message);
    }
  }
}
