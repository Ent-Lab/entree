import { Injectable, NotFoundException } from '@nestjs/common';
import { MasterDatabaseService } from 'src/database/master.database.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { DatabaseService } from 'src/database/database.service';
import { GetUserDto } from './dto/get-user.dto';
/**
 * 유저 레포지토리입니다.
 */
@Injectable()
export class UserRepository {
  constructor(
    @InjectQueue('message-queue') private queue: Queue,
    private readonly masterDatabaseService: MasterDatabaseService,
    private readonly databaseService: DatabaseService
  ) {}
  /**
   * 유저 생성 쿼리
   * @param createUserDto
   * @returns true
   */
  async create(createUserDto: CreateUserDto): Promise<boolean> {
    try {
      const login_type: string = createUserDto.login_type;
      const email: string = createUserDto.email;
      const password: string = createUserDto.password;
      const role: string = createUserDto.role;
      await this.databaseService.query(
        `INSERT INTO user (login_type, email, password, role) VALUES ('${login_type}', '${email}', '${password}', '${role}');`,
        'w'
      );
      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 유저 전체 조회
   * @returns 유저 목록
   */
  async selectAll(): Promise<Array<GetUserDto>> {
    try {
      return this.databaseService.query(
        `
      SELECT 
      id, login_type, email, password, role, created_time, updated_time FROM
      user;
      `,
        'r'
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * 유저 Id로 조회
   * @param code
   * @returns 유저
   */
  async selectOneByCode(id: number): Promise<GetUserDto> {
    console.log(id);
    try {
      const userData = await this.databaseService.query(
        `
      SELECT *
      FROM user
      WHERE id=${id}
      ;
      `
      );
      return userData[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * 유저 이메일로 조회
   * @param email
   * @returns 이메일
   */
  async selectOneByEmail(email: string): Promise<GetUserDto> {
    try {
      const userData = await this.databaseService.query(`
      SELECT 
      id, login_type, email, password, role, created_time, updated_time FROM
      user
      WHERE
      email='${email}'
      ;
      `);
      return userData[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * 유저 정보 갱신
   * @param id
   * @param updateUserDto
   * @returns true
   */
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
      if (selectForUpdate === undefined) {
        con.rollback();
        throw new NotFoundException('존재하지 않는 유저입니다.');
      }
      const login_type = updateUserDto.login_type
        ? updateUserDto.login_type
        : selectForUpdate.login_type;
      const email = updateUserDto.email
        ? updateUserDto.email
        : selectForUpdate.email;
      const password = updateUserDto.password
        ? updateUserDto.password
        : selectForUpdate.password;
      await con.query(`
        UPDATE user
        SET login_type='${login_type}', email='${email}', password='${password}'
        WHERE id=${id};
        `);
      con.commit();
      return true;
    } catch (error) {
      throw error;
    } finally {
      con.release();
    }
  }

  /**
   * 유저 삭제
   * @param id
   * @returns true
   */
  async deleteOneById(id: number): Promise<boolean> {
    try {
      await this.databaseService.query(
        `
      DELETE FROM user 
      WHERE id=${id};
      `
      );
      return true;
    } catch (error) {
      throw error;
    }
  }
}
