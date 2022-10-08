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

@Injectable()
export class MasterDatabaseService {
  private pool: Pool;
  constructor(private readonly configService: ConfigService) {
    try {
      this.pool = createPool({
        host: this.configService.get('DB_HOST'),
        port: this.configService.get('MASTER_DB_PORT'),
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
      const conn = await this.pool.getConnection();
      Logger.log('Get Pool connection', 'SUCCESS');
      return conn;
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
    const conn: PoolConnection = await this.getConnection();
    try {
      const [data, fields] = await conn.query(sql);
      return data;
    } catch (error) {
      throw error;
    } finally {
      conn.release();
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
