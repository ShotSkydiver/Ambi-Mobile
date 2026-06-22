import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Text } from 'react-native';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import i18n from 'format-message';
import { useTheme } from '@react-navigation/native';
import { updateCurrentUserInView } from '../../Profile/redux/actions';

import Avatar from '../../shared/Avatars';
import { newsfeedType as feedType } from '../enums';
import { DEFAULT_PROFILE_PIC } from '../../shared/constants';

const Container = styled(TouchableOpacity)`
  flex: 1;
  flex-shrink: 0;
  flex-direction: row;
  align-items: center;
  width: 100%;
  border-bottom-width: 0.5px;
  border-top-width: ${({ newsfeedType }) =>
    newsfeedType !== 'general' ? '0.5px;' : '0px;'};
  padding: 0 17px;
  height: 58px;
  margin: ${({ newsfeedType }) =>
    newsfeedType !== 'general' ? '15px 0px;' : '0px;'};
`;

const StatusPlaceholder = styled(Text)`
  font-family: Circular-Book;
  font-size: 14px;
  line-height: 18px;
  opacity: 0.6;
`;

const UserImage = styled(Avatar)`
  margin-right: 16px;
`;

const CreatePostBox = ({ navigation, user, newsfeedType, hostInfo, style }) => {
  const { avatarUrl, avatarMedia } = user.profile;
  const userAvatarUrl = avatarMedia ? avatarMedia.links.content : avatarUrl;
  const otherUserName = hostInfo
    ? hostInfo.profile
      ? hostInfo.profile.firstName
      : hostInfo.firstName
    : '';
  const dispatch = useDispatch();
  const navigateToScreen = type => {
    navigation.navigate('NativeModalNavigator', {
      screen: 'CreatePostScreen',
      params: {
        type,
        newsfeedType,
        avatarUrl: userAvatarUrl || DEFAULT_PROFILE_PIC,
        hostInfo
      }
    });
  };

  const navigateToProfile = () => {
    updateCurrentUserInView(user)(dispatch);
    navigation.navigate('ModalNavigator', {
      screen: 'Profile',
      params: { user }
    });
  };

  const getPlaceholderText = () => {
    const placeholder = {
      [feedType.PERSONAL]: 'Post something to your profile...',
      [feedType.GENERAL]: "What's on your mind?",
      [feedType.CLASS]: 'Post in this class...',
      [feedType.COMMUNITY]: 'Post in this community...',
      [feedType.GROUP]: 'Post in this group...',
      [feedType.OTHER_USER]: `Post to ${otherUserName}'s feed...`
    };
    return placeholder[newsfeedType] || '';
  };

  const placeholderText = getPlaceholderText();
  const theme = useTheme();
  const { legacy: themeColors } = theme;

  return (
    <Container
      onPress={() => navigateToScreen('text')}
      newsfeedType={newsfeedType}
      style={{
        ...style,
        backgroundColor: themeColors.elementBGColor,
        borderColor: themeColors.systemBorderColor
      }}
    >
      <UserImage size={34} onPress={navigateToProfile} url={userAvatarUrl} />
      <StatusPlaceholder style={{ color: themeColors.textPrimary }}>
        {i18n('{placeholderText}', { placeholderText })}
      </StatusPlaceholder>
    </Container>
  );
};

CreatePostBox.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  navigation: PropTypes.object.isRequired,
  newsfeedType: PropTypes.string.isRequired,
  user: PropTypes.shape({}).isRequired
};

export default CreatePostBox;
