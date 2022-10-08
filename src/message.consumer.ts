import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { DatabaseService } from './database/database.service';
import { MasterDatabaseService } from './database/master.database.service';

@Processor('message-queue')
export class MessageConsumer {
  constructor(
    @InjectQueue('message-queue') private queue: Queue,
    private readonly masterDatabaseService: MasterDatabaseService,
    private readonly databaseService: DatabaseService
  ) {}
  @Process('send-query')
  async sendQuery(job: Job<string>) {
    try {
      const sql = job.data;
      await this.databaseService.query(sql, 'w');
    } catch (error) {
      Logger.debug(error);
    }
  }

  @Process('send-transaction')
  async sendTransaction(job: Job<string[]>) {
    try {
      const sqls: string[] = job.data;
      await this.databaseService.transaction(sqls);
      return true;
    } catch (error) {
      Logger.debug(error);
    }
  }
}
