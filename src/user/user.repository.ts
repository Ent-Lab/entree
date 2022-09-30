import { Injectable } from '@nestjs/common';
import { MasterDatabaseService } from 'src/database/master.database.service';
import { SlaveDatabaseService } from 'src/database/slave.database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { query } from 'express';
import { UserVo } from './vo/user.vo';
/**
 * 유저 레포지토리입니다.
 */
@Injectable()
export class UserRepository {
  constructor(
    /**
     * BULL 메시지 큐를 사용하여 DB에 비동기 프로세스로 접근합니다.
     */
    @InjectQueue('message-queue') private queue: Queue,
    private readonly slaveDatabaseService: SlaveDatabaseService,
    private readonly masterDatabaseService: MasterDatabaseService
  ) {}
  /**
   * 유저 생성 쿼리
   * @param createUserDto
   * @returns true
   */
  async create(createUserDto: CreateUserDto): Promise<boolean> {
    try {
      const code: string = createUserDto.code;
      const login_type: string = createUserDto.login_type;
      const email: string = createUserDto.email;
      const password: string = createUserDto.password;
      await this.queue.add(
        'send-query',
        `INSERT INTO user (code, login_type, email, password) VALUES ('${code}','${login_type}', '${email}', '${password}');`
      );
      return true;
    } catch (error) {
      throw error;
    }
  }

  async selectAll(): Promise<object[]> {
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

  async selectOneById(id: number): Promise<object | boolean> {
    try {
      const userData = await this.slaveDatabaseService.query(`
      SELECT 
      id, code, login_type, email, password, created_time, updated_time FROM
      user
      WHERE
      id=${id}
      ;
      `);
      if (userData.length === 0) {
        return false;
      }
      return userData[0];
    } catch (error) {
      throw error;
    }
  }

  async selectOneByEmail(email: string): Promise<object | boolean> {
    try {
      const userData = await this.slaveDatabaseService.query(`
      SELECT 
      id, code, login_type, email, password, created_time, updated_time FROM
      user
      WHERE
      email='${email}'
      ;
      `);
      if (userData.length === 0) {
        return false;
      }
      return userData[0];
    } catch (error) {
      throw error;
    }
  }

  async updateOneById(
    id: number,
    updateUserDto: UpdateUserDto
  ): Promise<boolean> {
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

  async deleteOneById(id: number): Promise<boolean> {
    try {
      await this.queue.add(
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
