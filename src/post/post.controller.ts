import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
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

  @Get(':code')
  findOne(@Param('code') code: string) {
    return this.postService.findOne(code);
  }

  @Get(':user')
  findByUser(@GetUser() user: GetUserDto) {
    console.log(user);
    return this.postService.findByUser(user.code);
  }

  @Patch(':code')
  update(@Param('code') code: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(code, updatePostDto);
  }

  @Delete(':code')
  remove(@Param('code') code: string) {
    return this.postService.remove(code);
  }
}
