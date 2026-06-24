import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class UploadService {
  constructor(config: ConfigService) {
    cloudinary.config({
      cloud_name: config.get('cloudinary.cloudName'),
      api_key: config.get('cloudinary.apiKey'),
      api_secret: config.get('cloudinary.apiSecret'),
    });
  }

  uploadImage(file: Express.Multer.File): Promise<{ url: string }> {
    if (!file) throw new BadRequestException('No file provided');

    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'foodtech-voting/candidates', resource_type: 'image' },
        (error, result) => {
          if (error || !result) return reject(new BadRequestException(error?.message ?? 'Upload failed'));
          resolve({ url: result.secure_url });
        },
      );
      stream.end(file.buffer);
    });
  }
}
