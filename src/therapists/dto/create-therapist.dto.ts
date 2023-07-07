import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateTherapistDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsUUID()
  patientId: string;
}
