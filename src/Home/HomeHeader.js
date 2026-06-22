import React from 'react';
import { Animated, View, StatusBar } from 'react-native';
import styled from 'styled-components';
import Icon from 'react-native-vector-icons/Feather';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';

import Avatar from '../shared/Avatars';
import Search from '../shared/Search';
import { IS_ANDROID, APPBAR_HEIGHT } from '../shared/constants';

const AnimatedView = Animated.createAnimatedComponent(View);
const StyledHomeHeader = styled(AnimatedView)`
  z-index: 2;
  flex: 1;
  flex-direction: row;
  align-items: flex-end;
  padding-bottom: 12px;
  padding-right: 16px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
`;

const StyledHomeHeaderContent = styled(AnimatedView)`
  flex-direction: row;
`;

const HomeHeaderLeftButton = ({
  navigation,
  hasSearchResults,
  setSearchEmpty
}) => {
  const currentUser = useSelector(state => state.auth.user);
  const {
    profile: { avatarMedia, avatarUrl }
  } = currentUser;
  const userAvatarUrl = avatarMedia ? avatarMedia.links.content : avatarUrl;

  return hasSearchResults ? (
    <Icon
      name="arrow-left"
      size={26}
      color="#ffffff"
      onPress={setSearchEmpty}
      style={{ marginHorizontal: 21, marginTop: 5 }}
    />
  ) : (
    <Avatar
      size={34}
      url={userAvatarUrl}
      onPress={() =>
        navigation.navigate('ModalNavigator', {
          screen: 'Profile',
          params: { user: currentUser }
        })
      }
      style={{ marginHorizontal: 16 }}
    />
  );
};

const HomeHeader = ({
  navigation,
  onSearchText,
  hasSearchResults,
  setSearchEmpty
}) => {
  const insets = useSafeAreaInsets();
  const STATUSBAR_HEIGHT = !IS_ANDROID ? insets.top : StatusBar.currentHeight;
  const theme = useTheme();
  const { legacy: themeColors } = theme;
  return (
    <StyledHomeHeader
      style={{
        backgroundColor: themeColors.homeHeader,
        height: STATUSBAR_HEIGHT + APPBAR_HEIGHT
      }}
    >
      <StyledHomeHeaderContent>
        <HomeHeaderLeftButton
          navigation={navigation}
          hasSearchResults={hasSearchResults}
          setSearchEmpty={setSearchEmpty}
        />
        <Search
          transparent
          onChangeText={onSearchText}
          placeholder="Search ambi"
        />
      </StyledHomeHeaderContent>
    </StyledHomeHeader>
  );
};

export default HomeHeader;
