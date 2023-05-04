import type { MarkdownInstance } from 'astro';
import type { IFrontmatter } from 'astro-boilerplate-components';
import {
  BlogGallery,
  GradientText,
  Section,
} from 'astro-boilerplate-components';

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
          <a href="/articles">View all talks →</a>
        </div>
      </div>
    }
  >
    <BlogGallery postList={props.talkList} />
  </Section>
);

export { RecentTalks };
