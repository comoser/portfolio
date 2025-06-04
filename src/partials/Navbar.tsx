import { NavbarTwoColumns, Section } from 'astro-boilerplate-components';

import { Logo } from '@/partials/Logo';
import { NavMenu } from '@/partials/NavMenu';
import { NavMenuItem } from '@/partials/NavMenuItem';

const Navbar = () => (
  <Section>
    <NavbarTwoColumns>
      <a href="/">
        <Logo
          icon={
            <img
              src="/assets/images/logo.png?nf_resize=fit&w=150&h=150"
              alt="logo"
              height="50"
              width="50"
            />
          }
          name="Get to know me"
        />
      </a>

      <div className="mt-2">
        <NavMenu>
          <NavMenuItem href="/work-experience">Work Experience</NavMenuItem>
          <NavMenuItem href="/open-source">Open Source</NavMenuItem>
          <NavMenuItem href="/articles">Articles</NavMenuItem>
          <NavMenuItem href="/talks">Talks</NavMenuItem>
        </NavMenu>
      </div>
    </NavbarTwoColumns>
  </Section>
);

export { Navbar };
