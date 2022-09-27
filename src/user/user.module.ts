import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { DatabaseModule } from 'src/database/database.module';
import { MasterDatabaseService } from 'src/database/master.database.service';
import { SlaveDatabaseService } from 'src/database/slave.database.service';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    MasterDatabaseService,
    SlaveDatabaseService,
  ],
})
export class UserModule {}
