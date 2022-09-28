import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsefulService } from 'src/useful/useful.service';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async create(createUserDto: CreateUserDto): Promise<boolean> {
    try {
      const salt: string = await bcrypt.genSalt();
      createUserDto.password = await bcrypt.hash(createUserDto.password, salt);

      return this.userRepository.create(createUserDto);
    } catch (error) {
      throw error;
    }
  }

  findAll() {
    try {
      return this.userRepository.selectAll();
    } catch (error) {
      throw error;
    }
  }

  findOne(id: number) {
    try {
      return this.userRepository.selectOneById(id);
    } catch (error) {
      throw error;
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    try {
      return this.userRepository.updateOneById(id, updateUserDto);
    } catch (error) {
      throw error;
    }
  }

  remove(id: number) {
    try {
      return this.userRepository.deleteOneById(id);
    } catch (error) {
      throw error;
    }
  }
}
