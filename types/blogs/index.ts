export interface BlogAuthor {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage: string;
}

export interface Blog {
  _id: string;
  title: string;
  location: string;
  coverImage?: string;
  content: string;
  tags: string[];
  isPublished: boolean;
  createdBy: BlogAuthor;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface BlogMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface BlogResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: BlogMeta;
  data: Blog[];
}

export interface SingleBlogResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Blog;
}
