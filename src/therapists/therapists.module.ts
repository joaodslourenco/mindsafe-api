import { Module } from '@nestjs/common';
import { TherapistsService } from './therapists.service';
import { TherapistsController } from './therapists.controller';
import { TherapistsRepository } from './repositories/therapists.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [TherapistsController],
  providers: [TherapistsService, TherapistsRepository, PrismaService],
})
export class TherapistsModule {}
