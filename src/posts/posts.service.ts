import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsRepository } from './repositories/posts.repository';
import { NotFoundError } from 'src/common/errors/types/NotFoundError';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

  create(createPostDto: CreatePostDto) {
    return this.postsRepository.create(createPostDto);
  }

  async findAll() {
    const posts = this.postsRepository.findAll();

    if (!posts) {
      throw new NotFoundError('There are no posts published.');
    }
    return posts;
  }

  async findOne(id: string) {
    const post = await this.postsRepository.findOne(id);

    if (!post) {
      throw new NotFoundError('The post specified was not found.');
    }
    return post;
  }

  update(id: string, updatePostDto: UpdatePostDto) {
    return this.postsRepository.update(id, updatePostDto);
  }

  remove(id: string) {
    return this.postsRepository.remove(id);
  }
}
