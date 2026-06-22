import React from 'react';
import { View, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { useTheme } from '@react-navigation/native';
import UserRow from '../shared/UserRow';
import HRLine from '../shared/HRLine';

const ChatChannelMembers = ({ navigation, route }) => {
  const { channelSid } = route.params;
  const chatChannels = useSelector(state => state.chats.chatChannels);
  const channel = chatChannels.find(ch => ch.sid === channelSid);
  const { members } = channel;
  const theme = useTheme();
  const { legacy: themeColors } = theme;
  const renderItem = ({ item }) => (
    <UserRow
      theme={themeColors}
      usePadding
      user={item.attributes}
      key={item.sid}
      navigation={navigation}
      isChatMember
    />
  );
  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 16,
        backgroundColor: themeColors.backgroundColor
      }}
    >
      <FlatList
        data={members}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        ItemSeparatorComponent={() => (
          <HRLine opacity={0.8} style={{ marginHorizontal: 4 }} />
        )}
        keyExtractor={(user, index) =>
          user.id ? user.id.toString() : index.toString()
        }
      />
    </View>
  );
};

export default ChatChannelMembers;
