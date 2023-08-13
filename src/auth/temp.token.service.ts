import { Injectable } from '@nestjs/common';
import { tempToken } from 'src/common/tempToken';

@Injectable()
export class TempTokenService {
  generateToken(content: string, timespan: number): string {
    const token = tempToken(timespan, content);
    return token;
  }

  verifyToken(time: string, content: string, token: string, maxdiff: number) {
    const currentTime = new Date().getTime();
    const providedTime = parseInt(time);
    const timeDifference = currentTime - providedTime;

    if (Math.abs(timeDifference) > maxdiff) {
      return false;
    }

    const generatedToken = tempToken(providedTime, content);
    return generatedToken === token;
  }
}
