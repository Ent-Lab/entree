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
    try {
      const { code, login_type, email, password } = createUserDto;
      return this.masterDatabaseService.query(`
      INSERT INTO user 
      (code, login_type, email, password) 
      VALUES (${code},${login_type}, ${email}, ${password});
      `);
    } catch (error) {
      throw error;
    }
  }

  async selectAll() {
    try {
      return this.slaveDatabaseService.query(`
      SELECT 
      id, code, login_type, email, password, created_time, updated_time FROM
      user;
      `);
    } catch (error) {
      throw error;
    }
  }

  selectOneById(id: number) {
    try {
      return this.slaveDatabaseService.query(`
      SELECT 
      id, code, login_type, email, password, created_time, updated_time FROM
      user
      WHERE
      id=${id}
      ;
      `);
    } catch (error) {
      throw error;
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
