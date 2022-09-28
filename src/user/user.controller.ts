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

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly usefulService: UsefulService
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const code = await this.usefulService.genCode();
      createUserDto.code = code;
      return this.userService.create(createUserDto);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  findAll() {
    try {
      return this.userService.findAll();
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.userService.findOne(+id);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      return this.userService.update(+id, updateUserDto);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.userService.remove(+id);
    } catch (error) {
      throw error;
    }
  }
}
