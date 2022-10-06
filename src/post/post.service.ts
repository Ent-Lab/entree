import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostRepository } from './post.repository';
import { UsefulService } from '../useful/useful.service';
@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly userfulService: UsefulService
  ) {}

  async create(createPostDto: CreatePostDto) {
    try {
      createPostDto.code = await this.userfulService.genCode();
      return this.postRepository.create(createPostDto);
    } catch (error) {
      throw error;
    }
  }

  findAll() {
    try {
      return this.postRepository.selectAll();
    } catch (error) {
      throw error;
    }
  }

  findOne(code: string) {
    try {
      return this.postRepository.selectByCode(code);
    } catch (error) {
      throw error;
    }
  }

  findByUser(userCode: string) {
    try {
      return this.postRepository.selectByUser(userCode);
    } catch (error) {
      throw error;
    }
  }

  update(code: string, updatePostDto: UpdatePostDto) {
    try {
    } catch (error) {
      throw error;
    }
  }

  remove(code: string) {
    return `This action removes a #${code} post`;
  }
}
