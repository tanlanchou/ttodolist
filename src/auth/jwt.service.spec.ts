import { Test, TestingModule } from '@nestjs/testing';
import { JwtCommonService } from './jwt.common.service';
import { JwtModule } from '@nestjs/jwt';
import { User } from 'src/connect/user.entity';

function getUser(): User {
  const user = new User();
  user.id = 999;
  user.activeTime = new Date();
  user.createTime = new Date();
  user.name = 'test1';
  user.status = 1;
  user.wxId = 'test00001';
  return user;
}

describe('JwtCommonService', () => {
  let jwtService: JwtCommonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'your-secret-key', // 替换为您自己的密钥
          signOptions: {
            expiresIn: '1h', // 设置令牌的过期时间
          },
        }),
      ],
      providers: [JwtCommonService],
    }).compile();

    jwtService = module.get<JwtCommonService>(JwtCommonService);
  });

  describe('generateToken', () => {
    it('should generate a valid token', () => {
      const user = getUser();
      const token = jwtService.generateToken(user);
      expect(token).toBeDefined();
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const user = getUser();
      const token = jwtService.generateToken(user);
      const payload = jwtService.verifyToken(token);
      expect(payload).toBeDefined();
    });

    it('should return null for an invalid token', () => {
      const token = 'invalid-token';
      const payload = jwtService.verifyToken(token);
      expect(payload).toBeNull();
    });
  });

  describe('refreshToken', () => {
    it('should refresh a valid token', () => {
      const user = getUser();
      const token = jwtService.generateToken(user);
      const newToken = jwtService.refreshToken(token);
      expect(newToken).toBeDefined();
    });

    it('should return null for an invalid token', () => {
      const token = 'invalid-token';
      const newToken = jwtService.refreshToken(token);
      expect(newToken).toBeNull();
      // 可以在这里进行其他的断言，验证无效令牌的处理
    });
  });
});
