import { Injectable } from '@nestjs/common';
import { MasterDatabaseService } from 'src/database/master.database.service';
import { SlaveDatabaseService } from 'src/database/slave.database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  createPool,
  FieldPacket,
  OkPacket,
  Pool,
  PoolConnection,
  ResultSetHeader,
  RowDataPacket,
} from 'mysql2/promise';

@Injectable()
export class UserRepository {
  constructor(
    private readonly slaveDatabaseService: SlaveDatabaseService,
    private readonly masterDatabaseService: MasterDatabaseService
  ) {}
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async selectAll() {
    const con: PoolConnection =
      await this.masterDatabaseService.getConnection();
    try {
      const users: [
        (
          | RowDataPacket[]
          | RowDataPacket[][]
          | OkPacket
          | OkPacket[]
          | ResultSetHeader
        ),
        FieldPacket[]
      ] = await con.query(`
      SELECT * FROM user;
      `);
      return users[0];
    } catch (error) {
      throw error;
    } finally {
      con.release();
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
