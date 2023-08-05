import { Injectable } from '@nestjs/common';
import { HttpService } from '../common/http';
import { ConfigService } from '@nestjs/config';
import { WeChatLoginReturn } from '../interface/weChat.login.return';

const baseUrl = `https://api.weixin.qq.com`;

@Injectable()
export class WeChatService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getSession(jsCode: string): Promise<WeChatLoginReturn> {
    const url = baseUrl + '/sns/jscode2session';
    const appId = this.configService.get<string>('WECHAT_APP_ID');
    const appSecret = this.configService.get<string>('WECHAT_APP_SECRET');
    const grantType = this.configService.get<string>('authorization_code');

    const params = {
      appid: appId,
      secret: appSecret,
      js_code: jsCode,
      grant_type: grantType,
    };

    const session = await this.httpService.get<any>(url, { params });
    return session;
  }
}
