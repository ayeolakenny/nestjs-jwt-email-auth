import { IsEmail, IsString } from 'class-validator';

export class UserCreateInput {
  @IsString()
  name: string;
  @IsEmail()
  email: string;
  @IsString()
  password: string;
  @IsString()
  confirmPassword: string;
}
