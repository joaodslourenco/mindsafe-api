import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePatientDto } from '../dto/create-patient.dto';
import { UpdatePatientDto } from '../dto/update-patient.dto';
import { NotFoundError } from 'src/common/errors/types/NotFoundError';
import { ConflictError } from 'src/common/errors/types/ConflictError';
import { PatientEntity } from '../entities/patient.entity';

@Injectable()
export class PatientsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPatientDto: CreatePatientDto) {
    const patient = await this.prisma.patient.findUnique({
      where: { email: createPatientDto.email },
    });

    if (patient) {
      throw new ConflictError('Patient already exists.');
    }

    return this.prisma.patient.create({ data: createPatientDto });
  }

  findOne(id: string) {
    return this.prisma.patient.findUnique({
      where: { id },
      include: { posts: true, therapists: true },
    });
  }
  async findOneByEmail(email: string) {
    const patient = await this.prisma.patient.findUnique({ where: { email } });

    if (!patient) {
      throw new NotFoundError('Patient not found');
    }
    return patient;
  }

  findAll() {
    return this.prisma.patient.findMany();
  }

  async findAllPostsByPatient(id: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { id },
      include: { posts: true },
    });

    if (!patient) {
      throw new NotFoundError('Patient not found!');
    }

    const postsByPatient = patient.posts;

    return postsByPatient;
  }

  update(
    id: string,
    updatePatientDto: UpdatePatientDto,
  ): Promise<PatientEntity> {
    return this.prisma.patient.update({
      where: { id },
      data: updatePatientDto,
    });
  }

  remove(id: string) {
    const patient = this.prisma.patient.findUnique({ where: { id } });

    if (!patient) {
      throw new NotFoundError('Patient not found!');
    }

    const deletePosts = this.prisma.post.deleteMany({
      where: {
        patientId: id,
      },
    });

    const deleteTherapists = this.prisma.therapist.deleteMany({
      where: { patientId: id },
    });

    const deletePatient = this.prisma.patient.delete({
      where: {
        id,
      },
    });

    return this.prisma.$transaction([
      deletePosts,
      deleteTherapists,
      deletePatient,
    ]);
  }
}
