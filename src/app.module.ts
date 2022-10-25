import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { BullModule } from '@nestjs/bull';
import { UsefulModule } from './useful/useful.module';
import * as Joi from 'joi';
import { MessageConsumer } from './message.consumer';
import { MasterDatabaseService } from './database/master.database.service';
import { PostModule } from './post/post.module';
import { DatabaseService } from './database/database.service';
import { MaterialModule } from './material/material.module';

const ENV = process.env.NODE_ENV;
Logger.debug(ENV);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `src/config/env/.${ENV}.env`,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production').required(),
        DB_HOST: Joi.string().required(),
        MASTER_DB_PORT: Joi.string().required(),
        SLAVE_DB_PORT: Joi.string().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
      }),
    }),
    UserModule,
    DatabaseModule,
    UsefulModule,
    BullModule.forRoot({
      redis: {
        host: '54.180.96.37',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'message-queue',
    }),
    PostModule,
    MaterialModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    MessageConsumer,
    MasterDatabaseService,
    DatabaseService,
  ],
})
export class AppModule {}
