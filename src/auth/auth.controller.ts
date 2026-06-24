import { Controller, Post, Get, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiUnauthorizedResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentVoter } from '../common/decorators/current-voter.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Voter login — returns accessToken for use in Authorization header' })
  @ApiOkResponse({
    schema: {
      example: {
        success: true,
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        voter: { fullName: 'John Doe', matricNumber: 'UG/22/01234', email: 'john@stu.ui.edu.ng' },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  async login(@Body() dto: LoginDto) {
    const { token, voter } = await this.authService.login(dto);
    return { success: true, accessToken: token, voter };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current voter profile (Voter)' })
  @ApiOkResponse({ description: 'Voter profile' })
  me(@CurrentVoter() voter: any) {
    return this.authService.getProfile(voter.id);
  }
}
