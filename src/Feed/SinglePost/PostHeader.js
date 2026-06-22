import React, { memo } from 'react';
import { View, Text, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import FeatherIcon from 'react-native-vector-icons/Feather';
import i18n from 'format-message';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useTheme } from '@react-navigation/native';

// redux
import { updateCurrentUserInView } from '../../Profile/redux/actions';

// components
import Pill from '../../shared/Pill';
import Avatar from '../../shared/Avatars';

// helpers
import { User } from '../../models/User';
import { newsfeedType as feedType, permissionScopeName } from '../enums';
import { formatDate, parsePostCreatedBy } from '../../shared/utils/helpers';
import { AmbiColors } from '../../shared/contexts/themeContext';
// constants
import { DEFAULT_PROFILE_PIC } from '../../shared/constants';

const PostHeaderContainer = styled(View)`
  flex: 1;
  flex-direction: row;
`;

const StyledAvatar = styled(Avatar)`
  margin-right: 12px;
`;

const PosterInfo = styled(View)`
  width: 80%;
`;

const PostedInfoTitle = styled(Text)`
  width: 100%;
`;

const PosterName = styled(Text)`
  font-family: Circular-Bold;
  font-size: 14px;
  line-height: 18px;
`;

const PostedWhereLink = styled(PosterName)``;

const PosterIndicatorTime = styled(View)`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

const PostTime = styled(Text)`
  margin-left: ${({ marginLeft }) => marginLeft};
  opacity: 0.6;
  font-family: Circular-Book;
  font-size: 12px;
  line-height: 15px;
`;

const PostBroadcasted = styled(Text)`
  font-family: Circular-Book;
  font-size: 12px;
  line-height: 15px;
`;

const Icon = styled(FeatherIcon)`
  margin-left: 2px;
`;

let globalOptionsMenu = [];

const PostHeader = ({
  navigation,
  post,
  deletePost,
  togglePostPin,
  currentUser,
  isPinned,
  newsfeedType,
  hostInfo,
  isSinglePostModal = false
}) => {
  const dispatch = useDispatch();
  const { createdBy, postedTo, dateCreated, broadcastEnabled } = post;
  const [{ avatarUrl, createdByTitle, linkTo, roleTitle, color }] =
    parsePostCreatedBy(createdBy);
  const [
    {
      avatarUrl: postedToAvatarUrl,
      createdByTitle: postedToText,
      linkTo: linkToPostedTo
    }
  ] = parsePostCreatedBy(postedTo);

  const { showActionSheetWithOptions } = useActionSheet();

  const user = new User(currentUser);
  const isAdmin = user.isAdmin();
  const scope = permissionScopeName[newsfeedType];
  const myOwnPost = createdBy?.user?.id === currentUser.id;
  const showRoleTitle = !broadcastEnabled && isSinglePostModal;

  let postedUserLinkTo = postedToText;
  if (postedTo.user && createdBy.user) {
    if (linkTo === linkToPostedTo) {
      postedUserLinkTo = 'their feed';
    } else if (postedTo.user.id === currentUser.id) {
      postedUserLinkTo = 'your feed';
    } else {
      postedUserLinkTo = `${postedToText}'s feed`;
    }
  }

  const handlePostDelete = () => {
    return Alert.alert(
      'Delete Post?',
      `Are you sure you want to delete this post?`,
      [
        {
          text: 'Cancel',
          onPress: () => console.warn('Cancel pressed'),
          style: 'cancel'
        },
        {
          text: 'Delete',
          onPress: deletePost,
          style: 'destructive'
        }
      ],
      {
        cancelable: true
      }
    );
  };

  const navigateToProfile = userToNavigate => {
    const navigateToCurrentUser = userToNavigate.id === currentUser.id;
    if (userToNavigate) {
      const user = navigateToCurrentUser
        ? currentUser
        : { id: userToNavigate.id, profile: userToNavigate };
      updateCurrentUserInView(user)(dispatch);
      navigation.navigate('ModalNavigator', {
        screen: 'Profile',
        params: { user }
      });
    }
  };

  const navigatePostedTo = () => {
    const isPostedToGroup = postedTo.group;
    const isPostedToClass = postedTo.class;
    const isPostedToCommunity = postedTo.community;
    const postedToSpace =
      isPostedToClass || isPostedToGroup || isPostedToCommunity;

    try {
      if (postedToSpace) {
        const spaceType = isPostedToGroup
          ? 'group'
          : isPostedToClass
          ? 'class'
          : 'community';
        postedToSpace.type = spaceType;
        navigation.navigate('Space', { spaceItem: postedToSpace });
      } else {
        navigateToProfile(postedTo.user);
      }
    } catch (err) {
      console.warn('cannot navigate to space : ', err);
    }
  };

  const navigateToCreator = () => {
    const postCreator = post.createdBy && post.createdBy.user;
    navigateToProfile(postCreator);
  };

  const showPostedTo = newsfeedType === feedType.GENERAL || isSinglePostModal;
  const theme = useTheme();
  const { legacy: themeColors } = theme;

  // ============= // manage menu // ==================//
  const menuOptions = {
    edit: {
      label: i18n('Edit post'),
      action: () =>
        navigation.navigate('NativeModalNavigator', {
          screen: 'EditPostScreen',
          params: {
            post,
            newsfeedType,
            avatarUrl: avatarUrl || DEFAULT_PROFILE_PIC,
            hostInfo
          }
        })
    },
    delete: {
      label: i18n('Delete post'),
      action: () => handlePostDelete()
    },
    pin: {
      label: !isPinned ? i18n('Pin post') : i18n('Unpin post'),
      action: () => togglePostPin(isPinned)
    },
    report: {
      label: 'Report post',
      action: () =>
        navigation.navigate('NativeModalNavigator', {
          screen: 'ReportPostScreen',
          params: { post }
        })
    },
    cancel: {
      label: i18n('Cancel')
    }
  };

  const onActionMenu = index => {
    if (globalOptionsMenu[index] && globalOptionsMenu[index].action) {
      globalOptionsMenu[index].action();
    }
  };

  const loadMenu = () => {
    const { poll } = post;
    const {
      pin: optionPin,
      edit: optionEdit,
      delete: optionDelete,
      cancel: optionCancel,
      report: optionReport
    } = menuOptions;

    globalOptionsMenu = [optionEdit, optionDelete, optionCancel];
    if (poll && Object.keys(poll.votes).length > 0) {
      globalOptionsMenu = [optionDelete, optionCancel];
    } else if (!myOwnPost) {
      globalOptionsMenu = [optionReport, optionCancel];
    }

    if (myOwnPost || (isAdmin && scope !== 'individual')) {
      const positionOptionPin = globalOptionsMenu.length - 2;
      globalOptionsMenu.splice(positionOptionPin, 0, optionPin);
    }

    showActionSheetWithOptions(
      {
        options: [...globalOptionsMenu].map(({ label }) => label),
        cancelButtonIndex: globalOptionsMenu.length + 1,
        tintColor: AmbiColors.ambiBlue,
        title: 'Post Options'
      },
      buttonIndex => {
        onActionMenu(buttonIndex);
      }
    );
  };

  return (
    <PostHeaderContainer>
      <StyledAvatar
        size={40}
        onPress={broadcastEnabled ? navigatePostedTo : navigateToCreator}
        url={broadcastEnabled ? postedToAvatarUrl : avatarUrl}
        rectangle={broadcastEnabled}
      />
      <PosterInfo>
        <PostedInfoTitle
          ellipsizeMode="tail"
          numberOfLines={1}
          style={{ color: themeColors.textPrimary }}
        >
          <PosterName
            onPress={broadcastEnabled ? navigatePostedTo : navigateToCreator}
          >
            {broadcastEnabled ? postedToText : createdByTitle}{' '}
          </PosterName>
          {showPostedTo &&
            `posted ${postedTo.user && createdBy.user ? 'on' : 'in'}`}
          {showPostedTo && (
            <PostedWhereLink onPress={navigatePostedTo}>
              {' '}
              {postedUserLinkTo}
            </PostedWhereLink>
          )}
        </PostedInfoTitle>
        <PosterIndicatorTime>
          {broadcastEnabled && (
            <PostBroadcasted style={{ color: themeColors.slateGray }}>
              Broadcasted by{' '}
              <PosterName onPress={navigateToCreator} style={{ fontSize: 12 }}>
                {createdByTitle}
              </PosterName>{' '}
              -{' '}
            </PostBroadcasted>
          )}
          {!showRoleTitle && <Pill role={roleTitle} roleColor={color} />}
          <PostTime
            style={{ color: themeColors.textPrimary }}
            marginLeft={broadcastEnabled ? '0px' : '6px'}
          >
            {formatDate(dateCreated, true)}
          </PostTime>
        </PosterIndicatorTime>
      </PosterInfo>
      <Icon
        name="more-vertical"
        size={22}
        style={{ color: themeColors.slateGray }}
        onPress={loadMenu}
      />
    </PostHeaderContainer>
  );
};

function areEqual(prevProps, nextProps) {
  return (
    prevProps.isPinned === nextProps.isPinned &&
    prevProps.newsfeedType === nextProps.newsfeedType &&
    prevProps.post.dateEdited === nextProps.post.dateEdited
  );
}

export default memo(PostHeader, areEqual);
