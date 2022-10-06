import { Injectable, NotFoundException } from '@nestjs/common';
import { MasterDatabaseService } from 'src/database/master.database.service';
import { SlaveDatabaseService } from 'src/database/slave.database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
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
      const role: number = createUserDto.role;
      await this.queue.add(
        'send-query',
        `INSERT INTO user (code, login_type, email, password, role) VALUES ('${code}','${login_type}', '${email}', '${password}', ${role});`
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

  /**
   * 유저 Id로 조회
   * @param id
   * @returns 유저
   */
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

  /**
   * 유저 이메일로 조회
   * @param email
   * @returns 이메일
   */
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
      return userData;
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
        throw new NotFoundException('존재하지 않는 유저입니다.');
      }
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

  /**
   * 유저 삭제
   * @param id
   * @returns true
   */
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
