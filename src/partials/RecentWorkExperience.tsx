import {
  ColorTags,
  GradientText,
  Section,
  Tags,
} from 'astro-boilerplate-components';

import { Project as ProjectComponent } from '@/partials/Project';
import type { Project } from '@/types/Project';

const RecentWorkExperience = ({
  experienceList,
}: {
  experienceList: Project[];
}) => (
  <Section
    title={
      <div className="flex items-baseline justify-between">
        <div>
          Recent <GradientText>Work Experience</GradientText>
        </div>

        <div className="text-sm">
          <a href="/work-experience">View all experience →</a>
        </div>
      </div>
    }
  >
    <div className="flex flex-col gap-6">
      {experienceList.map((experience) => (
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

export { RecentWorkExperience };
