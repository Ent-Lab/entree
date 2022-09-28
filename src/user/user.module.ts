import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { DatabaseModule } from 'src/database/database.module';
import { MasterDatabaseService } from 'src/database/master.database.service';
import { SlaveDatabaseService } from 'src/database/slave.database.service';
import { UsefulModule } from 'src/useful/useful.module';
import { UsefulService } from 'src/useful/useful.service';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    DatabaseModule,
    UsefulModule,
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
  ],
})
export class UserModule {}
