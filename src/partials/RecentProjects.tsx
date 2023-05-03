import {
  ColorTags,
  GradientText,
  Project,
  Section,
  Tags,
} from 'astro-boilerplate-components';

const RecentProjects = () => (
  <Section
    title={
      <div className="flex items-baseline justify-between">
        <div>
          Recent <GradientText>Creations</GradientText>
        </div>

        <div className="text-sm">
          <a href="/open-source">View all creations →</a>
        </div>
      </div>
    }
  >
    <div className="flex flex-col gap-6">
      <Project
        name="Simple Reminder"
        description="A raycast extension to simplify your life. Set your reminders in plain english without the need to have any application installed and be notified when the time is right, even in your mobile device!"
        link="https://www.raycast.com/comoser/simple-reminder"
        img={{
          src: '/assets/images/project-simple-reminder.png?nf_resize=fit&w=250&h=250',
          alt: 'Simple Reminder',
        }}
        category={
          <>
            <Tags color={ColorTags.LIME}>Open Source</Tags>
            <Tags color={ColorTags.RED}>Raycast</Tags>
            <Tags color={ColorTags.BLUE}>TypeScript</Tags>
            <Tags color={ColorTags.SKY}>React</Tags>
          </>
        }
      />
      <Project
        name="Baby food intro"
        description="This API is part of the Baby Food Introduction application, which aims to help technological parents to keep track of the food introductions they make for their babies."
        link="https://github.com/comoser/baby-food-intro-api"
        img={{
          src: '/assets/images/project-github.png?nf_resize=fit&w=250&h=250',
          alt: 'Baby food intro',
        }}
        category={
          <>
            <Tags color={ColorTags.LIME}>Open Source</Tags>
            <Tags color={ColorTags.BLUE}>TypeScript</Tags>
            <Tags color={ColorTags.ROSE}>Nest.js</Tags>
          </>
        }
      />
      <Project
        name="Micro-Frontends Shop Demo"
        description="I created this demo version of a solution I implemented for a client. It's a composition of frontends and ways to connect and communicate between them easily. It's done by leveraging the Webpack 5 Module Federation technology."
        link="https://github.com/comoser/clothes-store-micro-frontends"
        img={{
          src: '/assets/images/project-micro-frontends.png?nf_resize=fit&w=250&h=250',
          alt: 'Micro-Frontends Shop Demo',
        }}
        category={
          <>
            <Tags color={ColorTags.LIME}>Open Source</Tags>
            <Tags color={ColorTags.GRAY}>Javascript</Tags>
            <Tags color={ColorTags.AMBER}>Module Federation</Tags>
            <Tags color={ColorTags.EMERALD}>Webpack</Tags>
          </>
        }
      />
    </div>
  </Section>
);

export { RecentProjects };
