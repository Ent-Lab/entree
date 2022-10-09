import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUserDto } from 'src/user/dto/get-user.dto';
import { GetUser } from 'src/custom.decorator';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(AuthGuard())
  create(@GetUser() user: GetUserDto, @Body() createPostDto: CreatePostDto) {
    createPostDto.fk_user_code = user.code;
    return this.postService.create(createPostDto);
  }

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Get(':user')
  findByUser(@GetUser() user: GetUserDto) {
    return this.postService.findByUser(user.code);
  }

  @Patch(':id')
  @UseGuards(AuthGuard())
  async update(
    @GetUser() user: GetUserDto,
    @Param('id') id: number,
    @Body() updatePostDto: UpdatePostDto
  ) {
    try {
      return this.postService.update(user.code, id, updatePostDto);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.postService.remove(+id);
  }
}
