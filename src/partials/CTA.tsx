import { GradientText, Section } from 'astro-boilerplate-components';

import { Newsletter } from '@/partials/Newsletter';

const CTA = () => (
  <Section>
    <Newsletter
      title={
        <>
          Subscribe to my <GradientText>Newsletters</GradientText>
        </>
      }
      description="Let me keep you posted on new projects, articles or talks that I do!"
    />
  </Section>
);

export { CTA };
