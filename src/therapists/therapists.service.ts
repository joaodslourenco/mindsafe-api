import { Injectable } from '@nestjs/common';
import { CreateTherapistDto } from './dto/create-therapist.dto';
import { UpdateTherapistDto } from './dto/update-therapist.dto';
import { TherapistsRepository } from './repositories/therapists.repository';
import { NotFoundError } from 'src/common/errors/types/NotFoundError';

@Injectable()
export class TherapistsService {
  constructor(private readonly therapistsRepository: TherapistsRepository) {}
  create(createTherapistDto: CreateTherapistDto) {
    return this.therapistsRepository.create(createTherapistDto);
  }

  async findAll() {
    const therapists = await this.therapistsRepository.findAll();

    if (!therapists) {
      throw new NotFoundError('Therapists not found.');
    }
    return therapists;
  }

  async findOne(id: string) {
    const therapist = await this.therapistsRepository.findOne(id);

    if (!therapist) {
      throw new NotFoundError('Therapist not found.');
    }
    return therapist;
  }

  update(id: string, updateTherapistDto: UpdateTherapistDto) {
    return this.therapistsRepository.update(id, updateTherapistDto);
  }

  remove(id: string) {
    return this.therapistsRepository.remove(id);
  }
}
