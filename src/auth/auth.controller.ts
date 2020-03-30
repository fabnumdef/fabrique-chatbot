import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { ResetPasswordDto } from "@dto/reset-password.dto";

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('reset-password/:email')
  @ApiOperation({ summary: 'Generate reset password token & send email' })
  async forgotPassword(@Param('email') email: string): Promise<any> {
    return await this._authService.sendEmailPasswordToken(email);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password & send mail' })
  async resetPassword(@Body() resetPassword: ResetPasswordDto): Promise<any> {
    return await this._authService.resetPassword(resetPassword);
  }
}
