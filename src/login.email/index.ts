import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Param,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import {
  RegisterDto,
  LoginDto,
  ChangePasswordDto,
  ForgetPasswordDto,
} from './login.dto';
import { User } from 'src/connect/user.entity';
import { UserStatus } from 'src/common/enmu';
import { MailService } from 'src/common/mail.service';
import { TempTokenService } from 'src/auth/temp.token.service';
import { ConfigService } from '@nestjs/config';
import * as resultHelper from 'src/common/resultHelper';
import { JwtCommonService } from 'src/auth/jwt.common.service';
import { TempTokenGuard } from 'src/guard/temp.token.guard';
import { ValidateEmailPipe } from 'src/pipe/validate.email.pipe';
import { JwtAuthGuard } from 'src/guard/jwt.auth.guard';
import { JwtInterceptor } from 'src/interceptors/jwt.interceptor';

@Controller('login')
export class LoginEmailController {
  constructor(
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly tempTokenService: TempTokenService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtCommonService,
  ) {}

  @Post('email/register')
  async register(@Body() registerDto: RegisterDto) {
    const existUser = await this.userService.findUserByEmail(registerDto.email);
    if (existUser !== null) {
      return resultHelper.error(500, '邮箱已经注册过了，如果是您注册的请登录');
    }

    try {
      const user = new User();
      user.email = registerDto.email;
      user.pwd = registerDto.password;
      user.status = UserStatus.noVerification;

      const newUser = await this.userService.createUser(user);
      const curTimeSpan = new Date().getTime();
      const token = this.tempTokenService.generateToken(
        user.name + user.createTime,
        curTimeSpan,
      );
      const url = `${this.configService.get('HOST')}/login/email/confirm/${
        newUser.id
      }/${curTimeSpan}/${token}`;

      const template = MailService.getEmailTemplate(user.email, url);
      await this.mailService.sendEmail(
        user.email,
        template.subject,
        template.content,
      );
      return resultHelper.success();
    } catch (error) {
      return resultHelper.error(null, error.message, 500);
    }
  }

  @Post('email/resend')
  async resendEmail(@Body('email', ValidateEmailPipe) email: string) {
    try {
      const user = await this.userService.findUserByEmail(email);
      if (!user) return resultHelper.RES401();

      const curTimeSpan = new Date().getTime();
      const token = this.tempTokenService.generateToken(
        user.name + user.createTime,
        curTimeSpan,
      );

      const url = `http://${this.configService.get(
        'HOST',
      )}/login/email/confirm/${user.id}/${curTimeSpan}/${token}`;

      const template = MailService.getEmailTemplate(email, url); // 根据需要修改邮件模板的生成方法
      await this.mailService.sendEmail(
        email,
        template.subject,
        template.content,
      );

      return resultHelper.success();
    } catch (error) {
      return resultHelper.error(null, error.message, 500);
    }
  }

  @UseGuards(TempTokenGuard)
  @Get('email/confirm/:id/:timeSpan/:token')
  async confirm(@Param('id') id: number) {
    try {
      await this.userService.updateUserStatus(id, UserStatus.normal);
      return resultHelper.success();
    } catch (error) {
      return resultHelper.error(null, error.message, 500);
    }
  }

  @Post('email/login')
  async login(@Body() loginDto: LoginDto) {
    try {
      const user = await this.userService.findUserByEmailPWD(
        loginDto.email,
        loginDto.password,
      );
      if (!user) return resultHelper.RES404();

      if (user.status === UserStatus.disable) {
        return resultHelper.error(500, `用户已被禁用`);
      } else if (user.status === UserStatus.noVerification) {
        return resultHelper.error(500, `用户没有激活`);
      }
      const newUser = await this.userService.updateUserActiveTime(user.id);
      const token = this.jwtService.generateToken(newUser);

      return resultHelper.success(token, '登录成功');
    } catch (error) {
      return resultHelper.error(null, error.message, 500);
    }
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(JwtInterceptor)
  @Post('email/change/password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() request,
  ) {
    const userId = request.user && request.user.id;
    if (!userId) return resultHelper.RES401();

    try {
      const user = await this.userService.findUserById(userId);
      if (!user) {
        return resultHelper.RES404();
      }

      if (user.pwd !== changePasswordDto.oldPassword) {
        return resultHelper.error(500, '原有密码不正确');
      }

      user.pwd = changePasswordDto.newPassword;
      await this.userService.updateUser(user.id, user);

      return resultHelper.success();
    } catch (error) {
      return resultHelper.error(null, error.message, 500);
    }
  }

  @Post('email/forget/send')
  async sendForgetEmail(@Body('email', ValidateEmailPipe) email: string) {
    try {
      const user = await this.userService.findUserByEmail(email);
      if (!user) return resultHelper.RES401();

      const curTimeSpan = new Date().getTime();
      const token = this.tempTokenService.generateToken(
        user.name + user.createTime,
        curTimeSpan,
      );

      const url = `http://${this.configService.get(
        'HOST',
      )}/login/email/reset/password/${user.id}/${curTimeSpan}/${token}`;

      const template = MailService.getForgetEmailTemplate(email, url); // 你需要创建一个相应的邮件模板生成方法
      await this.mailService.sendEmail(
        email,
        template.subject,
        template.content,
      );

      return resultHelper.success();
    } catch (error) {
      return resultHelper.error(null, error.message, 500);
    }
  }

  @UseGuards(TempTokenGuard)
  @Post('email/reset/password/:id/:timeSpan/:token')
  async resetPassword(
    @Param('id') id: number,
    @Body() forgetPasswordDto: ForgetPasswordDto,
  ) {
    try {
      const user = await this.userService.findUserById(id);
      if (!user) return resultHelper.RES401();

      user.pwd = forgetPasswordDto.password;
      await this.userService.updateUser(id, user);
      return resultHelper.success();
    } catch (error) {
      return resultHelper.error(null, error.message, 500);
    }
  }
}
