import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Text, View, FlatList, RefreshControl } from 'react-native';
import styled from 'styled-components';
import i18n from 'format-message';
import { useTheme, useScrollToTop } from '@react-navigation/native';

import debounce from '../shared/utils/debounce';
import ChannelItem from './ChannelItem';
import ChannelItemLoading from './ChannelItemLoading';
import EmptyState from '../shared/EmptyState';
import SearchBar from '../shared/SearchBar';
import HRLine from '../shared/HRLine';
import { AmbiColors } from '../shared/contexts/themeContext';

const Container = styled(View)`
  flex: 1;
`;

const Content = styled(View)`
  flex: 1;
`;

const Chat = ({ navigation }) => {
  const chatChannels = useSelector(state => state.chats.chatChannels);
  const loading = useSelector(state => state.chats.loading);
  const error = useSelector(state => state.chats.error);
  const reachedEnd = useSelector(state => state.chats.reachedEnd);

  const theme = useTheme();
  const { legacy: themeColors } = theme;

  const [isRefreshing, setIsRefreshing] = useState(false);

  const ref = useRef(null);
  useScrollToTop(ref);

  const [searchResults, setSearchResults] = useState([]);

  const onSearchChats = debounce((searchText = '') => {
    if (searchText.length > 0) {
      const matchedChannels = chatChannels.filter(ch =>
        `${ch.friendlyName}`
          .toLowerCase()
          .includes(`${searchText}`.toLowerCase())
      );
      setSearchResults(matchedChannels);
    } else {
      setSearchResults([]);
    }
  }, 30);

  // eslint-disable-next-line react/prop-types
  function renderChannel({ item: channelItem }) {
    return <ChannelItem item={channelItem} navigation={navigation} />;
  }

  function renderLoadingItem() {
    return <ChannelItemLoading />;
  }

  function channelKeyExtractor(item) {
    return `channel-${item.sid}`;
  }

  function loadingKeyExtractor(_, index) {
    return `loading-${index}`;
  }

  function reachedEndOfChat() {
    if (!reachedEnd) {
      // getChatChannels(currentPage + 1, currentUser.id)(dispatch);
    }
  }

  const refreshChats = async () => {
    setIsRefreshing(true);
    // await getChatChannels(currentPage, currentUser.id)(dispatch);
    setIsRefreshing(false);
  };

  function EmptyChatsComponent() {
    return <EmptyState title={i18n('No chats found')} />;
  }

  const chatChannelsToShow =
    searchResults.length > 0 ? searchResults : chatChannels;

  chatChannelsToShow.sort((a, b) => {
    const keyA = new Date(a.hydration.lastChatMessage?.dateRaw);
    const keyB = new Date(b.hydration.lastChatMessage?.dateRaw);
    if (keyA > keyB) return -1;
    if (keyA < keyB) return 1;
    return 0;
  });

  const itemSeparator = () => <HRLine opacity={0.8} />;

  return (
    <Container style={{ backgroundColor: themeColors.body }}>
      <SearchBar
        onChangeText={onSearchChats}
        placeholder={i18n('Search chats')}
      />
      <Content>
        {error && (
          <View>
            <Text>Error</Text>
          </View>
        )}
        {loading && (
          <FlatList
            ref={ref}
            style={{ flex: 1, color: themeColors.textPrimary }}
            renderItem={renderLoadingItem}
            keyExtractor={loadingKeyExtractor}
            data={Array(10).fill(0)}
          />
        )}
        {!loading && !error && (
          <FlatList
            ref={ref}
            initialNumToRender={10}
            ItemSeparatorComponent={itemSeparator}
            renderItem={renderChannel}
            keyExtractor={channelKeyExtractor}
            data={chatChannelsToShow}
            extraData={chatChannelsToShow}
            ListEmptyComponent={EmptyChatsComponent}
            onEndReached={reachedEndOfChat}
            onEndReachedThreshold={0.01}
            showsVerticalScrollIndicator={false}
            style={{ color: themeColors.textPrimary }}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={refreshChats}
                style={{
                  backgroundColor: 'transparent'
                }}
                tintColor={AmbiColors.ambiBlue}
                colors={[AmbiColors.ambiBlue]}
              />
            }
          />
        )}
      </Content>
    </Container>
  );
};

Chat.displayName = 'Chat';

export default Chat;
