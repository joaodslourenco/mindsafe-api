import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PatientsService } from 'src/patients/patients.service';
import { PatientsRepository } from 'src/patients/repositories/patients.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { PatientsModule } from 'src/patients/patients.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [
    PatientsModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    AuthService,
    PatientsService,
    PatientsRepository,
    PrismaService,
  ],
})
export class AuthModule {}
