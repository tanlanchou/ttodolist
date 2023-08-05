import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtAuthModule } from './auth/jwt-auth.module';
import { LoggerService } from './common/logger.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './connect/user.entity';
import { JwtAuthGuard } from './guard/jwt.auth.guard';
import { AuthGuard } from './guard/auth.guard';
import { UserController } from './user/user.controller';
import { ListController } from './list/list.controller';
import { List } from './connect/list.entity';
import { ListService } from './list/list.service';
import { UserService } from './user/user.service';
import { WeChatService } from './wx/api';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpService } from './common/http';
import { JwtCommonService } from './auth/jwt.common.service';
import { TypeOrmConfigService } from './connect/typeof.config';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskCronService } from './corn/task';
import { MailService } from './common/mail.service';

@Module({
  imports: [
    JwtAuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${!!process.env.NODE_ENV ? 'dev' : 'prod'}`,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, List]),
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController, UserController, ListController],
  providers: [
    HttpService,
    ConfigService,
    AppService,
    LoggerService,
    JwtCommonService,
    ListService,
    UserService,
    WeChatService,
    JwtAuthModule,
    JwtAuthGuard,
    AuthGuard,
    TaskCronService,
    MailService,
  ],
})
export class AppModule {}
