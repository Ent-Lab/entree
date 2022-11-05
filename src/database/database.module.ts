import { Logger, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { MasterDatabaseService } from './master.database.service';

@Module({
  providers: [MasterDatabaseService, DatabaseService],
})
export class DatabaseModule {}
