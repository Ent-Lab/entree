import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsefulService } from 'src/useful/useful.service';
import { LoginDto } from './dto/login.dto';

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
  findAll(): Promise<object[]> {
    try {
      return this.userService.findAll();
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<boolean | object> {
    try {
      return this.userService.findOne(+id);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  update(
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
  remove(@Param('id') id: string): Promise<boolean> {
    try {
      return this.userService.remove(+id);
    } catch (error) {
      throw error;
    }
  }
}
