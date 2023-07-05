import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TherapistsService } from './therapists.service';
import { CreateTherapistDto } from './dto/create-therapist.dto';
import { UpdateTherapistDto } from './dto/update-therapist.dto';

@Controller('therapists')
export class TherapistsController {
  constructor(private readonly therapistsService: TherapistsService) {}

  @Post()
  create(@Body() createTherapistDto: CreateTherapistDto) {
    return this.therapistsService.create(createTherapistDto);
  }

  @Get()
  findAll() {
    return this.therapistsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.therapistsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTherapistDto: UpdateTherapistDto,
  ) {
    return this.therapistsService.update(id, updateTherapistDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.therapistsService.remove(id);
  }
}
