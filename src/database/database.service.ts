import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createPool, Pool, PoolConnection } from 'mysql2/promise';

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

  async getConnection(option?: string): Promise<PoolConnection> {
    try {
      if (option === 'r') {
        return this.slavePool.getConnection();
      }
      return this.masterPool.getConnection();
    } catch (error) {
      throw error;
    }
  }
  // Single Query
  async query(sql: string, option?: string) {
    const conn = await this.getConnection(option);
    try {
      const rowArray: Array<any> = [];
      const [row, fields] = await conn.query(sql);
      for (const i in row) {
        rowArray.push(row[i]);
      }
      if (option === 'r' && rowArray.length === 0) {
        throw new NotFoundException("data doesn't exist.");
      }
      return rowArray;
    } catch (error) {
      throw error;
    } finally {
      conn.release();
    }
  }

  //Transaction
  async transaction(sqls: string[]) {
    const conn = await this.getConnection('w');
    try {
      await conn.beginTransaction();
      sqls.forEach(async (sql) => {
        const [row, fields] = await conn.query(sql);
        Logger.log(row);
      });
      await conn.commit();
      Logger.log('COMMIT TRANSACTION', 'SUCCESS');
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
      Logger.log('CONNECTION RELEASE', 'SUCCESS');
    }
  }
}
