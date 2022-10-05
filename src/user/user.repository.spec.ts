import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import * as Joi from 'joi';
import { DatabaseModule } from 'src/database/database.module';
import { MasterDatabaseService } from 'src/database/master.database.service';
import { SlaveDatabaseService } from 'src/database/slave.database.service';
import { UsefulModule } from 'src/useful/useful.module';
import { UsefulService } from 'src/useful/useful.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserController } from './user.controller';
import { UserModule } from './user.module';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { UserVo } from './vo/user.vo';

describe('UserRepository', () => {
  let repository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        UsefulModule,
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: `src/config/env/.development.env`,
          validationSchema: Joi.object({
            DB_HOST: Joi.string().required(),
            MASTER_DB_PORT: Joi.string().required(),
            SLAVE_DB_PORT: Joi.string().required(),
            DB_USER: Joi.string().required(),
            DB_PASSWORD: Joi.string().required(),
            DB_NAME: Joi.string().required(),
          }),
        }),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            secret: configService.get('JWT_SECRET_KEY'),
          }),
        }),
        BullModule.forRoot({
          redis: {
            host: '43.201.8.8',
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
        SlaveDatabaseService,
        UsefulService,
        JwtStrategy,
      ],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);

    const users: Array<object> = [];
  });
});
