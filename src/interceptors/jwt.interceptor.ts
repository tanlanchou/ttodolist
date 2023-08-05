import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements NestInterceptor {
  constructor(private readonly jwtService: JwtService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    if (!!request.user) {
      return next.handle();
    }
    const token = request.headers.authorization?.replace('Bearer ', '');

    if (token) {
      const decodedToken = this.jwtService.decode(token);
      if (decodedToken) {
        request.user = decodedToken['user'];
      }
    }

    return next.handle();
  }
}
