import type { Image } from "./Image";

export interface Faculty {
  id: number;
  title: string;
  description: string;
  image: Image;
  created_at: Date;
  updated_at: Date;
}