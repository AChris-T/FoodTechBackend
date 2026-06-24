import { Controller, Post, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody, ApiCreatedResponse } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { AdminAuthGuard } from '../common/guards/admin-auth.guard';

@ApiTags('upload')
@ApiBearerAuth()
@UseGuards(AdminAuthGuard)
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a candidate photo to Cloudinary (Admin)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary', description: 'Image file (jpg/png/webp, max 5MB)' },
      },
    },
  })
  @ApiCreatedResponse({ description: 'Returns Cloudinary secure_url', schema: { example: { url: 'https://res.cloudinary.com/...' } } })
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.uploadImage(file);
  }
}
