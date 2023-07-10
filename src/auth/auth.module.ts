import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PatientsService } from 'src/patients/patients.service';
import { PatientsRepository } from 'src/patients/repositories/patients.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PatientsService, PatientsRepository, PrismaService],
})
export class AuthModule {}
