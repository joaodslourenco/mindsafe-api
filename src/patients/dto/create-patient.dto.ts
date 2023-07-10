import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreatePatientDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @MaxLength(10)
  @IsString()
  password: string;
}
