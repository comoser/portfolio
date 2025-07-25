import { GradientText, Section } from 'astro-boilerplate-components';

import { HeroAvatar } from '@/partials/HeroAvatar';
import { HeroSocial } from '@/partials/HeroSocial';

const Hero = () => (
  <Section>
    <HeroAvatar
      title={
        <>
          Hey! I'm <GradientText>David Alecrim</GradientText> 👋
        </>
      }
      description={
        <>
          I'm a staff product engineer with 10+ years in the industry, currently
          working at{' '}
          <a className="text-cyan-400 hover:underline" href="https://xgeeks.io">
            xgeeks
          </a>
          . I've worked in multiple enterprise level products for a lot of known
          brands like{' '}
          <a
            className="text-cyan-400 hover:underline"
            href="https://www.mercedes-benz.com/en/"
          >
            Mercedes-Benz
          </a>
          ,{' '}
          <a
            className="text-cyan-400 hover:underline"
            href="https://www.saloodo.com/"
          >
            Saloodo (DHL)
          </a>{' '}
          or{' '}
          <a
            className="text-cyan-400 hover:underline"
            href="https://www.cazoo.co.uk/"
          >
            cazoo
          </a>
          .<br></br>
          <br></br>
          I'm keen on sharing my knowledge and I love to do that through
          mentoring, articles, talks and open source. I've contributed to some
          big projects like{' '}
          <a
            className="text-violet-500 hover:underline"
            href="https://www.gatsbyjs.com/"
          >
            Gatsby
          </a>
          ,{' '}
          <a
            className="text-yellow-400 hover:underline"
            href="https://babeljs.io/"
          >
            Babel
          </a>{' '}
          or{' '}
          <a
            className="text-red-400 hover:underline"
            href="https://www.raycast.com/"
          >
            Raycast
          </a>
          , besides doing some creations of my own.
          <br></br>
          <br></br>
          One of my biggest achievements though was the fact that I helped grow
          a team of 2 engineers to 100+ in 4 years, being able to heavily
          influence company and engineering culture.
        </>
      }
      avatar={
        <div className="image-block hidden md:block">
          <img
            className="h-64 w-64 rounded-full object-cover shadow-xl md:h-96 md:w-96"
            style={{ boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)' }}
            src="/assets/images/avatar.jpg?nf_resize=fit&h=1000&w=1000"
            alt="Avatar image"
          />
        </div>
      }
      socialButtons={
        <>
          <a href="https://github.com/comoser" className="mr-3">
            <HeroSocial
              src="/assets/images/icon-github.png?nf_resize=fit&w=144&h=144"
              alt="Github icon"
            />
          </a>
          <a href="https://medium.com/@davidalecrim" className="mr-3">
            <HeroSocial
              src="/assets/images/icon-medium.png?nf_resize=fit&w=144&h=144"
              alt="Medium icon"
            />
          </a>
          <a href="https://www.linkedin.com/in/david-alecrim/">
            <HeroSocial
              src="/assets/images/icon-linkedin.png?nf_resize=fit&w=144&h=144"
              alt="Linkedin icon"
            />
          </a>
        </>
      }
    />
  </Section>
);

export { Hero };
