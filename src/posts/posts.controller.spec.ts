import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostEntity } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

const examplePost: PostEntity = {
  id: 'some-id',
  content: 'some content',
  patientId: 'patientId',
  createdAt: new Date(),
};

const arrayOfPosts = [examplePost, examplePost, examplePost];

describe('PostsController', () => {
  let postsController: PostsController;
  let postsService: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        {
          provide: PostsService,
          useValue: {
            create: jest.fn().mockResolvedValue(examplePost),
            findOne: jest.fn().mockResolvedValue(examplePost),
            findAll: jest.fn().mockResolvedValue(arrayOfPosts),
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

    postsController = module.get<PostsController>(PostsController);
    postsService = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(postsController).toBeDefined();
  });

  describe('create method (POST)', () => {
    const newPost: CreatePostDto = {
      content: 'new post',
      patientId: 'some-patient-id',
    };
    it('should return as defined', async () => {
      const newUser = await postsController.create(newPost);

      expect(newUser).toBeDefined();
    });

    it('should have called postsService Create', async () => {
      postsController.create(newPost);
      expect(postsService.create).toHaveBeenCalled();
    });

    it('should return the new patient obj with the same keys', async () => {
      const newUser = await postsController.create(newPost);

      expect(Object.keys(newUser)).toEqual(Object.keys(examplePost));
    });

    it("should throw an exception when there's an error", () => {
      jest.spyOn(postsService, 'create').mockRejectedValueOnce(new Error());

      expect(postsController.create(newPost)).rejects.toThrowError();
    });
  });

  describe('findOne method (GET)', () => {
    it('should get an patient', async () => {
      const post = await postsController.findOne(examplePost.id);

      expect(post).toBe(examplePost);
      expect(postsService.findOne).toHaveBeenCalledWith(examplePost.id);
    });

    it("should throw an exception when there's an error", () => {
      jest.spyOn(postsService, 'findOne').mockRejectedValueOnce(new Error());

      expect(postsController.findOne(examplePost.id)).rejects.toThrowError();
    });
  });

  describe('findAll method (GET)', () => {
    it('should get all posts', async () => {
      const posts = await postsController.findAll();

      expect(posts).toBe(arrayOfPosts);
      expect(postsService.findAll).toHaveBeenCalled();
    });

    it("should throw an exception when there's an error", () => {
      jest.spyOn(postsService, 'findAll').mockRejectedValueOnce(new Error());

      expect(postsController.findAll()).rejects.toThrowError();
    });
  });

  describe('updatePatient method (PATCH)', () => {
    it('should update patient', async () => {
      const updatedPost: UpdatePostDto = { content: 'another content' };
      const patient = await postsController.update(examplePost.id, updatedPost);

      expect(patient).toEqual({ id: examplePost.id, ...updatedPost });
      expect(postsService.update).toHaveBeenCalled();
    });

    it("should throw an exception when there's an error", () => {
      jest.spyOn(postsService, 'update').mockRejectedValueOnce(new Error());

      expect(
        postsController.update(examplePost.id, { content: 'another content' }),
      ).rejects.toThrowError();
    });
  });

  describe('deletePost method (DELETE)', () => {
    it('should delete post', async () => {
      const post = await postsController.remove(examplePost.id);

      expect(post).toEqual(examplePost);
      expect(postsService.remove).toHaveBeenCalled();
    });

    it("should throw an exception when there's an error", () => {
      jest.spyOn(postsService, 'remove').mockRejectedValueOnce(new Error());

      expect(postsController.remove(examplePost.id)).rejects.toThrowError();
    });
  });
});
