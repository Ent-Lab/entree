import { Injectable } from '@nestjs/common';
import { MasterDatabaseService } from 'src/database/master.database.service';
import { SlaveDatabaseService } from 'src/database/slave.database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue, Job } from 'bull';
import { query } from 'express';

@Injectable()
export class UserRepository {
  constructor(
    @InjectQueue('message-queue') private queue: Queue,
    private readonly slaveDatabaseService: SlaveDatabaseService,
    private readonly masterDatabaseService: MasterDatabaseService
  ) {}
  async create(createUserDto: CreateUserDto): Promise<boolean> {
    try {
      const code = createUserDto.code;
      const login_type = createUserDto.login_type;
      const email = createUserDto.email;
      const password = createUserDto.password;
      await this.queue.add(
        'send-query',
        `INSERT INTO user (code, login_type, email, password) VALUES ('${code}','${login_type}', '${email}', '${password}');`
      );
      return true;
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

  selectOneById(id: number): Promise<object> {
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

  async updateOneById(id: number, updateUserDto: UpdateUserDto) {
    const con = await this.masterDatabaseService.getConnection();
    try {
      await con.beginTransaction();
      const selectForUpdate = (
        await con.query(
          `SELECT login_type, email, password FROM user WHERE id='${id}' FOR UPDATE;`
        )
      )[0][0];
      const login_type = updateUserDto.login_type
        ? updateUserDto.login_type
        : selectForUpdate.login_type;
      const email = updateUserDto.email
        ? updateUserDto.email
        : selectForUpdate.login_type;
      const password = updateUserDto.password
        ? updateUserDto.password
        : selectForUpdate.password;
      await con.query(`
        UPDATE user
        SET login_type='${login_type}', email='${email}', password='${password}'
        WHERE id='${id}';
        `);
      con.commit();
      return true;
    } catch (error) {
      throw error;
    } finally {
      con.release();
    }
  }

  deleteOneById(id: number) {
    try {
      this.queue.add(
        'send-query',
        `
      DELETE FROM user 
      WHERE id='${id}';
      `
      );
      return true;
    } catch (error) {
      throw error;
    }
  }
}
