import { Injectable } from '@nestjs/common';
import { MasterDatabaseService } from 'src/database/master.database.service';
import { SlaveDatabaseService } from 'src/database/slave.database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue, Job } from 'bull';

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
      console.log(await this.queue.getJobCounts());
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

  update(id: number, updateUserDto: UpdateUserDto) {
    try {
    } catch (error) {}
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
