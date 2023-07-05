import { Module } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { PatientsRepository } from './repositories/patients.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [PatientsController],
  providers: [PatientsService, PatientsRepository, PrismaService],
})
export class PatientsModule {}
