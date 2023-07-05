import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTherapistDto } from '../dto/create-therapist.dto';
import { UpdateTherapistDto } from '../dto/update-therapist.dto';

@Injectable()
export class TherapistsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(createTherapistDto: CreateTherapistDto) {
    return this.prisma.therapist.create({
      data: createTherapistDto,
    });
  }

  findAll() {
    return this.prisma.therapist.findMany({ include: { patient: true } });
  }

  findOne(id: string) {
    return this.prisma.therapist.findUnique({ where: { id } });
  }

  update(id: string, updateTherapistDto: UpdateTherapistDto) {
    return this.prisma.therapist.update({
      where: { id },
      data: updateTherapistDto,
    });
  }

  remove(id: string) {
    return this.prisma.therapist.delete({ where: { id } });
  }
}