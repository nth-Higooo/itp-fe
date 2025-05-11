import Stack, { StackProps } from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';

import { NavList } from './nav-list';
import { NavUl, NavLi, Subheader } from '../styles';
import { navSectionClasses } from '../classes';
import { navSectionCssVars } from '../css-vars';
import { TTheme } from 'src/theme/create-theme';
import { useCallback, useState } from 'react';
import TokenService from 'src/services/token.service';
import { Collapse } from '@mui/material';

// ----------------------------------------------------------------------
export type TNavSectionMiniProps = StackProps & {
  sx?: any;
  data?: any;
  render?: any;
  slotProps?: any;
  enabledRootRedirect?: any;
  cssVars?: any;
};

export function NavSectionMini({
  sx,
  data,
  render,
  slotProps,
  enabledRootRedirect,
  cssVars: overridesVars,
}: TNavSectionMiniProps) {
  const theme = useTheme<TTheme>();

  const cssVars = {
    ...navSectionCssVars.mini(theme),
    ...overridesVars,
  };

  return (
    <Stack component="nav" className={navSectionClasses.mini.root} sx={{ ...cssVars, ...sx }}>
      <NavUl sx={{ flex: '1 1 auto', gap: 'var(--nav-item-gap)' }}>
        {data.map((group: any) => (
          <Group
            key={group.subheader ?? group.items[0].title}
            render={render}
            cssVars={cssVars}
            items={group.items}
            slotProps={slotProps}
            enabledRootRedirect={enabledRootRedirect}
          />
        ))}
      </NavUl>
    </Stack>
  );
}

// ----------------------------------------------------------------------

function Group({ items, render, subheader, slotProps, enabledRootRedirect }: any) {
  const [open, setOpen] = useState(true);

  const handleToggle = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const permissions = TokenService.getPermissions();

  const requiredPermissions = items.flatMap((i: any) => {
    if (i.children) {
      return i.children.map((c: any) => c.permission);
    } else {
      return [i.permission];
    }
  });

  if (
    !permissions.some(
      (p) =>
        requiredPermissions.includes(undefined) ||
        (requiredPermissions.includes(p.permission) && p.canView)
    )
  ) {
    return null;
  }

  const renderContent = (
    <NavUl sx={{ gap: 'var(--nav-item-gap)' }}>
      {items.map((list: any) => (
        <NavList
          key={list.title}
          data={list}
          render={render}
          depth={1}
          slotProps={slotProps}
          enabledRootRedirect={enabledRootRedirect}
        />
      ))}
    </NavUl>
  );

  return (
    <NavLi>
      {subheader ? (
        <>
          <Subheader
            data-title={subheader}
            open={open}
            onClick={handleToggle}
            sx={slotProps?.subheader}
          >
            {subheader}
          </Subheader>

          <Collapse in={open}>{renderContent}</Collapse>
        </>
      ) : (
        renderContent
      )}
    </NavLi>
  );
}
