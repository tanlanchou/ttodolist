const key = 'ADNJAKUI!&@#(@!KDKSMDJ@!*';
import * as crypto from 'crypto-js';

export const tempToken = function (timeStr: number, otherStr: string) {
  const input = timeStr + otherStr + key;
  const hashedValue = crypto.MD5(input).toString(crypto.enc.Hex);
  return hashedValue;
};
