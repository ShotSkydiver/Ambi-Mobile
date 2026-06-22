/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react';
import { View, StatusBar } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import useSocket from '../shared/hooks/useSocket';
import useSearch from '../shared/hooks/useSearch';

import Feed from '../Feed';
import SearchResultsScreen from '../shared/SearchResultsScreen';
import HomeHeader from './HomeHeader';
import { IS_ANDROID, APPBAR_HEIGHT } from '../shared/constants';
import { newsfeedType } from '../Feed/enums';

export const FeedScreen = ({ navigation, route, ...rest }) => {
  const insets = useSafeAreaInsets();
  const STATUSBAR_HEIGHT = !IS_ANDROID ? insets.top : StatusBar.currentHeight;
  return (
    <Feed
      navigation={navigation}
      route={route}
      {...rest}
      newsfeedType={newsfeedType.GENERAL}
      topPadding={APPBAR_HEIGHT + STATUSBAR_HEIGHT}
    />
  );
};

const Home = ({ navigation }) => {
  const [socket, setSocket] = useState(null);
  const { searchResults, setSearchEmpty, onSearchText } = useSearch(socket);
  const { users, groups, classes, communities } = searchResults;
  const hasSearchResults = users || groups || classes || communities;

  useEffect(() => {
    navigation.setParams({ hasSearchResults });
  }, [hasSearchResults]);

  useSocket({
    onLoad: loadedSocket => {
      if (loadedSocket) {
        setSocket(loadedSocket);
      }
    }
  });

  const theme = useTheme();
  const { legacy: themeColors } = theme;

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.body }}>
      <HomeHeader
        navigation={navigation}
        hasSearchResults={hasSearchResults}
        setSearchEmpty={setSearchEmpty}
        onSearchText={onSearchText}
      />
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
        animated
      />
      {hasSearchResults ? (
        <SearchResultsScreen
          users={users}
          groups={groups}
          classes={classes}
          communities={communities}
          navigation={navigation}
        />
      ) : (
        <FeedScreen navigation={navigation} />
      )}
    </View>
  );
};

Home.displayName = 'Home';

export default Home;
