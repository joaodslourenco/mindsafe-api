import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { PatientsService } from 'src/patients/patients.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly patientsService: PatientsService,
    private readonly jwtService: JwtService,
  ) {}
  async signIn(email: string, pass: string) {
    const user = await this.patientsService.findOneByEmail(email);

    const userCredentialsCorrect = await compare(pass, user.password);
    if (!userCredentialsCorrect) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, userEmail: user.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
