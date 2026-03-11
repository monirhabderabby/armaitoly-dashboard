export interface Blog {
  _id: string;
  title: string;
  location: string;
  content: string;
  tags: string[];
  isPublished: boolean;
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImage: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}
