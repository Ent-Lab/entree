import {
  createPool,
  FieldPacket,
  OkPacket,
  Pool,
  PoolConnection,
  ResultSetHeader,
  RowDataPacket,
} from 'mysql2/promise';
/**
 * database service interface for pool connection & replication
 */
export interface DatabaseService {
  getConnection(): Promise<PoolConnection>;
  query(
    sql: string
  ): Promise<
    | RowDataPacket[]
    | RowDataPacket[][]
    | OkPacket
    | OkPacket[]
    | ResultSetHeader
  >;
}
