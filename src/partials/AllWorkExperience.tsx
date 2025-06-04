import { ColorTags, Section, Tags } from 'astro-boilerplate-components';

import { Project as ProjectComponent } from '@/partials/Project';
import type { Project } from '@/types/Project';

const AllWorkExperience = ({
  allWorkExperience,
}: {
  allWorkExperience: Project[];
}) => (
  <Section>
    <div className="flex flex-col gap-6">
      {allWorkExperience.map((experience) => (
        <ProjectComponent
          key={experience.title}
          name={experience.title}
          description={experience.description}
          link={experience.link}
          img={{
            src: experience.img.src,
            alt: experience.img.alt,
          }}
          category={
            <>
              {experience.categories.map((category) => (
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

export { AllWorkExperience };
