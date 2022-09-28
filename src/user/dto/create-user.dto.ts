import { IsDate, IsEmail, IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
  code: string;

  login_type: string;

  email: string;

  password: string;

  // getCode(): string {
  //   return this.code;
  // }
  // setCode(v: string) {
  //   this.code = v;
  // }

  // getLoginType(): string {
  //   return this.login_type;
  // }
  // setLoginType(v: string) {
  //   this.login_type = v;
  // }

  // getEmail(): string {
  //   return this.email;
  // }
  // setEmail(v: string) {
  //   this.email = v;
  // }

  // getPassword(): string {
  //   return this.password;
  // }
  // setPassword(v: string) {
  //   this.password = v;
  // }
}
