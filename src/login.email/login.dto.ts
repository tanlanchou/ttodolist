import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(32, 32)
  password: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(32, 32)
  password: string;
}

export class ForgetPasswordDto {
  @IsNotEmpty()
  @IsString()
  @Length(32, 32)
  password: string;
}

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  @Length(32, 32)
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  @Length(32, 32)
  newPassword: string;
}
