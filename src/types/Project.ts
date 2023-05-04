import type { Category } from '@/types/Category';

export interface Project {
  title: string;
  description: string;
  link: string;
  img: {
    src: string;
    alt: string;
  };
  order: number;
  categories: Category[];
}
