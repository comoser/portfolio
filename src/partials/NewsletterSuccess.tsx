import { GradientText, Section } from 'astro-boilerplate-components';

const NewsletterSuccess = () => (
  <Section>
    <div className="w-100 my-16 flex h-16 flex-col items-center justify-center md:my-64 md:h-36">
      <GradientText>
        <h1 className="text-6xl">Thank you!</h1>
      </GradientText>
      <p className="mt-5 text-lg">
        Your subscription has been registered! You'll be getting the latest
        content directly to your email.
      </p>
      <a href="/" className="mt-10">
        ← Back to home
      </a>
    </div>
  </Section>
);

export { NewsletterSuccess };
