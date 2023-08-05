import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/connect/user.entity';

@Injectable()
export class JwtCommonService {
  private readonly logger = new Logger(JwtService.name);

  constructor(private readonly jwtService: JwtService) {}

  generateToken(user: User): string {
    const payload = { user };
    const token = this.jwtService.sign(payload);
    this.logger.log(`Generated token for user ${user.id}`);
    return token;
  }

  verifyToken(token: string): any {
    try {
      const payload = this.jwtService.verify(token);
      this.logger.log(`Verified token: ${token}`);
      return payload;
    } catch (error) {
      this.logger.error(`Failed to verify token: ${token}`);
      return null;
    }
  }

  decodeToken(token: string): any {
    try {
      const payload = this.jwtService.decode(token);
      this.logger.log(`Decode token: ${token}, result: ${payload}`);
      return payload;
    } catch (error) {
      this.logger.error(`Failed to decode token: ${token}`);
      return null;
    }
  }

  refreshToken(token: string): string {
    const payload = this.verifyToken(token);
    if (payload) {
      delete payload.exp;
      const newToken = this.jwtService.sign(payload);
      this.logger.log(`Refreshed token for user ${payload.userId}`);
      return newToken;
    }
    this.logger.error(`Failed to refresh token for token: ${token}`);
    return null;
  }
}
