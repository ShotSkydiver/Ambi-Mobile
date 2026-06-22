import React, { memo, useState } from 'react';
import { View, Text } from 'react-native';
import { RectButton, BorderlessButton } from 'react-native-gesture-handler';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import i18n from 'format-message';
import { useTheme } from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { AmbiColors } from '../shared/contexts/themeContext';
import { DEFAULT_COMMUNITY_AVATAR } from '../shared/constants';
import SpacesService from '../Spaces/SpacesService';
import { getSinglePost } from '../Feed/redux/actions';
import { formatDate, actionResolvedModeration } from '../shared/utils/helpers';
import { NOTIFICATION_KIND } from './enums';
import { newsfeedType } from '../Feed/enums';
import { User } from '../models/User';

import Avatar from '../shared/Avatars';

const NotificationWrapper = styled(View)`
  flex-direction: row;
  align-items: center;
  padding: 12px 6px;
`;

const NotificationContent = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  flex-direction: row;
`;

const NotificationInfo = styled(RectButton)`
  flex: 1;
  margin: 0 5px 0 16px;
`;

const NotificationText = styled(Text)`
  font-size: 14px;
  line-height: 18px;
  font-family: Circular-Book;
`;

const Bold = styled(NotificationText)`
  font-family: Circular-Bold;
`;

const NotificationTime = styled(Text)`
  font-family: Circular-Book;
  opacity: 0.6;
  font-size: 14px;
  line-height: 18px;
  margin-top: 2px;
`;

const MarkAsRead = styled(View)`
  height: 11px;
  width: 11px;
  background-color: ${AmbiColors.ambiBlue};
  border-radius: 50px;
  margin-right: 12px;
`;

const ModerationReportNotification = styled(Text)``;

const ModerationReportTapMessage = styled(Text)`
  font-family: Circular-Book;
  opacity: 0.6;
  font-size: 14px;
  line-height: 18px;
`;

const areEqual = (prevProps, nextProps) => {
  return (
    prevProps.notification.dateConsumed === nextProps.notification.dateConsumed
  );
};

const moderationTypes = {
  post: 'post',
  comment: 'comment',
  reply: 'reply'
};

const SingleNotification = memo(
  ({
    notification,
    navigation,
    currentUser,
    markAsRead,
    title,
    swipeableRefs,
    index
  }) => {
    const dispatch = useDispatch();
    const {
      id,
      originatedBy,
      directedTo,
      notificationType,
      dateConsumed,
      dateCreated,
      toUserId,
      attributes
    } = notification;

    const isOnboarding = notificationType === NOTIFICATION_KIND.onboarding;
    const isRoleChange = notificationType === NOTIFICATION_KIND.role_change;
    const isAddedbyDomain =
      notificationType === NOTIFICATION_KIND.added_to_community_by_domain;
    const isModerationPostReport =
      notificationType === NOTIFICATION_KIND.moderation_post_report;
    const isModerationEscalatedReport =
      notificationType === NOTIFICATION_KIND.moderation_escalated_report;
    const isModerationPostReportToUser =
      notificationType === NOTIFICATION_KIND.moderation_post_report_to_user;
    const isPostLike = notificationType === NOTIFICATION_KIND.post_like;
    const isPostComment = notificationType === NOTIFICATION_KIND.post_comment;
    const isLikesCounter = attributes && attributes.likesCounter;
    const isCommentsCounter = attributes && attributes.commentsCounter;
    const isModerationProfileFeed = !!(
      (isModerationPostReport || isModerationEscalatedReport) &&
      !directedTo.class &&
      !directedTo.group &&
      !directedTo.community &&
      directedTo.user
    );
    const isModerationResolved =
      notificationType === NOTIFICATION_KIND.moderation_dismissed_post_report ||
      notificationType === NOTIFICATION_KIND.moderation_deleted_post_report ||
      notificationType === NOTIFICATION_KIND.moderation_removed_author_report ||
      notificationType ===
        NOTIFICATION_KIND.moderation_restricted_author_report;

    const counter =
      notification.attributes.likesCounter ||
      attributes.likesCommentCounter ||
      attributes.commentsCounter ||
      notification.attributes.commentsCounter ||
      notification.attributes.repliesCounter;
    const isDirectedToCurrentUser = toUserId === currentUser.id;
    const from =
      typeof originatedBy === 'object'
        ? originatedBy[
            Object.keys(originatedBy).filter(k => originatedBy[k] != null)[0]
          ]
        : 'system';
    const to =
      directedTo[Object.keys(directedTo).filter(k => directedTo[k] != null)[0]];
    const [showTapMessage, setShowTapMessage] = useState(false);

    const allPosts = useSelector(state => state.feed.posts);
    const existingPost = allPosts.find(
      p => p.uniqueIdentifier === directedTo?.post?.uniqueIdentifier
    );

    const getAddedByDomainAvatar = () => {
      const { community } = directedTo;
      const { avatarMedia, avatarUrl } = community;
      if (avatarMedia || avatarUrl) {
        const returnUrl = avatarMedia ? avatarMedia.links.content : avatarUrl;
        return returnUrl;
      }
      return community.color;
    };

    const getModerationReportAvatar = () => {
      let returnUrl = null;
      const space =
        directedTo.class ||
        directedTo.group ||
        directedTo.community ||
        directedTo.user;

      if (isModerationResolved) {
        returnUrl = originatedBy.user.avatarUrl
          ? originatedBy.user.avatarUrl
          : '';
      } else if (isModerationPostReportToUser) {
        const { avatarUrl } = directedTo.user;
        returnUrl = avatarUrl;
      } else if (!isModerationProfileFeed) {
        const { coverBannerUrl, coverBannerMedia } = space;
        returnUrl = coverBannerMedia
          ? coverBannerMedia.links.content
          : coverBannerUrl;
      } else {
        const { avatarUrl } = space;
        returnUrl = avatarUrl;
      }
      return returnUrl || DEFAULT_COMMUNITY_AVATAR;
    };

    const getNotificationAvatar = () => {
      if (isOnboarding) {
        return '';
      } else if (isAddedbyDomain) {
        return getAddedByDomainAvatar();
      } else if (
        isModerationPostReport ||
        isModerationEscalatedReport ||
        isModerationPostReportToUser ||
        isModerationResolved
      ) {
        return getModerationReportAvatar();
      } else {
        const { avatarMedia, avatarUrl, coverBannerMedia, coverBannerUrl } =
          from;
        if (avatarMedia || avatarUrl) {
          const returnUrl = avatarMedia ? avatarMedia.links.content : avatarUrl;
          return returnUrl;
        }
        const returnUrl = coverBannerMedia
          ? coverBannerMedia.links.content
          : coverBannerUrl;
        return returnUrl;
      }
    };

    const navigateToSpace = async spaceId => {
      try {
        const spaceType =
          directedTo.group != null
            ? 'group'
            : directedTo.class != null
            ? 'class'
            : 'community';
        const spaceInfo = await SpacesService.getSpaceItemById(
          spaceId,
          spaceType
        );
        spaceInfo.type = spaceType;
        navigation.navigate('Space', {
          spaceItem: spaceInfo
        });
      } catch (err) {
        console.error('cannot navigate to space: ', err);
      }
    };

    const handleTapMessage = () => {
      if (!dateConsumed) {
        markAsRead();
      }

      setShowTapMessage(!showTapMessage);
    };

    const navigateToPost = async () => {
      try {
        const {
          post: { uniqueIdentifier }
        } = directedTo;
        await getSinglePost({ postIdentifier: uniqueIdentifier, existingPost })(
          dispatch
        );
        navigation.navigate('NativeModalNavigator', {
          screen: 'SinglePostScreen',
          params: {
            postId: uniqueIdentifier,
            newsfeedType: newsfeedType.GENERAL,
            isSinglePostModal: true
          }
        });
      } catch (err) {
        console.error(err);
      }
    };

    /* Return post content format and validated */
    const getParsedPostContent = content => {
      let postContent = '';
      if (content) {
        postContent = `"${
          content.length >= 20 ? content.slice(0, 30) : content
        }" `;
      }

      return postContent;
    };

    const navigateTo = async () => {
      switch (notificationType) {
        case NOTIFICATION_KIND.onboarding:
          navigation.navigate('ModalNavigator', {
            screen: 'Profile',
            params: { user: currentUser }
          });
          break;
        case NOTIFICATION_KIND.added_to_community:
        case NOTIFICATION_KIND.added_to_community_by_domain:
        case NOTIFICATION_KIND.added_to_group:
        case NOTIFICATION_KIND.group_announcement:
        case NOTIFICATION_KIND.class_announcement:
          if (to.name) {
            await navigateToSpace(to.id);
          } else {
            const userToNavigate = isDirectedToCurrentUser ? currentUser : from;
            navigation.navigate('ModalNavigator', {
              screen: 'Profile',
              params: { user: userToNavigate }
            });
          }
          break;
        case NOTIFICATION_KIND.post_created_class:
        case NOTIFICATION_KIND.post_created_community:
        case NOTIFICATION_KIND.post_created_group:
        case NOTIFICATION_KIND.post_comment:
        case NOTIFICATION_KIND.post_like:
        case NOTIFICATION_KIND.moderation_post_report_to_user:
          navigateToPost();
          break;
        case NOTIFICATION_KIND.moderation_post_report:
        case NOTIFICATION_KIND.moderation_escalated_report:
          handleTapMessage();
          break;
        default:
          console.error('Notification has no kind to navigate to!');
      }
    };

    const markAsReadAndNavigateTo = async () => {
      if (!dateConsumed) {
        await markAsRead();
      }
      await navigateTo();
    };

    const openSwipeMenu = () => {
      if (swipeableRefs[index]) {
        swipeableRefs[index].openRight();
      }
    };

    const notifDetail = {
      fromName:
        isOnboarding || isAddedbyDomain
          ? ''
          : from.name || `${from.firstName} ${from.lastName}`,
      fromAvatar: getNotificationAvatar(),
      toName:
        isRoleChange || isOnboarding
          ? ''
          : to.name || `${isDirectedToCurrentUser ? 'your' : 'their'} profile`,
      title,
      isRead: dateConsumed != null
    };

    const {
      fromName,
      fromAvatar,
      toName,
      title: notifTitle,
      isRead
    } = notifDetail;
    const theme = useTheme();
    const { legacy: themeColors } = theme;

    const getStringBold = string => <Bold>{string}</Bold>;

    const getTypeModerationReport = () => {
      const postComment = directedTo?.postComment;
      let typeModerationReport = moderationTypes.post;
      if (postComment && postComment.parentPostCommentId) {
        typeModerationReport = moderationTypes.reply;
      } else if (postComment) {
        typeModerationReport = moderationTypes.comment;
      }
      return typeModerationReport;
    };

    const getModerationReportContent = () => {
      const space =
        directedTo.class ||
        directedTo.group ||
        directedTo.community ||
        directedTo.user;
      const { flagged, content: postContent, authorId } = attributes;
      const tapMessage = `\nTo review and take action on moderation items, please use our web app!`;
      let { name } = space;
      let moderationReportContent;

      if (isModerationProfileFeed) {
        const { firstName, lastName } = space;
        name = `${firstName} ${lastName}`;

        moderationReportContent = (
          <>
            A {getStringBold('post')} from the profile feed of{' '}
            {getStringBold(`${name}`)} has been{' '}
            {getStringBold(`flagged ${flagged} time${flagged > 1 ? 's' : ''}`)}
            for moderation
          </>
        );
      }

      const spaceName = getStringBold(name);
      const typeModerationReport = getTypeModerationReport();

      // default value if is moderation post
      moderationReportContent = (
        <>
          A {getStringBold(typeModerationReport)} has been{' '}
          {getStringBold(`flagged ${flagged} time${flagged > 1 ? 's' : ''}`)} in{' '}
          {spaceName} for moderation
        </>
      );

      // change content if is escalated notification
      if (isModerationEscalatedReport) {
        moderationReportContent = (
          <>
            A {getStringBold('post')} has been{' '}
            {getStringBold(`${flagged} item${flagged > 1 ? 's' : ''}`)} has been{' '}
            {getStringBold('escalated ')}
            to the moderation log of {spaceName}
          </>
        );
      }

      if (authorId) {
        const authorPostContent = getParsedPostContent(postContent);

        moderationReportContent = (
          <>
            Your {getStringBold('post')}
            {` ${authorPostContent}has been `}
            {getStringBold('flagged')}
          </>
        );
      }

      return (
        <>
          <ModerationReportNotification>
            {moderationReportContent}
          </ModerationReportNotification>
          {showTapMessage && (
            <ModerationReportTapMessage>
              {tapMessage}
            </ModerationReportTapMessage>
          )}
        </>
      );
    };

    const getNotificationContent = () => {
      if (
        isModerationPostReport ||
        isModerationEscalatedReport ||
        isModerationPostReportToUser
      ) {
        return getModerationReportContent();
      }

      if (
        typeof originatedBy === 'object' &&
        originatedBy.user &&
        !isModerationResolved
      ) {
        const originatedByUser = new User(originatedBy.user);
        const casesToHideUserInNotification = [
          'role_change',
          'added_to_community_by_domain'
        ];
        const directedToSpace =
          directedTo.community || directedTo.class || directedTo.group;
        const stringBase = title;
        let stringPrefix;
        let stringSuffix;
        let stringPreview = null;
        let { authorName } = attributes;
        const isLikeToComment =
          directedTo.postComment && notificationType === 'post_like';
        const isReplyToComment =
          directedTo.postCommentReply && notificationType === 'post_comment';
        const isAuthorPost =
          directedTo?.post?.createdByUserId === currentUser.id;

        if (directedTo?.post) {
          stringPreview = directedTo.post.content;
        }
        if (directedTo?.postComment) {
          stringPreview = directedTo.postComment.body;
        }
        if (directedTo?.postCommentReply) {
          stringPreview = directedTo.postCommentReply.body;
        }

        if (stringPreview && stringPreview.length > 60) {
          stringPreview = `${stringPreview.slice(0, 60)}...`;
        }

        if (isPostLike || isPostComment) {
          if (
            (!isAuthorPost &&
              directedTo.post.createdByUserId !== originatedBy.user.id) ||
            (counter && !isAuthorPost)
          ) {
            authorName = `${authorName} post`;
          } else if (
            (isAuthorPost &&
              directedTo.post.createdByUserId !== originatedBy.user.id) ||
            (counter && isAuthorPost)
          ) {
            authorName = 'your post';
          } else {
            authorName = 'their post';
          }
          return [
            !casesToHideUserInNotification.includes(notificationType) && (
              <Bold
                key={`notification-${id}-name`}
                style={
                  notificationType === 'post_created_individual'
                    ? {}
                    : { marginRight: 4 }
                }
              >
                {notification.attributes.likesCounter ||
                attributes.likesCounter ||
                attributes.commentsCounter ||
                attributes.likesCommentCounter ||
                notification.attributes.commentsCounter ||
                notification.attributes.repliesCounter
                  ? `${counter} Users `
                  : originatedByUser.getName()}
              </Bold>
            ),
            stringBase ? ` ${stringBase.trim()}` : null,
            directedToSpace && isAuthorPost && (
              <Text key={`notification-${id}-directed`}>
                {' '}
                in {getStringBold(directedToSpace.name)}
              </Text>
            ),
            !(isLikeToComment || isReplyToComment) && !isAuthorPost && (
              <Text key={`notification-${id}-directed`}>
                {' '}
                from {getStringBold(authorName)} you commented on
              </Text>
            ),
            (isLikeToComment || isReplyToComment) && (
              <Text key={`notification-${id}-directed`}>
                {' '}
                on {getStringBold(authorName)}
              </Text>
            ),
            stringPreview && (
              <Text
                key={`notification-${id}-preview`}
              >{`: "${stringPreview}"`}</Text>
            )
          ];
        } else {
          return [
            stringPrefix && stringPrefix.trim(),
            !casesToHideUserInNotification.includes(notificationType) && (
              <Bold
                key={`notification-${id}-name`}
                style={
                  notificationType === 'post_created_individual'
                    ? {}
                    : { marginRight: 4 }
                }
              >
                {notification.attributes.likesCommentCounter ||
                notification.attributes.likesCounter ||
                notification.attributes.commentsCounter ||
                notification.attributes.repliesCounter
                  ? `${counter} Users`
                  : originatedByUser.getName()}
              </Bold>
            ),
            stringBase ? ` ${stringBase.trim()}` : null,
            directedTo.community && notificationType !== 'role_change' && (
              <Bold key={`notification-${id}-directed`}>
                {' '}
                {directedTo.community.name}
              </Bold>
            ),
            directedTo.class && notificationType !== 'role_change' && (
              <Bold key={`notification-${id}-directed`}>
                {' '}
                {directedTo.class.name}
              </Bold>
            ),
            directedTo.group && notificationType !== 'role_change' && (
              <Bold key={`notification-${id}-directed`}>
                {' '}
                {directedTo.group.name}
              </Bold>
            ),
            directedTo.notebook && (
              <Bold key={`notification-${id}-directed`}>
                {' '}
                {directedTo.notebook.title}
              </Bold>
            ),
            notificationType === 'post_created_individual' && (
              <Bold key={`notification-${id}-directed`}> your profile</Bold>
            ),
            stringSuffix && stringSuffix.trim(),
            stringPreview && (
              <Text
                key={`notification-${id}-preview`}
              >{`: "${stringPreview}"`}</Text>
            )
          ].filter(x => x);
        }
      }

      if (isModerationResolved) {
        const reportType = attributes.reportType
          ? attributes.reportType
          : 'post';
        const { content: postContent } = attributes;
        const moderationPostContent = getParsedPostContent(postContent);
        const actionResolve = actionResolvedModeration(notificationType);

        if (actionResolve === 'dismissed' || actionResolve === 'deleted') {
          return (
            <>{`${`Your reported ${reportType} ${
              moderationPostContent > 0 ? `"${moderationPostContent}"` : ''
            }was ${actionResolve === 'deleted' ? 'removed' : 'dismissed'}`}`}</>
          );
        } else if (typeof originatedBy === 'object') {
          const {
            class: classSpace,
            group: groupSpace,
            community: communitySpace
          } = originatedBy;
          const objSpace = classSpace ||
            groupSpace ||
            communitySpace || { name: null };
          const { name: spaceName } = objSpace;

          if (spaceName && actionResolve === 'removed') {
            return (
              <>
                You have been removed from<Bold> {spaceName} </Bold>
              </>
            );
          } else if (spaceName && actionResolve === 'restricted') {
            return (
              <>
                You have been restricted in<Bold> {spaceName} </Bold>
              </>
            );
          }
        }
      }

      return (
        <>
          <Bold>
            {notification.attributes.likesCounter ||
            attributes.likesCounter ||
            attributes.commentsCounter ||
            notification.attributes.commentsCounter ||
            notification.attributes.repliesCounter
              ? `${counter} Users`
              : i18n('{fromName}', { fromName })}
          </Bold>
          {i18n('{title}', { title: notifTitle })}
          {' in '}
          <Bold>{i18n('{toName}', { toName })}</Bold>
        </>
      );
    };

    return (
      <NotificationWrapper
        style={{
          backgroundColor: isRead
            ? themeColors.body
            : themeColors.unreadNotificationBG
        }}
      >
        <NotificationContent>
          {!isRead && <MarkAsRead />}
          <Avatar
            size={40}
            url={fromAvatar}
            isOnboarding={isOnboarding}
            isAddedbyDomain={isAddedbyDomain}
            isModerationReport={isModerationPostReport}
            isModerationEscalatedReport={isModerationEscalatedReport}
            isModerationProfileFeed={isModerationProfileFeed}
            isLikesCounter={isLikesCounter}
            isCommentsCounter={isCommentsCounter}
            isModerationResolved={isModerationResolved}
            isModerationPostReportToUser={isModerationPostReportToUser}
          />
          <NotificationInfo
            onPress={markAsReadAndNavigateTo}
            rippleColor={themeColors.disabled}
            underlayColor={themeColors.elementBGColor}
            activeOpacity={0.4}
          >
            <NotificationText
              style={{ color: themeColors.textPrimary }}
              numberOfLines={4}
            >
              {getNotificationContent()}
            </NotificationText>
            <NotificationTime style={{ color: themeColors.textPrimary }}>
              {formatDate(dateCreated)}
            </NotificationTime>
          </NotificationInfo>
        </NotificationContent>
        <BorderlessButton
          onPress={openSwipeMenu}
          style={{ marginLeft: 8, marginRight: 4 }}
          borderless={false}
          activeOpacity={0.4}
          rippleColor={themeColors.disabled}
        >
          <FeatherIcon
            name="more-vertical"
            size={24}
            color={themeColors.textPrimary}
            onPress={openSwipeMenu}
          />
        </BorderlessButton>
      </NotificationWrapper>
    );
  },
  areEqual
);

SingleNotification.displayName = 'SingleNotification';

SingleNotification.propTypes = {
  notification: PropTypes.shape({
    originatedBy: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.string])
      .isRequired,
    directedTo: PropTypes.shape({}).isRequired,
    notificationType: PropTypes.string.isRequired
  }).isRequired,
  markAsRead: PropTypes.func.isRequired
};

export default SingleNotification;
