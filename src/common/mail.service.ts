import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    const mailConfig = {
      service: this.configService.get<string>('MAIL_SERVICE'),
      port: this.configService.get<number>('MAIL_PORT'),
      secure: true,
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    };

    this.transporter = nodemailer.createTransport(mailConfig);
  }

  static getEmailTemplate(email, url) {
    return {
      subject: `你好，${email}, 欢迎注册，离注册成功还差最后一步`,
      content: `
      <h2>欢迎注册！</h2>
      <p>亲爱的用户，感谢您注册我们的服务。请点击以下链接以完成注册：</p>
      <p><a href="${url}">点击这里完成注册</a></p>
      <p>如果链接无法点击，请将以下链接复制并粘贴到浏览器地址栏中：</p>
      <p>${url}</p>
      <p>如果您没有进行过注册，请忽略此邮件。</p>
      <p>谢谢！</p>`,
    };
  }

  static getForgetEmailTemplate(email, url) {
    return {
      subject: `你好，${email}, 重置密码邮件`,
      content: `
      <h2>重置密码</h2>
      <p>亲爱的用户，您正在进行重置密码操作。请点击以下链接以重置您的密码：</p>
      <p><a href="${url}">点击这里重置密码</a></p>
      <p>如果链接无法点击，请将以下链接复制并粘贴到浏览器地址栏中：</p>
      <p>${url}</p>
      <p>如果您没有进行过重置密码操作，请忽略此邮件。</p>
      <p>谢谢！</p>`,
    };
  }

  async sendEmail(to: string, subject: string, content: string): Promise<void> {
    const mailOptions = {
      from: this.configService.get<string>('MAIL_FROM'),
      to,
      subject,
      text: content,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
