import { Post } from '@prisma/client';

export class PostEntity implements Post {
  id: string;
  createdAt: Date;
  content: string;
  userId: string;
}
