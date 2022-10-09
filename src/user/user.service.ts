import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { UserVo } from './vo/user.vo';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService
  ) {}
  /**
   * 유저 회원가입
   * @param createUserDto
   * @returns true
   */
  async register(createUserDto: CreateUserDto): Promise<boolean> {
    try {
      await Promise.all([
        this.emailValidation(createUserDto), // 이메일 중복 체크
        this.hashPassword(createUserDto), // 비밀번호 암호화
      ]);
      return this.userRepository.create(createUserDto);
    } catch (error) {
      throw error;
    }
  }

  /**
   * 로그인
   * @param loginDto
   */
  async login(loginDto: LoginDto): Promise<object> {
    try {
      const { email, password } = loginDto;
      const userData: boolean | GetUserDto = await this.findOneByEmail(email);
      const user: GetUserDto = userData;
      return this.validateUser(user, password); // 유효성 체크
    } catch (error) {
      throw error;
    }
  }

  /**
   * 유저 검증
   * @param user
   * @param password
   * @returns
   */
  async validateUser(user: GetUserDto, password: string): Promise<object> {
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { email: user.email };
      const token = this.jwtService.sign(payload);
      return { token, expiresIn: '1h' };
    } else {
      throw new UnauthorizedException('잘못된 이메일 또는 비밀번호 입니다.');
    }
  }
  /**
   * 이메일 중복체크
   * @param createUserDto
   */
  async emailValidation(createUserDto: CreateUserDto): Promise<void> {
    const isExistEmail: boolean | object =
      await this.userRepository.selectOneByEmail(createUserDto.email);
    if (isExistEmail) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }
  }
  /**
   *  토큰 검증
   * @param token
   * @returns
   */
  async verifyToken(token: string): Promise<any> {
    return this.jwtService.verify(token);
  }

  /**
   * 비밀번호 암호화
   * @param createUserDto
   */
  async hashPassword(userDto: CreateUserDto | UpdateUserDto): Promise<void> {
    if (userDto.password) {
      const salt: string = await bcrypt.genSalt();
      userDto.password = await bcrypt.hash(userDto.password, salt);
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
  async findOne(id: number) {
    try {
      return this.userRepository.selectOneByCode(id);
    } catch (error) {
      throw error;
    }
  }

  async findOneByEmail(email: string) {
    try {
      return this.userRepository.selectOneByEmail(email);
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
  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      await this.hashPassword(updateUserDto);
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
