import { Injectable, Logger } from '@nestjs/common';
import {
  createPool,
  FieldPacket,
  OkPacket,
  Pool,
  PoolConnection,
  ResultSetHeader,
  RowDataPacket,
} from 'mysql2/promise';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from './database.interface';

@Injectable()
export class SlaveDatabaseService implements DatabaseService {
  private pool: Pool;
  constructor(private readonly configService: ConfigService) {
    try {
      this.pool = createPool({
        host: this.configService.get('DB_HOST'),
        port: this.configService.get('SLAVE_DB_PORT'),
        user: this.configService.get('DB_USER'),
        password: this.configService.get('DB_PASSWORD'),
        database: this.configService.get('DB_NAME'),
        connectionLimit: 2,
        connectTimeout: 5000,
      });
      Logger.log('create master database pool', 'CreatePool');
    } catch (error) {
      throw error;
    }
  }

  async getConnection(): Promise<PoolConnection> {
    try {
      return this.pool.getConnection();
    } catch (error) {
      throw error;
    }
  }

  async query(sql: string): Promise<object[]> {
    try {
      const conn: PoolConnection = await this.pool.getConnection();
      const data: [
        (
          | RowDataPacket[]
          | RowDataPacket[][]
          | OkPacket
          | OkPacket[]
          | ResultSetHeader
        ),
        FieldPacket[]
      ] = await conn.query(sql);
      conn.release();
      const rowData: object[] = [];
      for (const i in data[0]) {
        rowData.push(data[0][i]);
      }
      return rowData;
    } catch (error) {
      throw error;
    }
  }

  async transaction(sqls: string[]): Promise<boolean> {
    const conn = await this.getConnection();
    try {
      await conn.beginTransaction();
      sqls.forEach(async (sql) => {
        await conn.query(sql);
        console.log(sql);
      });
      return true;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.commit();
    }
  }

  async end(): Promise<void> {
    try {
      return this.pool.end();
    } catch (error) {
      throw error;
    }
  }
}
