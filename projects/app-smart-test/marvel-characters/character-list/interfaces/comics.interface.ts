export interface Comics {
  id: number;
  title: string;
  description: string;
  thumbnail: {
    extension: string;
    path: string;
  };
}
