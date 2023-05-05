import { ColorTags, Section, Tags } from 'astro-boilerplate-components';

import { Project as ProjectComponent } from '@/partials/Project';
import type { Project } from '@/types/Project';

const AllProjects = ({ allProjects }: { allProjects: Project[] }) => (
  <Section>
    <div className="flex flex-col gap-6">
      {allProjects.map((project) => (
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

export { AllProjects };
