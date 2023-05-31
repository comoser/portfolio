import type { MarkdownInstance } from 'astro';
import { GradientText, Section } from 'astro-boilerplate-components';

import { BlogGallery } from '@/partials/BlogGallery';
import type { IFrontmatter } from '@/types/FrontMatter';

type IRecentTalksProps = {
  talkList: MarkdownInstance<IFrontmatter>[];
};

const RecentTalks = (props: IRecentTalksProps) => (
  <Section
    title={
      <div className="flex items-baseline justify-between">
        <div>
          Recent <GradientText>Talks</GradientText>
        </div>

        <div className="text-sm">
          <a href="/talks">View all talks →</a>
        </div>
      </div>
    }
  >
    <BlogGallery postList={props.talkList} />
  </Section>
);

export { RecentTalks };
