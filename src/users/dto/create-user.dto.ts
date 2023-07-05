export class CreateUserDto {
  email: string;
  name: string;
  role: 'patient' | 'psychologist';
}
