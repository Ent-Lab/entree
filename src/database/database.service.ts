import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createPool, Pool } from 'mysql2/promise';

@Injectable()
export class DatabaseService {
  private masterPool: Pool;
  private slavePool: Pool;
  constructor(private readonly configService: ConfigService) {
    try {
      this.masterPool = createPool({
        host: this.configService.get('DB_HOST'),
        port: this.configService.get('MASTER_DB_PORT'),
        user: this.configService.get('DB_USER'),
        password: this.configService.get('DB_PASSWORD'),
        database: this.configService.get('DB_NAME'),
        connectionLimit: 2,
        connectTimeout: 5000,
      });

      this.slavePool = createPool({
        host: this.configService.get('DB_HOST'),
        port: this.configService.get('SLAVE_DB_PORT'),
        user: this.configService.get('DB_USER'),
        password: this.configService.get('DB_PASSWORD'),
        database: this.configService.get('DB_NAME'),
        connectionLimit: 2,
        connectTimeout: 5000,
      });
    } catch (error) {
      throw error;
    }
  }
  // Single Query
  async query(sql: string, option?: string) {
    const conn =
      option === 'w'
        ? await this.masterPool.getConnection()
        : await this.slavePool.getConnection();
    try {
      const [row, fields] = await conn.query(sql);
      return row;
    } catch (error) {
      throw error;
    } finally {
      conn.commit();
    }
  }
}
