import React from 'react';
import styled from 'styled-components';
import { View, TouchableOpacity } from 'react-native';

import i18n from 'format-message';
import { determineIfOnline } from '../../shared/utils/helpers';

import { AvatarGroup } from '../../shared/Avatars';
import StyledText from '../../shared/StyledText';

const Container = styled(TouchableOpacity)`
  height: 60px;
  border-radius: 8px;
`;

const AvatarContainer = styled(View)`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 60px;
`;

const AvatarContent = styled(View)`
  flex: 1;
  justify-content: center;
`;

const TextContainer = styled(View)`
  position: absolute;
  left: 60px;
  top: 0;
  bottom: 0;
  right: 0;
`;

const TextContent = styled(View)`
  flex: 1;
  justify-content: center;
`;

const Title = styled(StyledText)`
  color: #1d2129;
`;

const Subtext = styled(StyledText)`
  color: #707689;
`;

function ChatSearchResult({ searchResult: { type, result }, onSelect }) {
  let avatarProperties = {};
  let title;
  let subtext;
  if (type === 'user') {
    const {
      avatarUrl: userAvatarUrl,
      firstName,
      lastName,
      dateLastChatConnected,
      dateLastChatDisconnected
    } = result;
    avatarProperties = {
      urls: [
        {
          url: userAvatarUrl,
          isOnline: determineIfOnline(
            dateLastChatConnected,
            dateLastChatDisconnected
          )
        }
      ]
    };
    title = `${firstName} ${lastName}`;
    subtext = `${i18n('send')} ${firstName} ${i18n('a message')}`;
  } else if (type === 'group' || type === 'class') {
    const {
      avatarUrl: groupOrClassAvatarUrl,
      coverBannerUrl: groupOrClassCoverBannerUrl,
      name,
      color: groupOrClassColor
    } = result;
    title = `${name}`;
    subtext = `${i18n('start a conversation')}`;
    avatarProperties = {
      rectangle: true,
      urls: [
        {
          url: groupOrClassAvatarUrl || groupOrClassCoverBannerUrl || undefined,
          color: groupOrClassColor && groupOrClassColor.hexValue,
          hideOnline: true
        }
      ]
    };
  }
  return (
    <Container
      onPress={() => {
        onSelect({ type, result });
      }}
    >
      <AvatarContainer>
        <AvatarContent>
          <AvatarGroup {...avatarProperties} />
        </AvatarContent>
      </AvatarContainer>
      <TextContainer>
        <TextContent>
          <Title>{title}</Title>
          <Subtext>{subtext}</Subtext>
        </TextContent>
      </TextContainer>
    </Container>
  );
}

export { ChatSearchResult as default };
