import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';

import { CONFIG } from 'src/config-global';

import { Logo } from 'src/components/logo';

import { Section, TSectionProps } from './section';
import { Main, Content } from './main';
import { HeaderSection, THeaderSectionProps } from '../core/header-section';
import { LayoutSection } from '../core/layout-section';
import { ReactNode } from 'react';

// ----------------------------------------------------------------------
type TAuthSplitLayoutProps = {
  sx?: any;
  section?: any;
  children?: ReactNode;
  header?: THeaderSectionProps;
};

export function AuthSplitLayout({ sx, section, children, header }: TAuthSplitLayoutProps) {
  const layoutQuery = 'md';

  return (
    <LayoutSection
      headerSection={
        /** **************************************
         * Header
         *************************************** */
        <HeaderSection
          disableElevation
          layoutQuery={layoutQuery}
          slotProps={{ container: { maxWidth: false } }}
          sx={{ position: { [layoutQuery]: 'fixed' }, ...header?.sx }}
          slots={{
            topArea: (
              <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
                This is an info Alert.
              </Alert>
            ),
            leftArea: (
              <>
                {/* -- Logo -- */}
                <Logo
                  isSingle={false}
                  width="auto"
                  sx={{
                    marginLeft: { xs: 6, sm: 14 },
                    marginTop: { xs: 4, sm: 6 },
                  }}
                />
              </>
            ),
            rightArea: <Box display="flex" alignItems="center" gap={{ xs: 1, sm: 1.5 }}></Box>,
          }}
        />
      }
      /** **************************************
       * Footer
       *************************************** */
      footerSection={null}
      /** **************************************
       * Style
       *************************************** */
      cssVars={{ '--layout-auth-content-width': '420px' }}
      sx={sx}
    >
      <Main layoutQuery={layoutQuery}>
        <Section
          title={section?.title}
          layoutQuery={layoutQuery}
          imgUrl={section?.imgUrl}
          subtitle={section?.subtitle}
        />
        <Content layoutQuery={layoutQuery}>{children}</Content>
      </Main>
    </LayoutSection>
  );
}
