import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { DatabaseService } from 'src/database/database.service';
import { GetPostDto } from './dto/get-post.dto';

@Injectable()
export class PostRepository {
  constructor(
    @InjectQueue('message-queue') private queue: Queue,
    private readonly databaseService: DatabaseService
  ) {}

  /**
   * 게시물 생성
   * @param createPostDto
   * @returns
   */
  async create(createPostDto: CreatePostDto) {
    try {
      const { title, contents, fk_user_id, summary, thumbnail } = createPostDto;
      await this.databaseService.query(
        `
        INSERT INTO post
        (title, contents, fk_user_id, summary, thumbnail)
        VALUES
        ('${title}', '${contents}', '${fk_user_id}', '${summary}', '${thumbnail}');
        `
      );
      return true;
    } catch (error) {
      throw error;
    }
  }
  /**
   * 게시물 전체 조회
   * @returns 게시물 목록
   */
  async selectAll(): Promise<GetPostDto[]> {
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

  /**
   * 페이지별 게시물 조회
   * @param page
   * @param perPage
   * @returns 게시물 목록
   */
  async selectList(page: number, perPage: number): Promise<GetPostDto[]> {
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

  /**
   * 게시물 단일 조회
   * @param id
   * @returns
   */
  async selectOne(id: number): Promise<GetPostDto> {
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

  /**
   * 유저별 게시물 조회
   * @param userId
   * @returns
   */
  async selectByUser(userId: number): Promise<GetPostDto> {
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

  /**
   * 게시물 제목으로 검색
   * @param title
   * @returns
   */
  async selectByTitle(title: string): Promise<GetPostDto> {
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

  /**
   * 게시물 수정
   * @param id
   * @param updatePostDto
   * @returns true
   */
  async update(id: number, updatePostDto: UpdatePostDto): Promise<boolean> {
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

  /**
   * 게시물 삭제
   * @param id
   * @returns true
   */
  async delete(id: number): Promise<boolean> {
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
