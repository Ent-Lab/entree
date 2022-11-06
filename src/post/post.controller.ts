import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
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
import { GetPostDto } from './dto/get-post.dto';

@ApiTags('게시물 API')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  /**
   * 게시물 작성
   * @param user
   * @param requestCreatePostDto
   * @returns
   */
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
    try {
      return this.postService.create(user.id, requestCreatePostDto);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Get()
  @ApiOperation({
    summary: '게시물 목록 조회 API',
  })
  @ApiCreatedResponse({
    status: 201,
    description: '게시물 목록 조회 완료, 페이지별 조회 가능',
    type: Array<GetPostDto>,
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
    type: GetPostDto,
  })
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Get(':user')
  @ApiOperation({
    summary: '유저별 게시물 목록 조회 API',
  })
  @ApiCreatedResponse({
    status: 201,
    description: '유저 게시물 목록 조회 완료',
    type: GetPostDto,
  })
  findByUser(@GetUser() user: GetUserDto) {
    return this.postService.findByUser(+user.id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard())
  @ApiOperation({
    summary: '게시물 업데이트 API',
  })
  @ApiCreatedResponse({
    status: 201,
    description: '게시물 업데이트 완료',
    type: GetPostDto,
  })
  async update(
    @GetUser() user: GetUserDto,
    @Param('id') id: number,
    @Body() updatePostDto: UpdatePostDto
  ) {
    try {
      return this.postService.update(user.id, id, updatePostDto);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @ApiOperation({
    summary: '게시물 삭제 API',
  })
  @ApiCreatedResponse({
    status: 201,
    description: '게시물 삭제 완료',
  })
  remove(@Param('id') id: number) {
    return this.postService.remove(+id);
  }
}
