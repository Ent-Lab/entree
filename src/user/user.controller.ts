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
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetAdmin, GetUser, Roles } from 'src/custom.decorator';
import { GetUserDto } from './dto/get-user.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { RequestCreateUserDto } from './dto/request-create.user.dto';
import { TokenDto } from './dto/token.dto';

@ApiTags('유저 API')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 회원가입
   * @param createUserDto
   * @returns true
   */
  @Post('register')
  @ApiOperation({
    summary: '회원가입 API',
  })
  @ApiCreatedResponse({
    status: 201,
    description: '유저 생성 완료',
    schema: {
      example: {
        success: true,
      },
    },
  })
  async register(
    @Body() requestCreateUserDto: RequestCreateUserDto
  ): Promise<boolean> {
    try {
      const { email, password, login_type, role } = requestCreateUserDto;
      const createUserDto: CreateUserDto = {
        email,
        password,
        login_type,
        role,
      };
      return this.userService.register(createUserDto);
    } catch (error) {
      throw error;
    }
  }

  /**
   * 로그인
   * @param loginDto
   * @returns tokenDto
   */
  @Post('login')
  @ApiOperation({
    summary: '로그인 API',
  })
  @ApiCreatedResponse({
    status: 201,
    description: '유저 생성 완료',
    type: TokenDto,
  })
  async login(@Body() loginDto: LoginDto) {
    try {
      return this.userService.login(loginDto);
    } catch (error) {
      throw error;
    }
  }

  /**
   * 유저 전체 조회(관리자)
   * @param admin
   * @returns
   */
  @Get()
  @ApiOperation({
    summary: '유저 전체 조회 API(관리자)',
  })
  @ApiCreatedResponse({
    status: 200,
    description: '유저 전체 조회 완료',
    type: Array<GetUserDto>,
  })
  @ApiBearerAuth('token')
  @UseGuards(AuthGuard())
  findAll(@GetAdmin() admin: GetUserDto): Promise<object[]> {
    try {
      return this.userService.findAll();
    } catch (error) {
      throw error;
    }
  }

  /**
   * 유저 단일 조회(관리자)
   * @param admin
   * @param id
   * @returns
   */
  @Get('info/:id')
  @ApiOperation({
    summary: '유저 단일 조회 API(관리자)',
  })
  @ApiCreatedResponse({
    status: 200,
    description: '유저 조회 완료',
  })
  @ApiBearerAuth('token')
  @UseGuards(AuthGuard())
  findOne(
    @GetAdmin() admin: GetUserDto,
    @Param('id') id: string
  ): Promise<boolean | object> {
    try {
      return this.userService.findOne(+id);
    } catch (error) {
      throw error;
    }
  }
  /**
   * 내 정보 조회
   * @param user
   * @returns
   */
  @Get('mypage')
  @UseGuards(AuthGuard())
  @ApiOperation({
    summary: '내 정보 조회 API',
  })
  @ApiCreatedResponse({
    status: 200,
    description: '내 정보 조회 완료',
  })
  @ApiBearerAuth('token')
  async findMyInfo(@GetUser() user: GetUserDto) {
    try {
      return this.userService.findOne(user.id);
    } catch (error) {
      throw error;
    }
  }

  /**
   * 내 정보 수정
   * @param user
   * @param updateUserDto
   * @returns
   */
  @Patch()
  @ApiOperation({
    summary: '내 정보 수정 API',
  })
  @ApiCreatedResponse({
    status: 201,
    description: '유저 정보 수정 완료',
    schema: {
      example: {
        success: true,
      },
    },
  })
  @ApiBearerAuth('token')
  @UseGuards(AuthGuard())
  update(
    @GetUser() user: GetUserDto,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<boolean> {
    try {
      return this.userService.update(user.id, updateUserDto);
    } catch (error) {
      throw error;
    }
  }

  /**
   * 내 정보 수정
   * @param admin
   * @param id
   * @param updateUserDto
   * @returns
   */
  @Patch(':id')
  @ApiOperation({
    summary: '유저 정보 수정 API(관리자)',
  })
  @ApiCreatedResponse({
    status: 201,
    description: '유저 정보 수정 완료',
    schema: {
      example: {
        success: true,
      },
    },
  })
  @ApiBearerAuth('token')
  @UseGuards(AuthGuard())
  updateOne(
    @GetAdmin() admin: GetUserDto,
    @Param() id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<boolean> {
    try {
      return this.userService.update(+id, updateUserDto);
    } catch (error) {
      throw error;
    }
  }

  /**
   * 유저 탈퇴
   * @param user
   * @returns
   */
  @Delete()
  @ApiOperation({
    summary: '유저 탈퇴 API(자기 정보만 접근 가능)',
  })
  @ApiCreatedResponse({
    status: 201,
    description: '유저 탈퇴 완료',
    schema: {
      example: {
        success: true,
      },
    },
  })
  @ApiBearerAuth('token')
  @UseGuards(AuthGuard())
  remove(@GetUser() user: GetUserDto): Promise<boolean> {
    try {
      return this.userService.remove(user.id);
    } catch (error) {
      throw error;
    }
  }

  /**
   * 유저 삭제(관리자)
   * @param admin
   * @param id
   * @returns
   */
  @Delete(':id')
  @ApiOperation({
    summary: '유저 삭제 API(관리자)',
  })
  @ApiCreatedResponse({
    status: 201,
    description: '유저 탈퇴 완료',
    schema: {
      example: {
        success: true,
      },
    },
  })
  @ApiBearerAuth('token')
  @UseGuards(AuthGuard())
  removeOne(
    @GetAdmin() admin: GetUserDto,
    @Param() id: string
  ): Promise<boolean> {
    try {
      return this.userService.remove(+id);
    } catch (error) {
      throw error;
    }
  }
}
