import { FileValidator } from '@nestjs/common';
import { getCsvMimeTypeRegex } from './csv-upload.utils';

export class CsvFileTypeValidator extends FileValidator {
  constructor() {
    super({});
  }

  isValid(file?: Express.Multer.File): boolean {
    if (!file?.mimetype) {
      return false;
    }

    return getCsvMimeTypeRegex().test(file.mimetype);
  }

  buildErrorMessage(file?: Express.Multer.File): string {
    const currentType = file?.mimetype ?? 'unknown';
    return `Validation failed (current file type is ${currentType}, expected type is /text\\/csv|application\\/vnd\\.ms-excel|text\\/plain/)`;
  }
}
