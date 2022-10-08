import { Logger, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { MasterDatabaseService } from './master.database.service';
import { SlaveDatabaseService } from './slave.database.service';

@Module({
  providers: [MasterDatabaseService, SlaveDatabaseService, DatabaseService],
})
export class DatabaseModule {}
