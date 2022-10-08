import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Injectable, NotFoundException } from '@nestjs/common';
import { SlaveDatabaseService } from 'src/database/slave.database.service';
import { CreatePostDto } from './dto/create-post.dto';
import { GetPostDto } from './dto/get-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostRepository {
  constructor(
    @InjectQueue('message-queue') private queue: Queue,
    private readonly slaveDatabaseService: SlaveDatabaseService
  ) {}

  async create(createPostDto: CreatePostDto) {
    try {
      const { code, title, contents, fk_user_code } = createPostDto;
      await this.queue.add(
        'send-query',
        `
        INSERT INTO post
        (code, title, contents, fk_user_code)
        VALUES
        ('${code}', '${title}', '${contents}', '${fk_user_code}');
        `
      );
      return true;
    } catch (error) {
      throw error;
    }
  }

  async selectAll(): Promise<any[]> {
    try {
      return this.slaveDatabaseService.query(`
        select * from post;
        `);
    } catch (error) {
      throw error;
    }
  }

  async selectByCode(code: string): Promise<any> {
    try {
      const row = await this.slaveDatabaseService.query(`
        select * from post where code = '${code}';
        `);
      return row[0];
    } catch (error) {
      throw error;
    }
  }

  async selectByUser(userCode: string): Promise<any> {
    try {
      const row = this.slaveDatabaseService.query(`
        select * from post where fk_user_code = '${userCode}';
        `);
      return row[0];
    } catch (error) {
      throw error;
    }
  }

  async selectByTitle(title: string): Promise<any> {
    try {
      const row = await this.slaveDatabaseService.query(`
        select * from post where title like '%${title}%';
        `);
      return row[0];
    } catch (error) {
      throw error;
    }
  }

  async update(code: string, updatePostDto: UpdatePostDto) {
    try {
      this.queue.add(
        'send-query',
        `
        UPDATE post
        SET (title='${updatePostDto.title}', contents='${updatePostDto.contents}')
        WHERE code='${code}';
        `
      );
    } catch (error) {
      throw error;
    }
  }

  async delete() {
    try {
    } catch (error) {
      throw error;
    }
  }
}
