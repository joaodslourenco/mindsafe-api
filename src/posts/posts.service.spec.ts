import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { PostsRepository } from './repositories/posts.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { PostEntity } from './entities/post.entity';
import { UpdatePostDto } from './dto/update-post.dto';

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
            findOne: jest.fn().mockResolvedValue(examplePost),
            update: jest
              .fn()
              .mockImplementation((id: string, updateDto: UpdatePostDto) => ({
                id,
                ...updateDto,
              })),
            remove: jest.fn().mockResolvedValue(examplePost),
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
      jest.spyOn(postsRepository, 'create').mockRejectedValueOnce(new Error());

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
      jest.spyOn(postsRepository, 'findAll').mockRejectedValueOnce(new Error());

      expect(postsService.findAll()).rejects.toThrowError();
    });
  });

  describe('findOne method (GET)', () => {
    it('should get a post', async () => {
      const post = await postsService.findOne(examplePost.id);

      expect(post).toBe(examplePost);
      expect(postsRepository.findOne).toHaveBeenCalledWith(examplePost.id);
    });

    it("should throw an exception when there's an error", () => {
      jest.spyOn(postsRepository, 'findOne').mockRejectedValueOnce(new Error());

      expect(postsService.findOne(examplePost.id)).rejects.toThrowError();
    });
  });

  describe('updatePost method (PATCH)', () => {
    it('should update post', async () => {
      const updatedPost: UpdatePostDto = { content: 'another content' };
      const post = await postsService.update(examplePost.id, updatedPost);

      expect(post).toEqual({ id: examplePost.id, ...updatedPost });
      expect(postsRepository.update).toHaveBeenCalled();
    });

    it("should throw an exception when there's an error", () => {
      jest.spyOn(postsRepository, 'update').mockRejectedValueOnce(new Error());

      expect(
        postsService.update(examplePost.id, { content: 'another content' }),
      ).rejects.toThrowError();
    });
  });

  describe('deletePost method (DELETE)', () => {
    it('should delete post', async () => {
      const post = await postsService.remove(examplePost.id);

      expect(post).toEqual(examplePost);
      expect(postsRepository.remove).toHaveBeenCalled();
    });

    it("should throw an exception when there's an error", () => {
      jest.spyOn(postsRepository, 'remove').mockRejectedValueOnce(new Error());

      expect(postsService.remove(examplePost.id)).rejects.toThrowError();
    });
  });
});
