import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../connect/user.entity';
import { UserStatus, WeChatErrorCode } from '../common/enmu';
import { WeChatService } from '../wx/api';
import { JwtCommonService } from 'src/auth/jwt.common.service';
import { ValidateEmailPipe } from 'src/pipe/validate.email.pipe';
import * as resultHelper from 'src/common/resultHelper';
import { AuthGuard } from 'src/guard/auth.guard';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly weChatService: WeChatService,
    private readonly jwtService: JwtCommonService,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  async getAllUsers() {
    const users = this.userService.findAllUsers();
    return resultHelper.success(users);
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  async getUserById(@Param('id') id: number) {
    const user = this.userService.findUserById(id);
    return resultHelper.success(user);
  }

  @Post()
  async createWxUser(wxId: string) {
    const reuslt = await this.weChatService.getSession(wxId);

    if (reuslt.errcode === WeChatErrorCode.InvalidCode) {
      throw new Error('Invalid code');
    }

    if (reuslt.errcode === WeChatErrorCode.MinuteQuotaLimit) {
      throw new Error('API minute quota reached limit. Retry next minute');
    }

    if (reuslt.errcode === WeChatErrorCode.CodeBlocked) {
      throw new Error('Code blocked');
    }

    if (reuslt.errcode === WeChatErrorCode.SystemError) {
      throw new Error('System error');
    }

    const newUser = new User();
    newUser.wxId = reuslt.unionid;
    newUser.status = UserStatus.wxUser;

    const u = this.userService.createUser(newUser);
    return resultHelper.success(u);
  }

  /**
   * 通过微信ID登录或者创建用户
   * @param wxId String
   * @returns UserReturn
   */
  @Post('/login/wx/:id')
  async loginWxUserByUnionid(@Param('id') id: string) {
    const wxId = id;
    const existUser = await this.userService.findUserByWxId(wxId);
    if (!!existUser) {
      //更新用户激活时间
      existUser.activeTime = new Date();
      this.userService.updateUser(existUser.id, existUser);
      const token = this.jwtService.generateToken(existUser);

      return {
        userName: existUser.name,
        token: token,
      };
    }

    const newUser = new User();
    newUser.wxId = wxId;
    newUser.status = UserStatus.wxUser;

    try {
      const u = await this.userService.createUser(newUser);
      const token = this.jwtService.generateToken(newUser);

      return resultHelper.success({
        userName: u.name,
        token: token,
      });
    } catch (ex) {
      return resultHelper.error(500, ex.message);
    }
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async updateUser(@Param('id') id: number, @Body() userData: Partial<User>) {
    try {
      const user = this.userService.updateUser(id, userData);
      return resultHelper.success(user);
    } catch (error) {
      return resultHelper.error(500, error.message);
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteUser(@Param('id') id: number) {
    try {
      this.userService.deleteUser(id);
      return resultHelper.success();
    } catch (error) {
      return resultHelper.error(500, error.message);
    }
  }

  @Put(':id/status')
  @UseGuards(AuthGuard)
  async updateUserStatus(
    @Param('id') id: number,
    @Body('status') status: number,
  ): Promise<User | undefined> {
    return this.userService.updateUserStatus(id, status);
  }

  @Put(':id/active/time')
  @UseGuards(AuthGuard)
  async updateUserActiveTime(
    @Param('id') id: number,
  ): Promise<User | undefined> {
    return this.userService.updateUserActiveTime(id);
  }

  @Get('check/email/:email')
  @UsePipes(ValidateEmailPipe)
  async checkEmail(@Param('email') email: string) {
    const user = await this.userService.findUserByEmail(email);
    return !user;
  }
}
