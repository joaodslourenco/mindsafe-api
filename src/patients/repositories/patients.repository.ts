import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePatientDto } from '../dto/create-patient.dto';
import { UpdatePatientDto } from '../dto/update-patient.dto';

@Injectable()
export class PatientsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(createPatientDto: CreatePatientDto) {
    return this.prisma.patient.create({ data: createPatientDto });
  }

  findAll() {
    return this.prisma.patient.findMany();
  }

  findOne(id: string) {
    return this.prisma.patient.findUnique({
      where: { id },
      include: { posts: true, therapist: true },
    });
  }

  update(id: string, updatePatientDto: UpdatePatientDto) {
    return this.prisma.patient.update({
      where: { id },
      data: updatePatientDto,
    });
  }

  remove(id: string) {
    return this.prisma.patient.delete({ where: { id } });
  }
}
