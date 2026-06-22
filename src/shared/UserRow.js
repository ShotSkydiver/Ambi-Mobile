import React, { useEffect } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { RectButton } from 'react-native-gesture-handler';
import { normalizeUser } from '../Profile/utils';
import Avatar from './Avatars';
import Badge from './Badge';
import UserService from '../Profile/UserService';
import { GET_USER } from '../Profile/redux/actions';
import User from '../PropTypes/User';
import { DEVICE_WIDTH } from './constants';

const SectionHeader = styled(Text)`
  font-family: Circular-Bold;
  font-size: 16px;
  line-height: 20px;
`;

const UserRowContainer = styled(TouchableOpacity)`
  flex: 1;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  flex-direction: row;
`;

const UserInfo = styled(View)`
  margin-left: 16px;
  margin-right: auto;
  justify-content: center;
`;

const UserName = styled(Text)`
  font-family: Circular-Bold;
  font-size: 16px;
  line-height: 20px;
`;

const UserRow = ({
  user: suppliedUser,
  userId,
  navigation,
  theme,
  badge,
  children,
  onPress,
  usePadding,
  isChatMember,
  style
}) => {
  const user = useSelector(
    state => suppliedUser || state.users.allUsers[userId]
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (userId) {
      (async () => {
        const user = await UserService.getUserById(userId);
        dispatch({ type: GET_USER, user });
      })();
    }
  }, [userId]);

  const navigateToProfile = () => {
    if (navigation && !onPress) {
      navigation.navigate('ModalNavigator', {
        screen: 'Profile',
        params: { user, userId }
      });
    } else if (onPress) {
      onPress();
    }
  };

  let avatarMedia;
  let avatarUrl;
  let displayName;
  let userAvatar;
  if (!isChatMember) {
    ({ avatarMedia, avatarUrl, displayName } = normalizeUser(user));
    userAvatar = avatarMedia || avatarUrl;
  } else {
    userAvatar = user.avatar;
    displayName = `${user.firstName} ${user.lastName}`;
  }

  return (
    <RectButton
      rippleColor={theme.disabled}
      underlayColor={theme.elementBGColor}
      activeOpacity={0.4}
      onPress={navigateToProfile}
      style={{ marginRight: 1 }}
    >
      <UserRowContainer
        onPress={navigateToProfile}
        style={{ height: usePadding ? 72 : 40 }}
      >
        <Avatar url={userAvatar} size={40} onPress={navigateToProfile} />
        <UserInfo>
          {badge ? (
            <>
              <UserName
                style={{ ...style?.userName, color: theme.textPrimary }}
              >
                {displayName}
              </UserName>
              <Badge title={badge} bgColor={user?.role?.color} />
            </>
          ) : (
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ width: DEVICE_WIDTH - 130 }}
            >
              <UserName style={{ color: theme.textPrimary }}>
                {displayName}
              </UserName>
            </Text>
          )}
        </UserInfo>
        {children}
      </UserRowContainer>
    </RectButton>
  );
};

UserRow.defaultProps = {
  user: null,
  userId: null,
  badge: null,
  onPress: null,
  usePadding: false
};
UserRow.propTypes = {
  user: User,
  userId: PropTypes.number,
  badge: PropTypes.string,
  onPress: PropTypes.func,
  theme: PropTypes.shape({}).isRequired,
  usePadding: PropTypes.bool
};

export { SectionHeader };
export default UserRow;
