import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { PostsRepository } from './repositories/posts.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { PostEntity } from './entities/post.entity';

const examplePost: PostEntity = {
  id: 'some-id',
  content: 'some content',
  patientId: 'patientId',
  createdAt: new Date(),
};

const arrayOfPosts = [examplePost, examplePost, examplePost];

describe('PostsService', () => {
  let postsService: PostsService;
  let postsRepository: PostsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: PostsRepository,
          useValue: {
            create: jest.fn().mockResolvedValue(examplePost),
            findAll: jest.fn().mockResolvedValue(arrayOfPosts),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    postsService = module.get<PostsService>(PostsService);
    postsRepository = module.get<PostsRepository>(PostsRepository);
  });

  it('should be defined', () => {
    expect(postsService).toBeDefined();
  });

  describe('create method (POST)', () => {
    const newPost: CreatePostDto = {
      content: 'new post',
      patientId: 'some-patient-id',
    };
    it('should return as defined', async () => {
      const newUser = await postsService.create(newPost);

      expect(newUser).toBeDefined();
    });

    it('should have called postsRepository Create', async () => {
      postsService.create(newPost);
      expect(postsRepository.create).toHaveBeenCalled();
    });

    it('should return the new post obj with the same keys', async () => {
      const newUser = await postsService.create(newPost);

      expect(Object.keys(newUser)).toEqual(Object.keys(examplePost));
    });

    it("should throw an exception when there's an error", () => {
      jest.spyOn(postsService, 'create').mockRejectedValueOnce(new Error());

      expect(postsService.create(newPost)).rejects.toThrowError();
    });
  });

  describe('findAll method (GET)', () => {
    it('should get all posts', async () => {
      const posts = await postsService.findAll();

      expect(posts).toBe(arrayOfPosts);
      expect(postsRepository.findAll).toHaveBeenCalled();
    });

    it("should throw an exception when there's an error", () => {
      jest.spyOn(postsService, 'findAll').mockRejectedValueOnce(new Error());

      expect(postsService.findAll()).rejects.toThrowError();
    });
  });
});
