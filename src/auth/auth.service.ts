import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PatientsService } from 'src/patients/patients.service';

@Injectable()
export class AuthService {
  constructor(private readonly patientsService: PatientsService) {}
  async signIn(email: string, pass: string) {
    const user = await this.patientsService.findOneByEmail(email);

    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const { password, ...result } = user;
    // TODO: Generate a JWT and return it here
    // instead of the user object
    return result;
  }
}
