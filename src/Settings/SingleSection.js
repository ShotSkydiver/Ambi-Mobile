import React from 'react';

import {
  SingleSectionContainer,
  HeadingContainer,
  HeaderTitle,
  SectionContent,
  SeparatorComponent
} from './shared';

const SingleSection = ({ title, children, themeColors }) => {
  return (
    <SingleSectionContainer themeColors={themeColors}>
      <SeparatorComponent />
      <HeadingContainer themeColors={themeColors}>
        <HeaderTitle themeColors={themeColors}>{title}</HeaderTitle>
      </HeadingContainer>
      <SeparatorComponent />
      {children && <SectionContent>{children}</SectionContent>}
    </SingleSectionContainer>
  );
};

export default SingleSection;
