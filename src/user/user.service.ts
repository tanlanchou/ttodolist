import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../connect/user.entity';
import { UserStatus } from 'src/common/enmu';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(userData: Partial<User>): Promise<User> {
    if (!userData.activeTime) userData.activeTime = new Date();
    if (!userData.createTime) userData.createTime = new Date();
    if (!userData.name) userData.name = this.generateRandomName();
    if (!userData.status) userData.status = UserStatus.disable;

    const newUser = this.userRepository.create(userData);
    return this.userRepository.save(newUser);
  }

  private generateRandomName(): string {
    const prefix = 'User';
    const randomSuffix = Math.floor(Math.random() * 100000).toString();
    const username = prefix + randomSuffix.padStart(5, '0');
    return username;
  }

  async findAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findUserById(id: number): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findUserByEmailPWD(email: string, pwd: string) {
    return this.userRepository.findOne({ where: { email, pwd } });
  }

  /**
   * @description 通过wxId查询是否已经有用户了。
   * @param wxId string
   * @returns Promise<User | undefined>
   */
  async findUserByWxId(wxId: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { wxId } });
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async updateUser(
    id: number,
    userData: Partial<User>,
  ): Promise<User | undefined> {
    await this.userRepository.update(id, userData);
    return this.userRepository.findOne({ where: { id } });
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await this.userRepository.delete(id);
    return result.affected > 0;
  }

  async updateUserStatus(
    id: number,
    status: number,
  ): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      return undefined;
    }

    user.status = status;
    return this.userRepository.save(user);
  }

  async updateUserActiveTime(id: number): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      return undefined;
    }

    user.activeTime = new Date(); // 使用服务器当前时间
    return this.userRepository.save(user);
  }
}
