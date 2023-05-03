import type { MarkdownInstance } from 'astro';
import type { IFrontmatter } from 'astro-boilerplate-components';
import {
  BlogGallery,
  GradientText,
  Section,
} from 'astro-boilerplate-components';

type IRecentArticlesProps = {
  postList: MarkdownInstance<IFrontmatter>[];
};

const RecentArticles = (props: IRecentArticlesProps) => (
  <Section
    title={
      <div className="flex items-baseline justify-between">
        <div>
          Recent <GradientText>Articles</GradientText>
        </div>

        <div className="text-sm">
          <a href="/articles">View all articles →</a>
        </div>
      </div>
    }
  >
    <BlogGallery postList={props.postList} />
  </Section>
);

export { RecentArticles };
