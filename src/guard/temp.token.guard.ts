import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { TempTokenService } from 'src/auth/temp.token.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TempTokenGuard implements CanActivate {
  constructor(
    private readonly tempTokenService: TempTokenService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const id = +request.params.id;
    const timeSpan = +request.params.timeSpan;
    const token = request.params.token;

    if (!id || !timeSpan || !token) {
      return false;
    }

    try {
      const user = await this.userService.findUserById(id);
      if (!user) {
        return false;
      }

      const caleToken = this.tempTokenService.generateToken(
        user.name + user.createTime,
        timeSpan,
      );

      if (caleToken === token) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }
}
