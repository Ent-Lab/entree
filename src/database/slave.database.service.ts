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
import { v4 } from 'uuid';
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

  async query(
    sql: string
  ): Promise<
    | RowDataPacket[]
    | RowDataPacket[][]
    | OkPacket
    | OkPacket[]
    | ResultSetHeader
  > {
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
      return data[0];
    } catch (error) {
      throw error;
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
