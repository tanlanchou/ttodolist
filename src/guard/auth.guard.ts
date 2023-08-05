import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import * as crypto from 'crypto';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const encryptionString = request.header('X-Encryption-String');
    const timestamp = request.header('X-Timestamp');

    // 在这里替换为您的固定加密字符串
    const fixedEncryptionString = 'your-fixed-encryption-string';

    // 在这里进行MD5加密
    const encryptedValue = crypto
      .createHash('md5')
      .update(`${fixedEncryptionString}${timestamp}`)
      .digest('hex');

    // 验证加密字符串是否相等
    const isAuthorized = encryptedValue === encryptionString;

    return isAuthorized;
  }
}
