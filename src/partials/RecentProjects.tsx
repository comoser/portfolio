import {
  ColorTags,
  GradientText,
  Section,
  Tags,
} from 'astro-boilerplate-components';

import { Project as ProjectComponent } from '@/partials/Project';
import type { Project } from '@/types/Project';

const RecentProjects = ({ projectList }: { projectList: Project[] }) => (
  <Section
    title={
      <div className="flex items-baseline justify-between">
        <div>
          Recent <GradientText>Creations</GradientText>
        </div>

        <div className="text-sm">
          <a href="/open-source">View all creations →</a>
        </div>
      </div>
    }
  >
    <div className="flex flex-col gap-6">
      {projectList.map((project) => (
        <ProjectComponent
          key={project.title}
          name={project.title}
          description={project.description}
          link={project.link}
          img={{
            src: project.img.src,
            alt: project.img.alt,
          }}
          category={
            <>
              {project.categories.map((category) => (
                <Tags key={category.name} color={ColorTags[category.color]}>
                  {category.name}
                </Tags>
              ))}
            </>
          }
        />
      ))}
    </div>
  </Section>
);

export { RecentProjects };
