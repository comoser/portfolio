import { GradientText } from 'astro-boilerplate-components';

type IFooterCopyrightProps = {
  site_name: string;
};

const FooterCopyright = (props: IFooterCopyrightProps) => (
  <div className="border-t border-gray-600 pt-5">
    <div className="text-sm text-gray-200">
      © Copyright {new Date().getFullYear()} by {props.site_name}. Built with ♥
      by <GradientText>David Alecrim</GradientText>.
    </div>
  </div>
);

export { FooterCopyright };
