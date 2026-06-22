import React from 'react';
import { View, Text, SectionList } from 'react-native';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { useTheme } from '@react-navigation/native';

import Message from './Messages/Text';
import UserRow from '../shared/UserRow';
import HRLine from '../shared/HRLine';

const Container = styled(View)`
  flex: 1;
  padding: 0 16px;
`;

const MessageContainer = styled(View)`
  margin: 0 auto;
  padding: 16px 0;
`;

const ListTitle = styled(Text)`
  font-family: Circular-Bold;
  font-size: 16px;
  line-height: 20px;
  padding-top: 16px;
`;

function ChatMessageStatus({ navigation, route }) {
  const { channelSid } = route.params;
  const { messageSid } = route.params;
  const chatChannels = useSelector(state => state.chats.chatChannels);
  const channel = chatChannels.find(ch => ch.sid === channelSid);
  const { messages, members: memberships } = channel;
  const message = messages.find(m => m.sid === messageSid);
  const currentUser = useSelector(state => state.auth.user);
  const messageSeenBy = memberships.filter(
    member =>
      member.lastConsumedMessageIndex === message.index ||
      member.lastConsumedMessageIndex > message.index
  );
  const messageDeliveredTo = memberships.filter(
    member => !messageSeenBy.map(m => m.sid).includes(member.sid)
  );

  const sectionsData = [];
  if (messageSeenBy.length > 0) {
    sectionsData.push({
      data: messageSeenBy,
      title: `Seen (${messageSeenBy.length})`
    });
  }
  if (messageDeliveredTo.length > 0) {
    sectionsData.push({
      data: messageDeliveredTo,
      title: `Delivered ${messageDeliveredTo.length}`
    });
  }

  const theme = useTheme();
  const { legacy: themeColors } = theme;

  const renderUser = ({ item }) => (
    <UserRow
      usePadding
      user={item.attributes}
      key={item.sid}
      navigation={navigation}
      theme={themeColors}
      isChatMember
    />
  );

  const fromSelf = message.author === currentUser.email;
  return (
    <Container style={{ backgroundColor: themeColors.body }}>
      <MessageContainer>
        <Message
          message={message}
          onLinkPress={() => {}}
          isTapped={false}
          fromSelf={fromSelf}
        />
      </MessageContainer>

      <HRLine opacity={0.8} style={{ marginHorizontal: 4 }} />
      <SectionList
        sections={sectionsData}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        renderItem={renderUser}
        ItemSeparatorComponent={() => (
          <HRLine opacity={0.8} style={{ marginHorizontal: 4 }} />
        )}
        keyExtractor={(user, index) => (user.sid ? user.sid.toString() : index)}
        renderSectionHeader={({ section }) => (
          <ListTitle style={{ color: themeColors.slateGray }}>
            {section.title}
          </ListTitle>
        )}
        renderSectionFooter={() => (
          <HRLine opacity={0.8} style={{ marginHorizontal: 4 }} />
        )}
      />
    </Container>
  );
}

export default ChatMessageStatus;
