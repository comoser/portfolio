import type { Project } from '@/types/Project';

export const sortByOrder = (projects: Project[]) => {
  return projects.sort((a, b) => a.order - b.order);
};
