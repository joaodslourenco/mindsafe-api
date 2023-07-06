import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { NotFoundError } from 'src/common/errors/types/NotFoundError';

@Injectable()
export class PostsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto) {
    const user = await this.prisma.patient.findUnique({
      where: { id: createPostDto.patientId },
    });

    if (!user) {
      throw new NotFoundError('Patient not found!');
    }
    return this.prisma.post.create({
      data: createPostDto,
      include: { patient: { select: { name: true } } },
    });
  }

  findAll() {
    return this.prisma.post.findMany();
  }

  findOne(id: string) {
    return this.prisma.post.findUnique({ where: { id } });
  }

  update(id: string, updatePostDto: UpdatePostDto) {
    return this.prisma.post.update({ where: { id }, data: updatePostDto });
  }

  remove(id: string) {
    return this.prisma.post.delete({ where: { id } });
  }
}
