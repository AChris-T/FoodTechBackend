import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

export const CLOUDINARY = 'CLOUDINARY';

export const cloudinaryProvider = {
  provide: CLOUDINARY,
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    return cloudinary.config({
      cloud_name: config.get('cloudinary.cloudName'),
      api_key: config.get('cloudinary.apiKey'),
      api_secret: config.get('cloudinary.apiSecret'),
    });
  },
};
