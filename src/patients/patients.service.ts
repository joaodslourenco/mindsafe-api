import { Injectable } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PatientsRepository } from './repositories/patients.repository';
import { NotFoundError } from 'src/common/errors/types/NotFoundError';

@Injectable()
export class PatientsService {
  constructor(private readonly patientsRepository: PatientsRepository) {}
  create(createPatientDto: CreatePatientDto) {
    return this.patientsRepository.create(createPatientDto);
  }

  async findAll() {
    const patients = await this.patientsRepository.findAll();

    if (!patients) {
      throw new NotFoundError('There are no patients found.');
    }
    return patients;
  }

  async findOne(id: string) {
    const patient = await this.patientsRepository.findOne(id);

    if (!patient) {
      throw new NotFoundError('Patient not found');
    }
    return patient;
  }

  update(id: string, updatePatientDto: UpdatePatientDto) {
    return this.patientsRepository.update(id, updatePatientDto);
  }

  remove(id: string) {
    return this.patientsRepository.remove(id);
  }
}
