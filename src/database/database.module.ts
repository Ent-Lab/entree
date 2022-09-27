import { Logger, Module } from '@nestjs/common';
import { MasterDatabaseService } from './master.database.service';
import { SlaveDatabaseService } from './slave.database.service';

@Module({
  providers: [MasterDatabaseService, SlaveDatabaseService],
})
export class DatabaseModule {}
