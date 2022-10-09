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
import { UsefulService } from 'src/useful/useful.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetAdmin, GetUser, Roles } from 'src/custom.decorator';
import { GetUserDto } from './dto/get-user.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RequestCreateUserDto } from './dto/request-create.user.dto';
import { TokenDto } from './dto/token.dto';

@ApiTags('유저 API')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly usefulService: UsefulService
  ) {}

  /**
   * 회원가입
   * @param createUserDto
   * @returns true
   */
  @Post()
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
      const code: string = await this.usefulService.genCode();
      const { email, password, login_type, role } = requestCreateUserDto;
      const createUserDto: CreateUserDto = {
        code,
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

  @ApiOperation({
    summary: '로그인 API',
  })
  @ApiCreatedResponse({
    status: 201,
    description: '유저 생성 완료',
    type: TokenDto,
  })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      return this.userService.login(loginDto);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @ApiOperation({
    summary: '유저 전체 조회 API(admin 유저만 접근 가능)',
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

  @Get(':id')
  @Get()
  @ApiOperation({
    summary: '유저 단일 조회 API(admin 유저만 접근 가능)',
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

  @Patch(':id')
  @ApiOperation({
    summary: '유저 정보 수정 API(자기 정보만 접근 가능)',
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
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<boolean> {
    try {
      return this.userService.update(+id, updateUserDto);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
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
  remove(
    @GetUser() user: GetUserDto,
    @Param('id') id: number
  ): Promise<boolean> {
    try {
      return this.userService.remove(+id);
    } catch (error) {
      throw error;
    }
  }
}
