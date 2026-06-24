import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { VotersService } from './voters.service';
import { CreateVoterDto } from './dto/create-voter.dto';
import { BulkImportDto } from './dto/bulk-import.dto';
import { UpdateVoterDto } from './dto/update-voter.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { AdminAuthGuard } from '../common/guards/admin-auth.guard';

@ApiTags('voters')
@Controller('voters')
export class VotersController {
  constructor(private readonly votersService: VotersService) {}

  @Post()
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register a single voter — generates password and emails credentials (Admin)' })
  @ApiCreatedResponse({ description: 'Voter created; credentials emailed via queue' })
  create(@Body() dto: CreateVoterDto) {
    return this.votersService.create(dto);
  }

  @Post('bulk-import')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Bulk import voters from a JSON array (Admin)' })
  @ApiCreatedResponse({ description: 'Returns created/failed counts; credentials queued' })
  bulkImport(@Body() dto: BulkImportDto) {
    return this.votersService.bulkImport(dto);
  }

  @Post('bulk-import-csv')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'CSV file with columns: matricNumber, fullName, level, email',
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @ApiOperation({ summary: 'Bulk import voters from a CSV file (Admin)' })
  @ApiCreatedResponse({ description: 'Returns created/failed counts and any row-level errors' })
  bulkImportCSV(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /text\/csv|application\/vnd\.ms-excel|text\/plain/ }),
        ],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.votersService.bulkImportCSV(file);
  }

  @Get()
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all registered voters (Admin)' })
  @ApiOkResponse({ description: 'Array of voters' })
  findAll() {
    return this.votersService.findAll();
  }

  @Get(':id')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a voter by ID (Admin)' })
  @ApiParam({ name: 'id', example: 'clx1voter111' })
  findOne(@Param('id') id: string) {
    return this.votersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update voter details (Admin)' })
  @ApiParam({ name: 'id', example: 'clx1voter111' })
  @ApiOkResponse({ description: 'Updated voter record' })
  update(@Param('id') id: string, @Body() dto: UpdateVoterDto) {
    return this.votersService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a voter (Admin)' })
  @ApiParam({ name: 'id', example: 'clx1voter111' })
  @ApiOkResponse({ schema: { example: { success: true, message: 'Voter deleted successfully' } } })
  remove(@Param('id') id: string) {
    return this.votersService.remove(id);
  }

  @Post('forgot-password')
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  @ApiOperation({ summary: 'Reset voter password — rate-limited 3/min; always returns same response' })
  @ApiOkResponse({ schema: { example: { success: true, message: 'If the account exists, a new password has been sent.' } } })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.votersService.forgotPassword(dto);
  }
}
