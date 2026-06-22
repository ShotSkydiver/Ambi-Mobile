import React, { useEffect, useState, useRef } from 'react';
import {
  Animated,
  View,
  FlatList,
  RefreshControl,
  TouchableWithoutFeedback
} from 'react-native';
import {
  useTheme,
  useScrollToTop,
  useIsFocused
} from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import i18n from 'format-message';
import {
  Fade,
  Placeholder,
  PlaceholderLine,
  PlaceholderMedia
} from 'rn-placeholder';

import { loadPosts, FETCH_MORE_POSTS } from './redux/actions';
import { getFeedPosts } from './redux/selectors';
import SinglePost from './SinglePost/SinglePost';
import CreatePostBox from './PostCreator/CreatePostBox';
import EmptyState from '../shared/EmptyState';
import debounce from '../shared/utils/debounce';
import { AmbiColors } from '../shared/contexts/themeContext';
import { newsfeedType as feedType } from './enums';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const FeedContainer = styled(View)`
  flex: 1;
`;

const PlaceholderContainer = styled(View)`
  flex: 1;
  margin: 20px 30px;
  opacity: 0.75;
  z-index: 10;
  elevation: 10;
  align-items: center;
  justify-content: center;
`;

function Feed({
  navigation,
  route,
  newsfeedType,
  hostInfo,
  topPadding,
  headerHeight,
  headerComponent,
  emptyComponent,
  hidePageLoader,
  onScroll
}) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const posts = useSelector(getFeedPosts(newsfeedType));
  const currentPage = useSelector(state => state.feed.currentPage);
  const hasMorePosts = useSelector(state => state.feed.hasMorePosts);
  const loadingPosts = useSelector(state => state.feed.loadingPosts);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [showPosts, setShowPosts] = useState(false);
  const [idShowReaction, setIdShowReaction] = useState(-1);

  const isHomeFeed =
    (hostInfo === null || !hostInfo) && newsfeedType === feedType.GENERAL;
  if (isHomeFeed) {
    console.warn('IS HOME FEEEED');
  }
  const hostId = hostInfo ? hostInfo.id : user.id;

  const isFocused = useIsFocused();
  const scrollTopRef = useRef(null);
  useScrollToTop(scrollTopRef);

  useEffect(() => {
    loadPosts(hostId, newsfeedType, 1, user.id, isHomeFeed)(dispatch);
    debounce(() => setShowPosts(true), 100);
  }, []);

  useEffect(() => {
    if (isFocused) {
      dispatch({
        type: FETCH_MORE_POSTS,
        hasMorePosts: true
      });
    }
  }, [isFocused]);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadPosts(hostId, newsfeedType, 1, user.id, isHomeFeed)(dispatch);
    setIsRefreshing(false);
  };

  const tryFetchMorePosts = async () => {
    if (!loadingPosts && hasMorePosts) {
      setFetchingMore(true);
      await loadPosts(
        hostId,
        newsfeedType,
        currentPage + 1,
        user.id,
        isHomeFeed
      )(dispatch);
      setFetchingMore(false);
    }
    setIsRefreshing(false);
  };

  const postKeyExtractor = (item, index) =>
    item.id ? item.id.toString() : index;
  const loadingKeyExtractor = (_, index) => `loading-${index}`;

  const renderPost = ({ item }) => {
    return (
      <SinglePost
        post={item}
        route={route}
        isModal
        hostInfo={hostInfo}
        navigation={navigation}
        currentUser={user}
        newsfeedType={newsfeedType}
        containerStyles={{ marginTop: 12 }}
        idShowReaction={idShowReaction}
        setIdShowReaction={setIdShowReaction}
      />
    );
  };

  const renderHeader = () =>
    headerComponent || (
      <CreatePostBox
        user={user}
        route={route}
        hostInfo={hostInfo}
        navigation={navigation}
        newsfeedType={newsfeedType}
      />
    );

  const theme = useTheme();
  const { legacy: customColors } = theme;
  const insets = useSafeAreaInsets();
  const adjustedTopPadding = topPadding || insets.top;

  const backgroundStyle = { backgroundColor: customColors.body };

  const renderPlaceholderItem = () => (
    <PlaceholderContainer>
      <Placeholder
        Left={PlaceholderMedia}
        style={backgroundStyle}
        Animation={Fade}
      >
        <PlaceholderLine width={100} style={backgroundStyle} />
        <PlaceholderLine width={80} style={backgroundStyle} />
      </Placeholder>
    </PlaceholderContainer>
  );

  return (
    <TouchableWithoutFeedback
      onPress={() => setIdShowReaction(-1)}
      disabled={idShowReaction < 0}
    >
      <FeedContainer style={backgroundStyle}>
        {!showPosts &&
        loadingPosts &&
        !fetchingMore &&
        !isRefreshing &&
        !hidePageLoader ? (
          <FlatList
            data={Array(8).fill(0)}
            style={{ flex: 1, color: customColors.textPrimary }}
            renderItem={renderPlaceholderItem}
            keyExtractor={loadingKeyExtractor}
            contentContainerStyle={{ paddingTop: topPadding || 0 }}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <AnimatedFlatList
            ref={scrollTopRef}
            data={posts}
            onScroll={onScroll || null}
            initialNumToRender={10}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                style={{
                  backgroundColor: 'transparent'
                }}
                tintColor={AmbiColors.ambiBlue}
                colors={[AmbiColors.ambiBlue]}
              />
            }
            extraData={posts}
            progressViewOffset={adjustedTopPadding}
            onEndReached={tryFetchMorePosts}
            ListEmptyComponent={
              emptyComponent || <EmptyState title={i18n('No Posts here!')} />
            }
            ListHeaderComponent={renderHeader}
            onEndReachedThreshold={0.5}
            renderItem={renderPost}
            keyExtractor={postKeyExtractor}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={1}
            contentContainerStyle={{
              paddingTop: headerHeight || adjustedTopPadding
            }}
            CellRendererComponent={({ children, index, style, ...props }) => (
              <View
                style={[style, { zIndex: posts.length - index }]}
                index={index}
                {...props}
              >
                {children}
              </View>
            )}
          />
        )}
      </FeedContainer>
    </TouchableWithoutFeedback>
  );
}

export default Feed;
