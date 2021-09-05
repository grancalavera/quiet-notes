export interface Note {
  id: string;
  title: string;
  content: string;
  author: string;
  _version: number;
  _createdAt?: Date;
  _updatedAt?: Date;
}
