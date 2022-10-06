import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostRepository } from './post.repository';
import { UsefulService } from '../useful/useful.service';
import { UserRepository } from 'src/user/user.repository';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly userfulService: UsefulService,
    private readonly userRepository: UserRepository
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

  findByUser(code: string) {
    try {
      console.log(code);
    } catch (error) {
      throw error;
    }
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
