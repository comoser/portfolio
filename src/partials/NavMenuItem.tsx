type INavMenuItemProps = {
  href: string;
  children: string;
  highlight?: boolean;
  icon?: string;
};

const highlightClasses =
  'transition-colors bg-amber-500 px-5 py-1.5 rounded-xl text-[#111729]';

const NavMenuItem = (props: INavMenuItemProps) => {
  if (props.icon) {
    return (
      <li
        className={`hover:text-white ${
          props.highlight ? highlightClasses : ''
        }`}
      >
        <a href={props.href} className="flex flex-row items-center">
          <img
            src={props.icon}
            className="mr-1"
            alt="nav item image"
            height="40"
            width="40"
          />
          {props.children}
        </a>
      </li>
    );
  }

  return (
    <li
      className={`hover:text-white ${props.highlight ? highlightClasses : ''}`}
    >
      <a href={props.href}>{props.children}</a>
    </li>
  );
};

export { NavMenuItem };
