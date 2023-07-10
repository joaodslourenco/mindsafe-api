import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { PatientsService } from 'src/patients/patients.service';

@Injectable()
export class AuthService {
  constructor(private readonly patientsService: PatientsService) {}
  async signIn(email: string, pass: string) {
    const user = await this.patientsService.findOneByEmail(email);

    const userCredentialsCorrect = await compare(pass, user.password);
    if (!userCredentialsCorrect) {
      throw new UnauthorizedException();
    }
    const { password, ...result } = user;
    // TODO: Generate a JWT and return it here
    // instead of the user object
    return result;
  }
}
