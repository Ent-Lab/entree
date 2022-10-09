import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { DatabaseModule } from 'src/database/database.module';
import { MasterDatabaseService } from 'src/database/master.database.service';

import { UsefulModule } from 'src/useful/useful.module';
import { UsefulService } from 'src/useful/useful.service';
import { BullModule } from '@nestjs/bull';
import { JwtModule, JwtService } from '@nestjs/jwt';
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
    BullModule.forRoot({
      redis: {
        host: '54.180.96.37',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'message-queue',
    }),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    MasterDatabaseService,
    DatabaseService,
    UsefulService,
    JwtStrategy,
  ],
})
export class UserModule {}
