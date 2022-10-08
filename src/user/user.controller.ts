import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsefulService } from 'src/useful/useful.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetAdmin, GetUser, Roles } from 'src/custom.decorator';
import { GetUserDto } from './dto/get-user.dto';
import { Role } from '../auth/roles.enum';
import { RolesGuard } from 'src/auth/guards/role.guard';

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
  async register(@Body() createUserDto: CreateUserDto): Promise<boolean> {
    try {
      const code: string = await this.usefulService.genCode();
      createUserDto.code = code;
      return this.userService.register(createUserDto);
    } catch (error) {
      throw error;
    }
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      return this.userService.login(loginDto);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @UseGuards(AuthGuard())
  findAll(@GetAdmin() admin: GetUserDto): Promise<object[]> {
    try {
      return this.userService.findAll();
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
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
  @UseGuards(AuthGuard())
  remove(
    @GetUser() user: GetUserDto,
    @Param('id') id: string
  ): Promise<boolean> {
    try {
      return this.userService.remove(+id);
    } catch (error) {
      throw error;
    }
  }
}
