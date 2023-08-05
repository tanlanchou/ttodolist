import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../connect/user.entity';
import { AuthGuard } from '../guard/auth.guard';
import { UserStatus, WeChatErrorCode } from '../common/enmu';
import { WeChatService } from '../wx/api';
import { JwtCommonService } from 'src/auth/jwt.common.service';

/**
 * 用户登录或者创建返回值
 */
interface UserReturn {
  userName: string;
  token: string;
}

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly weChatService: WeChatService,
    private readonly jwtService: JwtCommonService,
  ) {}

  @Get()
  //@UseGuards(AuthGuard)
  async getAllUsers(): Promise<User[]> {
    return this.userService.findAllUsers();
  }

  @Get('/:id')
  //@UseGuards(AuthGuard)
  async getUserById(@Param('id') id: number): Promise<User | undefined> {
    return this.userService.findUserById(id);
  }

  @Post()
  async createWxUser(wxId: string): Promise<User> {
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
    newUser.name = this.generateRandomName(); // 生成随机名称
    newUser.createTime = new Date(); // 自动填写创建时间
    newUser.activeTime = new Date(); // 暂未激活，设置为 null
    newUser.status = UserStatus.wxUser;

    return this.userService.createUser(newUser);
  }

  /**
   * 通过微信ID登录或者创建用户
   * @param wxId String
   * @returns UserReturn
   */
  @Post('/login/wx/:id')
  async loginWxUserByUnionid(@Param('id') id: string): Promise<UserReturn> {
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
    newUser.name = this.generateRandomName(); // 生成随机名称
    newUser.createTime = new Date(); // 自动填写创建时间
    newUser.activeTime = new Date(); // 暂未激活，设置为 null
    newUser.status = UserStatus.wxUser;

    try {
      const u = await this.userService.createUser(newUser);
      const token = this.jwtService.generateToken(newUser);

      return {
        userName: u.name,
        token: token,
      };
    } catch (ex) {}
  }

  private generateRandomName(): string {
    const prefix = 'User';
    const randomSuffix = Math.floor(Math.random() * 100000).toString();
    const username = prefix + randomSuffix.padStart(5, '0');
    return username;
  }

  @Put(':id')
  //@UseGuards(AuthGuard)
  async updateUser(
    @Param('id') id: number,
    @Body() userData: Partial<User>,
  ): Promise<User | undefined> {
    return this.userService.updateUser(id, userData);
  }

  @Delete(':id')
  //@UseGuards(AuthGuard)
  async deleteUser(@Param('id') id: number): Promise<boolean> {
    return this.userService.deleteUser(id);
  }

  @Put(':id/status')
  //@UseGuards(AuthGuard)
  async updateUserStatus(
    @Param('id') id: number,
    @Body('status') status: number,
  ): Promise<User | undefined> {
    return this.userService.updateUserStatus(id, status);
  }

  @Put(':id/active-time')
  //@UseGuards(AuthGuard)
  async updateUserActiveTime(
    @Param('id') id: number,
  ): Promise<User | undefined> {
    return this.userService.updateUserActiveTime(id);
  }

  @Get('test')
  async test() {
    return 'test11111111111111111';
  }
}
