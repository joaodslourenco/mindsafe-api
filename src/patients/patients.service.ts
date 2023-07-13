import { Injectable } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PatientsRepository } from './repositories/patients.repository';
import { NotFoundError } from 'src/common/errors/types/NotFoundError';
import { genSaltSync, hashSync } from 'bcrypt';

@Injectable()
export class PatientsService {
  constructor(private readonly patientsRepository: PatientsRepository) {}

  create(createPatientDto: CreatePatientDto) {
    createPatientDto.password = this.hashPassword(createPatientDto.password);

    return this.patientsRepository.create(createPatientDto);
  }

  async findOne(id: string) {
    const patient = await this.patientsRepository.findOne(id);

    if (!patient) {
      throw new NotFoundError('Patient not found');
    }
    return patient;
  }

  async findOneByEmail(email: string) {
    const patient = await this.patientsRepository.findOneByEmail(email);

    if (!patient) {
      throw new NotFoundError('Patient not found');
    }
    return patient;
  }

  async findAll() {
    const patients = await this.patientsRepository.findAll();

    if (!patients) {
      throw new NotFoundError('There are no patients found.');
    }
    return patients;
  }

  async findAllPostsByPatient(id: string) {
    return this.patientsRepository.findAllPostsByPatient(id);
  }

  async update(id: string, updatePatientDto: UpdatePatientDto) {
    const patient = await this.patientsRepository.findOne(id);

    if (!patient) {
      throw new NotFoundError('Patient not found');
    }

    if (updatePatientDto.password) {
      updatePatientDto.password = this.hashPassword(updatePatientDto.password);
    }

    return this.patientsRepository.update(id, updatePatientDto);
  }

  remove(id: string) {
    return this.patientsRepository.remove(id);
  }

  private hashPassword(plainTextPassword: string) {
    const salt = genSaltSync(10);
    const hashedPassword = hashSync(plainTextPassword, salt);

    return hashedPassword;
  }
}
