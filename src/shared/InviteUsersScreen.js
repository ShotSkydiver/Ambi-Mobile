/* eslint-disable react/display-name */
import React, { useState, useEffect, useRef } from 'react';
import {
  SectionList,
  View,
  Text,
  KeyboardAvoidingView,
  StatusBar
} from 'react-native';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import i18n from 'format-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';

import useStartChat from '../Chat/Twilio/useStartChat';
import useSocket from './hooks/useSocket';
import debounce from './utils/debounce';
import { addMemberToSpace } from '../Spaces/redux/actions';
import { IS_ANDROID, DEVICE_HEIGHT } from './constants';
import { FullScreenLoader } from './Loader';

import UserToggleRow, { SectionHeader } from './UserToggleRow';
import SearchBar from './SearchBar';
import HRLine from './HRLine';

const Container = styled(View)`
  flex: 1;
`;
const UsersContainer = styled(View)`
  flex: 1;
  padding: 0 16px;
`;

const StyledEmptyUsers = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
  margin-bottom: ${DEVICE_HEIGHT / 4}px;
`;

const StyledEmptyHeader = styled(Text)`
  height: 22px;
  margin-bottom: 8px;
  font-family: Circular-Bold;
  font-size: 17px;
  line-height: 22px;
  text-align: center;
`;

const StyledEmptySubheader = styled(Text)`
  height: 40px;
  width: 248px;
  font-family: Circular-Book;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
`;

const Emoji = styled(Text)`
  font-size: 40px;
  margin-bottom: 8px;
`;

const EmptyUsers = ({ type }) => {
  const isChat = type === 'chat';
  const isGroup = type === 'group';
  let caption = 'Start searching for users to invite to join this group!';
  if (isChat) {
    caption = 'Start searching for someone to start a chat with above!';
  }
  const theme = useTheme();
  const { legacy: themeColors } = theme;
  return (
    <StyledEmptyUsers>
      {isChat && <Emoji>💬</Emoji>}
      {isGroup && <Emoji>🔍</Emoji>}
      <StyledEmptyHeader style={{ color: themeColors.slateGray }}>
        {i18n('Search for someone')}
      </StyledEmptyHeader>
      <StyledEmptySubheader style={{ color: themeColors.slateGray }}>
        {i18n('{caption}', { caption })}
      </StyledEmptySubheader>
    </StyledEmptyUsers>
  );
};

const UserSearchBar = ({ socket, setUsers, existingUsers, searchInputRef }) => {
  const existingUserIds = (existingUsers || []).map(u => u.user && u.user.id);
  const transformSearchResults = users => {
    const updatedUsers = {};
    users.forEach(user => {
      if (!existingUserIds.includes(user.result.id)) {
        updatedUsers[user.result.id] = user.result;
      }
    });
    setUsers(updatedUsers);
  };
  const onSearch = debounce(searchText => {
    if (searchText.length === 0) {
      transformSearchResults([]);
      return;
    }
    if (socket) {
      socket.emit('search/users', searchText, (err, results) => {
        if (err) {
          console.warn('failed to get users', err);
        } else {
          results.users.length > 0 && transformSearchResults(results.users);
        }
      });
    }
  }, 30);
  return (
    <SearchBar
      autoFocus={false}
      placeholder={i18n('Search for users')}
      onChangeText={onSearch}
      ref={searchInputRef}
    />
  );
};

const InviteUsersScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();

  const currentUser = useSelector(state => state.auth.user);
  const currentSpaceInView = useSelector(
    state => state.spaces.currentSpaceInView
  );
  const { handleStartChat } = useStartChat(navigation);
  const chatChannels = useSelector(state => state.chats.chatChannels);
  const isCreatingNewChatChannel = useSelector(
    state => state.chats.isCreatingNewChatChannel
  );
  const chatChannelSid = route.params?.channelSid;
  const channelInState = chatChannels.find(ch => ch.sid === chatChannelSid);
  const { members: currentChatChannelMembers } = channelInState || {};

  const type = route.params?.type;
  const isSpace = type === 'group' || type === 'class';
  const isNewChatOrSpace = route.params?.newCreation;
  const space = currentSpaceInView;

  const [invitedUsers, setInvitedUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  const searchInputRef = useRef(null);

  useSocket({
    onLoad: loadedSocket => setSocket(loadedSocket)
  });

  useEffect(() => {
    const invitedUsers = route.params?.invitedUsers || [];
    setInvitedUsers(invitedUsers);
  }, []);

  const createChat = () => {
    let usersToAdd = invitedUsers;
    if (channelInState) {
      usersToAdd = [
        ...usersToAdd,
        ...currentChatChannelMembers
          .map(m => m?.attributes)
          .filter(m => m && m.email !== currentUser.email)
      ];
    }
    handleStartChat(usersToAdd);
  };

  const addMembersToCurrentSpace = async () => {
    try {
      await Promise.all(
        invitedUsers.map(async member => {
          try {
            await addMemberToSpace(currentSpaceInView, type, member)(dispatch);
          } catch (err) {
            console.error(err);
          }
        })
      );
    } catch (err) {
      console.error('Error adding members to space:', err);
    }
    navigation.navigate('Members', { type, space });
  };

  const onConfirmUsersRef = useRef();
  onConfirmUsersRef.current = () => {
    if (isNewChatOrSpace) {
      type === 'chat'
        ? createChat()
        : navigation.navigate('CreateGroupScreen', { invitedUsers });
    } else {
      type === 'chat' ? createChat() : addMembersToCurrentSpace();
    }
  };

  useEffect(() => {
    navigation.setParams({
      onConfirm: () => onConfirmUsersRef.current()
    });
  }, []);

  const hasInvitedUsers = invitedUsers.length > 0;
  useEffect(() => {
    navigation.setParams({
      hasInvitedUsers
    });
  }, [hasInvitedUsers]);

  const theme = useTheme();
  const { legacy: themeColors } = theme;

  return (
    <Container>
      <SafeAreaView
        style={{ backgroundColor: themeColors.backgroundColor, flex: 1 }}
        mode="padding"
        edges={['right', 'bottom', 'left']}
      >
        <UserSearchBar
          socket={socket}
          setUsers={users => setUsers(Object.values(users))}
          searchInputRef={searchInputRef}
          existingUsers={isSpace ? space.members : []}
        />
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={IS_ANDROID ? 'height' : 'padding'}
        >
          <UsersContainer>
            <SectionList
              style={{ flex: 1 }}
              stickySectionHeadersEnabled={false}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <HRLine opacity={0.8} fullWidth />}
              renderSectionFooter={({ section }) =>
                invitedUsers.length && section.key === 'invited-users' ? (
                  <HRLine style={{ marginBottom: 14 }} opacity={0.8} />
                ) : null
              }
              renderItem={({ item: user }) => (
                <UserToggleRow
                  user={user}
                  navigation={navigation}
                  theme={themeColors}
                  isChecked={invitedUsers.some(u => u.id === user.id)}
                  toggleChecked={isChecked => {
                    searchInputRef.current.clear();
                    if (isChecked) {
                      setInvitedUsers([...invitedUsers, user]);
                    } else {
                      setInvitedUsers(
                        invitedUsers.filter(u => u.id !== user.id)
                      );
                    }
                  }}
                  key={user.id}
                  usePadding
                />
              )}
              renderSectionHeader={({ section }) =>
                section.data.length ? (
                  <SectionHeader
                    style={{ color: themeColors.slateGray, paddingTop: 8 }}
                  >
                    {section.title}
                  </SectionHeader>
                ) : null
              }
              keyExtractor={(user, index) =>
                user.id ? user.id.toString() : index
              }
              sections={[
                {
                  data: invitedUsers,
                  title: `${i18n('Invited Users')} (${invitedUsers.length})`,
                  key: 'invited-users'
                },
                {
                  data: users.filter(
                    user => !invitedUsers.some(u => u.id === user.id)
                  ),
                  title: i18n('Users'),
                  key: 'uninvited-users'
                }
              ]}
            />
          </UsersContainer>
          {users.length === 0 && !hasInvitedUsers && <EmptyUsers type={type} />}
          {isCreatingNewChatChannel && (
            <FullScreenLoader text="loading chat..." />
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        animated
        translucent
      />
    </Container>
  );
};

export default InviteUsersScreen;
