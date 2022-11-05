import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostRepository } from './post.repository';
import { UsefulService } from '../useful/useful.service';
import { GetPostDto } from './dto/get-post.dto';
import { RequestCreatePostDto } from './dto/request-create.post.dto';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly userfulService: UsefulService
  ) {}

  async create(userId: number, requestCreatePostDto: RequestCreatePostDto) {
    try {
      const { title, contents } = requestCreatePostDto;
      const fk_user_id = userId;
      const createPostDto: CreatePostDto = {
        title,
        contents,
        fk_user_id,
      };
      return this.postRepository.create(createPostDto);
    } catch (error) {
      throw error;
    }
  }
  async findAll() {
    try {
      return this.postRepository.selectAll();
    } catch (error) {
      throw error;
    }
  }

  async findList(page: number, perPage: number) {
    try {
      return this.postRepository.selectList(page, perPage);
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number): Promise<GetPostDto> {
    try {
      return this.postRepository.selectOne(id);
    } catch (error) {
      throw error;
    }
  }

  async findByUser(userId: number): Promise<GetPostDto> {
    try {
      return this.postRepository.selectByUser(userId);
    } catch (error) {
      throw error;
    }
  }

  async update(userId: number, id: number, updatePostDto: UpdatePostDto) {
    try {
      const post: GetPostDto = await this.postRepository.selectOne(id);
      if (post.fk_user_id !== userId) {
        throw new ForbiddenException('자신의 정보만 수정할 수 있습니다.');
      }
      updatePostDto.title = updatePostDto.title
        ? updatePostDto.title
        : post.title;
      updatePostDto.contents = updatePostDto.contents
        ? updatePostDto.contents
        : post.contents;
      return this.postRepository.update(id, updatePostDto);
    } catch (error) {
      throw error;
    }
  }

  remove(id: number) {
    return this.postRepository.delete(id);
  }
}
