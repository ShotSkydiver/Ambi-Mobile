import React from 'react';
import styled from 'styled-components';
import { View } from 'react-native';

const LOADING_BACKGROUND_COLOR = '#e6eaf2';

const OuterContainer = styled(View)`
  height: 96px;
  padding-horizontal: 16px;
`;

const Content = styled(View)`
  flex: 1;
  border-bottom-width: 1px;
  border-bottom-color: #f3f3f5;
`;

const AvatarWrapper = styled(View)`
  position: absolute;
  top: 19px;
  left: 0;
  bottom: 0;
  width: 51px;
`;

const AvatarLoading = styled(View)`
  height: 48px;
  width: 48px;
  border-radius: 24px;
  background-color: ${LOADING_BACKGROUND_COLOR};
`;

const ContentWrapper = styled(View)`
  position: absolute;
  top: 18px;
  bottom: 0;
  left: 61px;
  right: 0;
`;

const LoadingTextLine = styled(View)`
  background-color: ${LOADING_BACKGROUND_COLOR};
`;

const TitleLoading = styled(LoadingTextLine)`
  height: 16px;
  border-radius: 8px;
  margin-top: 8px;
  margin-bottom: 8px;
  width: 125px;
`;

const SubtitleLoading = styled(LoadingTextLine)`
  height: 8px;
  border-radius: 4px;
  width: 200px;
`;

function ChannelItemLoading() {
  return (
    <OuterContainer>
      <Content>
        <AvatarWrapper>
          <AvatarLoading />
        </AvatarWrapper>
        <ContentWrapper>
          <TitleLoading />
          <SubtitleLoading />
        </ContentWrapper>
      </Content>
    </OuterContainer>
  );
}

export { ChannelItemLoading as default };
