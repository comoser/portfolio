import type { FrontmatterPage } from '@/types/FrontMatter';

type INewerOlderPaginationProps = {
  type: 'Projects' | 'Articles' | 'Talks' | 'Work Experience';
  page: FrontmatterPage;
};

const NewerOlderPagination = (props: INewerOlderPaginationProps) => (
  <div className="flex justify-center gap-8">
    {props.page.url.prev && (
      <a href={props.page.url.prev}>{`← Newer ${props.type}`}</a>
    )}
    {props.page.url.next && (
      <a href={props.page.url.next}>{`Older ${props.type} →`}</a>
    )}
  </div>
);

export { NewerOlderPagination };
