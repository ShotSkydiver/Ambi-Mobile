/* eslint-disable react/display-name */
import React, { useEffect, useLayoutEffect, useState, memo } from 'react';
import { View, FlatList, StatusBar, Alert, RefreshControl } from 'react-native';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { useTheme } from '@react-navigation/native';
import { BorderlessButton } from 'react-native-gesture-handler';
import Ionicon from 'react-native-vector-icons/Ionicons';

import {
  getNotifications,
  markOneAsRead,
  markOneAsHidden,
  markAllAsRead,
  updateNavUnreadCount
} from './redux/actions';

import SingleNotification from './SingleNotification';
import SwipeableNotificationRow from './SwipeableNotificationRow';
import HRLine from '../shared/HRLine';
import { NOTIFICATION_KIND } from './enums';
import { AmbiColors } from '../shared/contexts/themeContext';

const NotificationsList = styled(FlatList)`
  flex: 1;
`;

const SeparatorContainer = styled(View)`
  padding-horizontal: 16px;
`;

const Notifications = memo(
  ({
    navigation,
    notifications,
    currentUser,
    getNotifications,
    markOneAsHidden,
    markOneAsRead,
    markAllAsRead,
    updateNavUnreadCount,
    currentPage,
    isLoading,
    bottomNavUnreadCount
  }) => {
    const [swipeableRefs] = useState({});
    const [prevOpenedRow, setPrevOpenedRow] = useState(null);

    const theme = useTheme();
    const { legacy: themeColors } = theme;

    const getNotificationTitle = notif => {
      const { attributes, directedTo, notificationType } = notif;
      const { spaceName, roleName } = attributes;
      const createdByUserId =
        directedTo.post && directedTo.post.createdByUserId
          ? directedTo.post.createdByUserId
          : '';

      const notificationContent = {
        [NOTIFICATION_KIND.onboarding]: `Welcome to ambi! Click here to setup your profile`,
        [NOTIFICATION_KIND.added_to_community]: ` added you to the community`,
        [NOTIFICATION_KIND.added_to_community_by_domain]: `You have been added to the community:`,
        [NOTIFICATION_KIND.added_to_group]: ` added you to the group`,
        [NOTIFICATION_KIND.added_to_notebook]: ` added you to the notebook`,
        [NOTIFICATION_KIND.requested_to_join_community]: ` requested to join your community`,
        [NOTIFICATION_KIND.requested_to_join_group]: `requested to join your group`,
        [NOTIFICATION_KIND.group_announcement]: ` posted an announcement in`,
        [NOTIFICATION_KIND.class_announcement]: ` posted an announcement in`,
        [NOTIFICATION_KIND.post_created_class]: ` posted in`,
        [NOTIFICATION_KIND.post_created_community]: ` posted in`,
        [NOTIFICATION_KIND.post_created_group]: ` posted in`,
        [NOTIFICATION_KIND.post_like]: ` liked ${
          createdByUserId === currentUser.id && !directedTo.postComment
            ? ` your post`
            : `${
                directedTo.postComment && !directedTo.postCommentReply
                  ? 'a comment you made in'
                  : `${
                      directedTo.postComment && directedTo.postCommentReply
                        ? 'your reply'
                        : 'a post'
                    }`
              }`
        }`,
        [NOTIFICATION_KIND.post_comment]: `${
          !directedTo.postCommentReply ? ' commented' : ' replied'
        } ${
          directedTo.postCommentReply
            ? 'to your comment in'
            : `${
                createdByUserId === currentUser.id
                  ? `on your post`
                  : 'on a post'
              } `
        }`,
        [NOTIFICATION_KIND.role_change]: `Your role in ${spaceName} has been changed to ${roleName}`,
        [NOTIFICATION_KIND.post_created_individual]: ` posted on`
      };

      return notificationContent[notificationType];
    };

    const notificationsToRender = notifications.filter(
      n => getNotificationTitle(n) !== null
    );

    const markAllAsReadHandle = () => {
      notificationsToRender.forEach(notif => {
        markOneAsRead(notif);
      });
      markAllAsRead(notificationsToRender);
    };

    const handleMarkAllAsRead = () => {
      return Alert.alert(
        'Mark all as read?',
        '',
        [
          {
            text: 'Cancel',
            onPress: () => console.warn('Cancel pressed'),
            style: 'cancel'
          },
          {
            text: 'Confirm',
            onPress: markAllAsReadHandle,
            style: 'destructive'
          }
        ],
        {
          cancelable: true
        }
      );
    };

    useEffect(() => {
      updateNavUnreadCount();
    }, [bottomNavUnreadCount]);

    useLayoutEffect(() => {
      navigation.setOptions({
        headerRight: () => {
          const unreadCount = bottomNavUnreadCount || notificationsToRender;
          return (
            <BorderlessButton
              enabled={unreadCount > 0}
              onPress={handleMarkAllAsRead}
            >
              <Ionicon
                name="md-checkmark-circle-outline"
                size={25}
                color={
                  unreadCount > 0
                    ? themeColors.textPrimary
                    : themeColors.systemBorderColor
                }
                onPress={handleMarkAllAsRead}
              />
            </BorderlessButton>
          );
        }
      });
    }, [navigation]);

    useEffect(() => {
      const navListener = navigation.addListener('focus', () => {
        getNotifications();
      });
      return navListener;
    }, [navigation]);

    const renderSeparatorComponent = () => (
      <SeparatorContainer>
        <HRLine opacity={0.8} fullWidth />
      </SeparatorContainer>
    );

    const renderItem = ({ item, index }) => (
      <SwipeableNotificationRow
        markAsRead={() => markOneAsRead(item)}
        markAsHidden={() => markOneAsHidden(item)}
        notification={item}
        index={index}
        swipeableRefs={swipeableRefs}
        prevOpenedRow={prevOpenedRow}
        setPrevOpened={setPrevOpenedRow}
      >
        <SingleNotification
          notification={item}
          title={getNotificationTitle(item)}
          markAsRead={() => markOneAsRead(item)}
          currentUser={currentUser}
          navigation={navigation}
          index={index}
          swipeableRefs={swipeableRefs}
        />
      </SwipeableNotificationRow>
    );

    const loadNextPage = () => {
      getNotifications(currentPage + 1);
    };

    return (
      <View style={{ flex: 1, backgroundColor: themeColors.body }}>
        <NotificationsList
          data={notificationsToRender}
          extraData={notificationsToRender}
          initialNumToRender={10}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={renderSeparatorComponent}
          renderItem={renderItem}
          keyExtractor={(item, index) => (item.id ? item.id.toString() : index)}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={getNotifications}
              style={{
                backgroundColor: 'transparent'
              }}
              tintColor={AmbiColors.ambiBlue}
              colors={[AmbiColors.ambiBlue]}
            />
          }
          onEndReached={loadNextPage}
          onEndReachedThreshold={0.5}
          style={{ backgroundColor: themeColors.body }}
        />
        <StatusBar
          barStyle={theme.dark ? 'light-content' : 'dark-content'}
          backgroundColor="transparent"
          animated
        />
      </View>
    );
  }
);

const mapStateToProps = ({
  notifications: { list, page, isLoading, bottomNavUnreadCount },
  auth: { user }
}) => ({
  notifications: list,
  currentPage: page,
  currentUser: user,
  isLoading,
  bottomNavUnreadCount
});

export default connect(mapStateToProps, {
  getNotifications,
  markOneAsRead,
  markOneAsHidden,
  markAllAsRead,
  updateNavUnreadCount
})(Notifications);
