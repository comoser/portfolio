import type { ColorTags } from 'astro-boilerplate-components/dist/esm/types/components/Tags';

export interface Category {
  color: keyof typeof ColorTags;
  name: string;
}
