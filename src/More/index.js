import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { View, FlatList, StatusBar, Text } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import i18n from 'format-message';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import { useTheme } from '@react-navigation/native';
import { ShadowStyles, ThemeConstants } from '../shared/contexts/themeContext';
import { logout } from '../Auth/redux/actions';

import Avatar from '../shared/Avatars';
import MoreOption from './MoreOption';
import HRLine from '../shared/HRLine';
import { FullScreenLoader } from '../shared/Loader';

const MoreContainer = styled(View)`
  flex: 1;
`;

const MoreHeader = styled(LinearGradient)`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding-bottom: 24px;
`;

const HeaderText = styled(Text)`
  color: ${ThemeConstants.dark.textPrimary};
  font-family: Circular-Bold;
  font-size: 17px;
  line-height: 22px;
  margin-top: 12px;
`;

const HeaderProfileLink = styled(Text)`
  color: ${ThemeConstants.dark.textPrimary};
  font-family: circular;
  font-size: 14px;
  line-height: 18px;
`;

const StyledBackgroundImageContainer = styled(LinearGradient)`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

const StyledBackgroundImage = styled(FastImage)`
  width: 100%;
  height: 100%;
`;

const StyledAvatarContainer = styled(View)`
  border-radius: 64px;
  width: 128px;
  height: 128px;
  border-width: 2px;
  align-items: center;
  justify-content: center;
  border-color: ${props => (props.showBorder ? '#ffffff' : 'transparent')};
`;

const More = ({ navigation }) => {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const { user } = auth;

  const theme = useTheme();
  const { legacy: themeColors } = theme;

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const moreOptions = [
    {
      key: 'Calendar',
      routeName: 'Calendar',
      icon: (
        <FeatherIcon
          name="calendar"
          size={24}
          style={{ color: themeColors.textPrimary }}
        />
      )
    },
    {
      key: 'Settings',
      routeName: 'Settings',
      icon: (
        <FeatherIcon
          name="settings"
          size={24}
          style={{ color: themeColors.textPrimary }}
        />
      )
    },
    {
      key: 'Support',
      routeName: 'Support',
      icon: (
        <FeatherIcon
          name="info"
          size={24}
          style={{ color: themeColors.textPrimary }}
        />
      )
    },
    {
      key: 'Logout',
      routeName: 'Logout',
      icon: <FeatherIcon name="log-out" size={24} color="#EC4A4A" />
    }
  ];
  const {
    profile: {
      firstName,
      lastName,
      avatarUrl,
      avatarMedia,
      coverBannerUrl,
      coverBannerMedia
    },
    id: currentUserId
  } = user;
  const userAvatarUrl = avatarMedia
    ? avatarMedia.links.image_80_80 || avatarMedia.links.content
    : avatarUrl;
  const userCoverBannerUrl = coverBannerMedia
    ? coverBannerMedia.links.image_656_250 || coverBannerMedia.links.content
    : coverBannerUrl;
  const navigateToProfile = () =>
    navigation.navigate('ModalNavigator', {
      screen: 'Profile',
      params: { user }
    });

  const handleLogout = () => {
    setIsLoggingOut(true);
    logout(currentUserId)(dispatch);
  };

  const renderOption = ({ item }) => (
    <MoreOption
      item={item}
      navigation={navigation}
      logout={handleLogout}
      user={user}
    />
  );

  const ITEMS_COUNT = moreOptions.length;

  return (
    <MoreContainer style={{ backgroundColor: themeColors.body }}>
      <MoreHeader colors={[themeColors.body, themeColors.backgroundColor]}>
        <View style={{ flex: 1 }} />
        {userCoverBannerUrl && (
          <StyledBackgroundImageContainer
            colors={[themeColors.backgroundColor, themeColors.bodyTransparent]}
            start={{ x: 0.0, y: 0.4 }}
            end={{ x: 0.0, y: 1.0 }}
          >
            <StyledBackgroundImage
              style={{ opacity: 0.6 }}
              source={{ uri: userCoverBannerUrl }}
            />
          </StyledBackgroundImageContainer>
        )}
        <StyledAvatarContainer
          showBorder={!!userCoverBannerUrl}
          style={ShadowStyles.buttonsAndText}
        >
          <Avatar size={124} url={userAvatarUrl} onPress={navigateToProfile} />
        </StyledAvatarContainer>
        <HeaderText
          invert={!!userCoverBannerUrl}
          onPress={navigateToProfile}
          style={ShadowStyles.buttonsAndText}
        >
          {firstName} {lastName}
        </HeaderText>
        <HeaderProfileLink
          invert={!!userCoverBannerUrl}
          onPress={navigateToProfile}
          style={ShadowStyles.buttonsAndText}
        >
          {i18n('View Profile')} &gt;
        </HeaderProfileLink>
      </MoreHeader>
      <HRLine fullWidth opacity={0.8} />
      <FlatList
        style={{ backgroundColor: themeColors.backgroundColor }}
        data={moreOptions}
        renderItem={renderOption}
        getItemLayout={(data, index) => {
          return {
            length: ITEMS_COUNT,
            offset: index * ITEMS_COUNT,
            index
          };
        }}
      />
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        animated
        translucent
      />
      {isLoggingOut && <FullScreenLoader text="logging out..." />}
    </MoreContainer>
  );
};

More.displayName = 'More';

export default More;
