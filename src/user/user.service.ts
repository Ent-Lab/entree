import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsefulService } from 'src/useful/useful.service';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  /**
   * 유저 회원가입
   * @param createUserDto
   * @returns true
   */
  async register(createUserDto: CreateUserDto): Promise<boolean> {
    try {
      // 이메일 중복 체크
      const isExistEmail: boolean | object =
        await this.userRepository.selectOneByEmail(createUserDto.email);

      if (isExistEmail) {
        throw new ConflictException('이미 존재하는 이메일입니다.');
      }
      const salt: string = await bcrypt.genSalt();
      createUserDto.password = await bcrypt.hash(createUserDto.password, salt);

      return this.userRepository.create(createUserDto);
    } catch (error) {
      throw error;
    }
  }

  /**
   * 유저 전체 조회
   * @returns 유저 목록
   */
  async findAll(): Promise<object[]> {
    try {
      return this.userRepository.selectAll();
    } catch (error) {
      throw error;
    }
  }

  /**
   * 유저 ID로 조회
   * @param id
   * @returns 유저
   */
  findOne(id: number) {
    try {
      return this.userRepository.selectOneById(id);
    } catch (error) {
      throw error;
    }
  }

  /**
   * 유저 업데이트
   * @param id
   * @param updateUserDto
   * @returns true
   */
  update(id: number, updateUserDto: UpdateUserDto) {
    try {
      return this.userRepository.updateOneById(id, updateUserDto);
    } catch (error) {
      throw error;
    }
  }

  /**
   * 유저 삭제
   * @param id
   * @returns true
   */
  remove(id: number) {
    try {
      return this.userRepository.deleteOneById(id);
    } catch (error) {
      throw error;
    }
  }
}
