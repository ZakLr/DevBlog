export type Role = 'USER' | 'ADMIN';

export interface User {
  id: string;
  role: Role;
  email: string;
  name?: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  blogs: Blog[];
  pfp?: string;
  comments: Comment[];
  reportsMade: Report[];
  reportsAgainst: Report[];
  bio?: string;
  backgroundImage?: string;
  firstName?: string;
  lastName?: string;
  birthday?: Date;
  gender?: string;
  website?: string;
  job?: string;
  instagram?:string,
  facebook?:string,
  linkedin?: string,
  totalComments?: number;
  totalBlogs?: number;
}

export interface Blog {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  author?: User;
  authorId?: string;
  comments: number;
  picture?: string;
  likes: number;
  reports: Report[];
  pictureUrl?: string;
  topics?: string[];
}

export interface Comment {
  id: string;
  authorId: string;
  author: User;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  blogId: string;
  blog: Blog;
  likes: number;
  reports: Report[];
}

export interface Report {
  id: string;
  authorId: string;
  author: User;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  blogId?: string;
  blog?: Blog;
  commentId?: string;
  comment?: Comment;
  reportedUserId?: string;
  reportedUser?: User;
}

