import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class PostRepository {
  constructor(
    @InjectQueue('message-queue') private queue: Queue,
    private readonly databaseService: DatabaseService
  ) {}

  async create(createPostDto: CreatePostDto) {
    try {
      const { title, contents, fk_user_id } = createPostDto;
      console.log(createPostDto);
      await this.databaseService.query(
        `
        INSERT INTO post
        (code, title, contents, fk_user_code)
        VALUES
        ('${title}', '${contents}', '${fk_user_id}');
        `
      );
      return true;
    } catch (error) {
      throw error;
    }
  }

  async selectAll() {
    try {
      return this.databaseService.query(
        `
      SELECT * FROM post;
      `,
        'r'
      );
    } catch (error) {
      throw error;
    }
  }

  async selectList(page: number, perPage: number): Promise<any[]> {
    try {
      //
      const startPoint = (page - 1) * perPage;
      const endPoint = perPage;
      return this.databaseService.query(
        `
        select * from post LIMIT ${startPoint}, ${endPoint};
        `,
        'r'
      );
    } catch (error) {
      throw error;
    }
  }

  async selectOne(id: number): Promise<any> {
    try {
      const row = await this.databaseService.query(
        `
        select * from post where id = '${id}';
        `,
        'r'
      );
      return row[0];
    } catch (error) {
      throw error;
    }
  }

  async selectByUser(userId: number): Promise<any> {
    try {
      const row = this.databaseService.query(
        `
        select * from post where fk_user_id = '${userId}';
        `,
        'r'
      );
      return row[0];
    } catch (error) {
      throw error;
    }
  }

  async selectByTitle(title: string): Promise<any> {
    try {
      const row = await this.databaseService.query(
        `
        select * from post where title like '%${title}%';
        `,
        'r'
      );
      return row[0];
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    try {
      await this.databaseService.query(
        `
        UPDATE post
        SET (title='${updatePostDto.title}', contents='${updatePostDto.contents}')
        WHERE id=${id};
        `
      );
      return true;
    } catch (error) {
      throw error;
    }
  }

  async delete(id: number) {
    await this.databaseService.query(`
    DELETE FROM post
    WHERE id=${id};
    `);
    return true;
    try {
    } catch (error) {
      throw error;
    }
  }
}
