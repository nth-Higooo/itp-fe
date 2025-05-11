import { forwardRef, LegacyRef } from 'react';
import { Link, LinkProps, To } from 'react-router-dom';

export type TRouterLinkProps = LinkProps & {
  href: To;
};

export const RouterLink = forwardRef(
  ({ href, ...other }: TRouterLinkProps, ref?: LegacyRef<HTMLAnchorElement>) => (
    <Link ref={ref} {...other} to={href} />
  )
);
