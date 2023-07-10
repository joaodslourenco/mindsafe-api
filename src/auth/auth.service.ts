import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { PatientsService } from 'src/patients/patients.service';
import { jwtConstants } from './constants';
import { NotFoundError } from 'src/common/errors/types/NotFoundError';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UnauthorizedError } from 'src/common/errors/types/UnauthorizedError';
import { PatientEntity } from 'src/patients/entities/patient.entity';

type Payload = {
  sub: string;
  userEmail: string;
};
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
      throw new UnauthorizedError('The credentials informed are incorrect.');
    }

    const payload = { sub: user.id, userEmail: user.email };
    const { access_token, refresh_token } = await this.generateToken(payload);

    return {
      access_token,
      refresh_token,
    };
  }

  async reauthenticate(body: RefreshTokenDto) {
    const user = await this.verifyRefreshToken(body);
    const payload: Payload = { sub: user.id, userEmail: user.email };
    return this.generateToken(payload);
  }

  private async generateToken(payload: Payload) {
    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: '30s',
    });
    const refresh_token = await this.jwtService.signAsync(payload, {
      expiresIn: '300s',
      secret: jwtConstants.refreshSecret,
    });

    return { access_token, refresh_token };
  }

  private async verifyRefreshToken(
    body: RefreshTokenDto,
  ): Promise<PatientEntity> {
    const refreshToken = body.refresh_token;

    if (!refreshToken) {
      throw new NotFoundError('Refresh token not found');
    }

    const email = this.jwtService.decode(refreshToken)['userEmail'];
    const user = await this.patientsService.findOneByEmail(email);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    try {
      this.jwtService.verify(refreshToken, {
        secret: jwtConstants.refreshSecret,
      });
      return user;
    } catch (err) {
      if (err.name === 'JsonWebTokenError') {
        throw new UnauthorizedError('Invalid signature.');
      }
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedError('Expired token.');
      }
      throw new UnauthorizedError(err.name);
    }
  }
}
