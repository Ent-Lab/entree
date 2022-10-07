import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { MasterDatabaseService } from './database/master.database.service';

@Processor('message-queue')
export class MessageConsumer {
  constructor(
    @InjectQueue('message-queue') private queue: Queue,
    private readonly masterDatabaseService: MasterDatabaseService
  ) {}
  @Process('send-query')
  async sendQuery(job: Job<string>) {
    const con = await this.masterDatabaseService.getConnection();
    try {
      const sql: string = job.data;
      await con.query(sql);
    } catch (error) {
      Logger.debug(error);
      throw error;
    } finally {
      con.release();
    }
  }

  @Process('send-transaction')
  async sendTransaction(jobs: Job<string>[]) {
    const con = await this.masterDatabaseService.getConnection();
    try {
      await con.beginTransaction();
      for (const i in jobs) {
        const sql = jobs[i].data;
        await con.query(sql);
        console.log(sql);
      }
      con.commit();
      console.log('Job Counts', await this.queue.getJobCounts());
    } catch (error) {
      Logger.debug(error);
      throw error;
    } finally {
      con.release();
    }
  }
}
