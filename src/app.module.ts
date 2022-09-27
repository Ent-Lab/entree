import { CacheModule, Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MasterDatabaseService } from './database/master.database.service';
import { SlaveDatabaseService } from './database/slave.database.service';
import { DatabaseModule } from './database/database.module';
import * as Joi from 'joi';



const ENV = process.env.NODE_ENV;
Logger.debug(ENV);

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: `src/config/env/.${ENV}.env`,
    validationSchema: Joi.object({
      NODE_ENV: Joi.string().valid('development', 'production').required(),
      DB_HOST: Joi.string().required(),
      MASTER_DB_PORT: Joi.string().required(),
      SLAVE_DB_PORT:Joi.string().required(),
      DB_USER: Joi.string().required(),
      DB_PASSWORD: Joi.string().required(),
      DB_NAME: Joi.string().required(),
    }),
  }),UserModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService, MasterDatabaseService, SlaveDatabaseService],
})
export class AppModule {}
