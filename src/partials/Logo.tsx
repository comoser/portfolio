import type { ReactNode } from 'react';

type ILogoProps = {
  icon: ReactNode;
  name: string;
};

const Logo = (props: ILogoProps) => (
  <div className="flex items-center bg-gradient-to-br from-sky-500 to-cyan-400 bg-clip-text text-xl font-bold text-transparent">
    {props.icon}

    <div className="mt-2">{props.name}</div>
  </div>
);

export { Logo };
