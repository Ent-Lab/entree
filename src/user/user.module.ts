import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { DatabaseModule } from 'src/database/database.module';

import { UsefulModule } from 'src/useful/useful.module';
import { UsefulService } from 'src/useful/useful.service';
import { BullModule } from '@nestjs/bull';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseService } from 'src/database/database.service';

@Module({
  imports: [
    DatabaseModule,
    UsefulModule,
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET_KEY'),
      }),
    }),
    BullModule.registerQueue({
      name: 'message-queue',
    }),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    DatabaseService,
    UsefulService,
    JwtStrategy,
  ],
})
export class UserModule {}
