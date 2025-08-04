// post\src\core\entities\Post.ts

export class Post {
  constructor(
    public id: string,
    public userId: string,
    public content: string,
    public mediaUrl?: string | null,
    public createdAt?: Date,
    public updatedAt?: Date,
    public isDeleted?: boolean,
    public originalPostId?: string | null,
  ) {}
}
