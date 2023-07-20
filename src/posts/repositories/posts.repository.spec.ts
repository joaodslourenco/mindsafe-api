import { Test, TestingModule } from '@nestjs/testing';
import { PostsRepository } from './posts.repository';
import { CreatePostDto } from '../dto/create-post.dto';
import { PostEntity } from '../entities/post.entity';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PatientEntity } from 'src/patients/entities/patient.entity';

const testPatient: PatientEntity = {
  id: '13216546',
  name: 'test',
  email: 'test@test.com',
  password: '123456',
  createdAt: new Date(),
};

const examplePost: PostEntity = {
  id: 'some-id',
  content: 'some content',
  patientId: 'patientId',
  createdAt: new Date(),
};

const arrayOfPosts = [examplePost, examplePost, examplePost];

describe('PostsService', () => {
  let postsRepository: PostsRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsRepository,
        {
          provide: PrismaService,
          useValue: {
            post: {
              create: jest.fn().mockResolvedValue(examplePost),
              findMany: jest.fn().mockResolvedValue(arrayOfPosts),
              findUnique: jest.fn().mockResolvedValue(examplePost),
              update: jest
                .fn()
                .mockImplementation((id: string, updateDto: UpdatePostDto) => ({
                  id,
                  ...updateDto,
                })),
              delete: jest.fn().mockResolvedValue(examplePost),
            },
            patient: {
              findUnique: jest.fn().mockResolvedValue(testPatient),
            },
          },
        },
      ],
    }).compile();

    postsRepository = module.get<PostsRepository>(PostsRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(postsRepository).toBeDefined();
  });

  describe('create method (POST)', () => {
    const newPost: CreatePostDto = {
      content: 'new post',
      patientId: 'some-patient-id',
    };
    it('should return as defined', async () => {
      const newUser = await postsRepository.create(newPost);

      expect(newUser).toBeDefined();
    });

    it('should have called prismaService Create', async () => {
      await postsRepository.create(newPost);
      expect(prismaService.post.create).toHaveBeenCalled();
    });

    it('should return the new post obj with the same keys', async () => {
      const newUser = await postsRepository.create(newPost);

      expect(Object.keys(newUser)).toEqual(Object.keys(examplePost));
    });

    it("should throw an exception when there's an error", () => {
      jest.spyOn(postsRepository, 'create').mockRejectedValueOnce(new Error());

      expect(postsRepository.create(newPost)).rejects.toThrowError();
    });
  });

  describe('findAll method (GET)', () => {
    it('should get all posts', async () => {
      const posts = await postsRepository.findAll();

      expect(posts).toBe(arrayOfPosts);
      expect(prismaService.post.findMany).toHaveBeenCalled();
    });

    it("should throw an exception when there's an error", () => {
      jest
        .spyOn(prismaService.post, 'findMany')
        .mockRejectedValueOnce(new Error());

      expect(postsRepository.findAll()).rejects.toThrowError();
    });
  });
});
//   describe('findOne method (GET)', () => {
//     it('should get a post', async () => {
//       const post = await postsService.findOne(examplePost.id);

//       expect(post).toBe(examplePost);
//       expect(postsRepository.findOne).toHaveBeenCalledWith(examplePost.id);
//     });

//     it("should throw an exception when there's an error", () => {
//       jest.spyOn(postsRepository, 'findOne').mockRejectedValueOnce(new Error());

//       expect(postsService.findOne(examplePost.id)).rejects.toThrowError();
//     });
//   });

//   describe('updatePost method (PATCH)', () => {
//     it('should update post', async () => {
//       const updatedPost: UpdatePostDto = { content: 'another content' };
//       const post = await postsService.update(examplePost.id, updatedPost);

//       expect(post).toEqual({ id: examplePost.id, ...updatedPost });
//       expect(postsRepository.update).toHaveBeenCalled();
//     });

//     it("should throw an exception when there's an error", () => {
//       jest.spyOn(postsRepository, 'update').mockRejectedValueOnce(new Error());

//       expect(
//         postsService.update(examplePost.id, { content: 'another content' }),
//       ).rejects.toThrowError();
//     });
//   });

//   describe('deletePost method (DELETE)', () => {
//     it('should delete post', async () => {
//       const post = await postsService.remove(examplePost.id);

//       expect(post).toEqual(examplePost);
//       expect(postsRepository.remove).toHaveBeenCalled();
//     });

//     it("should throw an exception when there's an error", () => {
//       jest.spyOn(postsRepository, 'remove').mockRejectedValueOnce(new Error());

//       expect(postsService.remove(examplePost.id)).rejects.toThrowError();
//     });
//   });
// });
