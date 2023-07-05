import { Injectable } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PatientsRepository } from './repositories/patients.repository';

@Injectable()
export class PatientsService {
  constructor(private readonly patientsRepository: PatientsRepository) {}
  create(createPatientDto: CreatePatientDto) {
    return this.patientsRepository.create(createPatientDto);
  }

  findAll() {
    return this.patientsRepository.findAll();
  }

  findOne(id: string) {
    return this.patientsRepository.findOne(id);
  }

  update(id: string, updatePatientDto: UpdatePatientDto) {
    return this.patientsRepository.update(id, updatePatientDto);
  }

  remove(id: string) {
    return this.patientsRepository.remove(id);
  }
}
