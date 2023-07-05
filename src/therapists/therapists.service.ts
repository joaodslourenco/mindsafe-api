import { Injectable } from '@nestjs/common';
import { CreateTherapistDto } from './dto/create-therapist.dto';
import { UpdateTherapistDto } from './dto/update-therapist.dto';
import { TherapistsRepository } from './repositories/therapists.repository';

@Injectable()
export class TherapistsService {
  constructor(private readonly therapistsRepository: TherapistsRepository) {}
  create(createTherapistDto: CreateTherapistDto) {
    return this.therapistsRepository.create(createTherapistDto);
  }

  findAll() {
    return this.therapistsRepository.findAll();
  }

  findOne(id: string) {
    return this.therapistsRepository.findOne(id);
  }

  update(id: string, updateTherapistDto: UpdateTherapistDto) {
    return this.therapistsRepository.update(id, updateTherapistDto);
  }

  remove(id: string) {
    return this.therapistsRepository.remove(id);
  }
}
