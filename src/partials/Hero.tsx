import {
  GradientText,
  HeroAvatar,
  HeroSocial,
  Section,
} from 'astro-boilerplate-components';

const Hero = () => (
  <Section>
    <HeroAvatar
      title={
        <>
          Hi there, I'm <GradientText>Ixartz</GradientText> 👋
        </>
      }
      description={
        <>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus{' '}
          <a className="text-cyan-400 hover:underline" href="/">
            malesuada
          </a>{' '}
          nisi tellus, non imperdiet nisi tempor at. Lorem ipsum dolor sit amet,{' '}
          <a className="text-cyan-400 hover:underline" href="/">
            consectetur
          </a>{' '}
          adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.
        </>
      }
      avatar={
        <img
          className="h-80 w-64"
          src="/assets/images/avatar.svg?nf_resize=fit&w=250&h=330"
          alt="Avatar image"
        />
      }
      socialButtons={
        <>
          <a href="/">
            <HeroSocial
              src="/assets/images/twitter-icon.png?nf_resize=fit&w=72&h=72"
              alt="Twitter icon"
            />
          </a>
          <a href="/">
            <HeroSocial
              src="/assets/images/facebook-icon.png?nf_resize=fit&w=72&h=72"
              alt="Facebook icon"
            />
          </a>
          <a href="/">
            <HeroSocial
              src="/assets/images/linkedin-icon.png?nf_resize=fit&w=72&h=72"
              alt="Linkedin icon"
            />
          </a>
          <a href="/">
            <HeroSocial
              src="/assets/images/youtube-icon.png?nf_resize=fit&w=72&h=72"
              alt="Youtube icon"
            />
          </a>
        </>
      }
    />
  </Section>
);

export { Hero };
