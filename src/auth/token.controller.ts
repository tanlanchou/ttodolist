import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtCommonService } from './jwt.common.service';
import { AuthGuard } from '../guard/auth.guard';
import { UserService } from 'src/user/user.service';

@UseGuards(AuthGuard)
@Controller('token')
export class TokenController {
  constructor(
    private readonly jwtService: JwtCommonService,
    private readonly userService: UserService,
  ) {}

  @Get('generate/:userId')
  async generateToken(@Param('userId') userId: string) {
    const user = await this.userService.findUserByWxId(userId);
    if (!user) throw new Error('can not found user');
    const token = this.jwtService.generateToken(user);
    return { token };
  }

  @Get('verify/:token')
  verifyToken(@Param('token') token: string) {
    const payload = this.jwtService.verifyToken(token);
    if (payload) {
      return { valid: true, payload };
    }
    return { valid: false };
  }

  @Get('refresh/:token')
  refreshToken(@Param('token') token: string) {
    const newToken = this.jwtService.refreshToken(token);
    if (newToken) {
      return { newToken };
    }
    return { message: 'Invalid token' };
  }
}
