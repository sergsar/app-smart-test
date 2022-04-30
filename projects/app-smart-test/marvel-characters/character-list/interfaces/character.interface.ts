export interface Character {
  id: string;
  name: string;
  description: string;
  thumbnail: {
    extension: string;
    path: string;
  }
}
