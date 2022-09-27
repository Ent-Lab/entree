import { Module } from '@nestjs/common';
import { MasterDatabaseService } from './master.database.service';
import { SlaveDatabaseService } from './slave.database.service';

@Module({
  providers: [
    MasterDatabaseService,
    SlaveDatabaseService,
  ],
  exports: [DatabaseModule],
})
export class DatabaseModule {}