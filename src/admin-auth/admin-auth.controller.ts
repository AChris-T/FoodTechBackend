import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiCreatedResponse, ApiUnauthorizedResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminAuthService } from './admin-auth.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AdminAuthGuard } from '../common/guards/admin-auth.guard';

@ApiTags('admin-auth')
@Controller('admin-auth')
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin login — returns accessToken for use in Authorization header' })
  @ApiOkResponse({
    schema: {
      example: {
        success: true,
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        admin: { name: 'Super Admin', email: 'admin@votingplatform.com' },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Invalid email or password' })
  async login(@Body() dto: AdminLoginDto) {
    const { token, admin } = await this.adminAuthService.login(dto);
    return { success: true, accessToken: token, admin };
  }

  @Post('create-admin')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new admin (requires active admin Bearer token)' })
  @ApiCreatedResponse({ description: 'New admin account created; share credentials out-of-band' })
  createAdmin(@Body() dto: CreateAdminDto) {
    return this.adminAuthService.createAdmin(dto);
  }
}
