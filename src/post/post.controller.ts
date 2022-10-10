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
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUserDto } from 'src/user/dto/get-user.dto';
import { GetUser } from 'src/custom.decorator';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequestCreatePostDto } from './dto/request-create.post.dto';

@ApiTags('게시물 API')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @ApiOperation({
    summary: '게시물 작성 API',
  })
  @ApiCreatedResponse({
    status: 201,
    description: '게시물 작성 완료',
    schema: {
      example: {
        success: true,
      },
    },
  })
  @UseGuards(AuthGuard())
  create(
    @GetUser() user: GetUserDto,
    @Body() requestCreatePostDto: RequestCreatePostDto
  ) {
    return this.postService.create(user.code, requestCreatePostDto);
  }

  @Get()
  @ApiOperation({
    summary: '게시물 목록 조회 API',
  })
  @ApiCreatedResponse({
    status: 201,
    description: '게시물 목록 조회 완료, 페이지별 조회 가능',
    schema: {
      example: {
        success: true,
      },
    },
  })
  findAll(@Query('page') page?: number, @Query('perPage') perPage?: number) {
    if (!page) {
      return this.postService.findAll();
    }

    return this.postService.findList(page, perPage);
  }

  @Get(':id')
  @ApiOperation({
    summary: '게시물 조회 API',
  })
  @ApiCreatedResponse({
    status: 201,
    description: '게시물 조회 완료',
    schema: {
      example: {
        success: true,
      },
    },
  })
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
