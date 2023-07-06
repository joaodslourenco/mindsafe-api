import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(280)
  content: string;

  @IsNotEmpty()
  @IsUUID()
  patientId: string;
}
