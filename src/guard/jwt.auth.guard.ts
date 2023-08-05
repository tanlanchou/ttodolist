import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtCommonService } from '../auth/jwt.common.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtCommonService: JwtCommonService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace('Bearer ', '');

    if (!token || !this.jwtCommonService.verifyToken(token)) {
      return false;
    }

    return true;
  }
}
