import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/FontAwesome';
import { View, Text, TouchableOpacity } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { AmbiColors } from './contexts/themeContext';
import AmbiLogo from './images/ambi_logo.svg';
import { DEFAULT_PROFILE_PIC } from './constants';

const StyledBorder = styled(View)`
  border-radius: ${({ size }) => Math.round(size / 2)}px;
  border: ${({ size }) =>
    size === 60 ? '1px solid white;' : '1px solid rgba(0, 0, 0, 0.1);'};
`;

const BaseAvatar = styled(FastImage)`
  border-radius: ${({ size }) => Math.round(size / 2)}px;
  height: ${({ size }) => size}px;
  width: ${({ size }) => size}px;
  flex: 0 0 ${({ size }) => size}px;
  overflow: hidden;
  background-color: ${({ color }) => color || 'transparent'};
`;

const StyledCircleAvatar = styled(BaseAvatar)``;

const StyledRectangleAvatar = styled(BaseAvatar)`
  border-radius: 5px;
`;

const OnlineStatus = styled(View)`
  width: ${({ size }) => size * 0.3}px;
  height: ${({ size }) => size * 0.3}px;
  border-radius: ${({ size }) => size * 0.2}px;
  background-color: ${({ status }) =>
    status === 'online' ? AmbiColors.positive : '#e6eaf2'};
  position: absolute;
  left: ${({ size }) => size * 0.7}px;
  top: ${({ size }) => size * 0.7}px;
  border: 1px solid #ffffff;
`;

const MessageIcon = styled(FeatherIcon)`
  margin-right: 6px;
`;

export const getAvatarUrlFromUser = user => {
  const { avatarUrl, avatarMedia } = user;
  return avatarMedia &&
    avatarMedia.links &&
    (avatarMedia.links.image_40_40 || avatarMedia.links.content)
    ? avatarMedia.links.content
    : avatarUrl;
};

export default function Avatar({
  url,
  rectangle,
  size,
  onPress,
  onlineStatus,
  isOnboarding,
  style,
  isAddedbyDomain,
  isModerationReport,
  isModerationEscalatedReport,
  isModerationProfileFeed,
  isLikesCounter,
  isCommentsCounter,
  isSpaceDetails,
  isModerationPostReportToUser
}) {
  let StyledAvatar = StyledCircleAvatar;
  if (isModerationProfileFeed || isModerationPostReportToUser) {
    StyledAvatar = StyledCircleAvatar;
  } else if (
    rectangle ||
    isAddedbyDomain ||
    isModerationReport ||
    isModerationEscalatedReport
  ) {
    StyledAvatar = StyledRectangleAvatar;
  }

  const avatarUrl = url || DEFAULT_PROFILE_PIC;
  const showPicture = !(
    (isModerationReport && !avatarUrl) ||
    (isModerationEscalatedReport && !avatarUrl) ||
    (isModerationPostReportToUser && !avatarUrl)
  );
  const showAmbiLogo = isOnboarding || (!url && isSpaceDetails);

  let icon = (
    <StyledAvatar
      size={size}
      style={!showPicture && { backgroundColor: url.avatarColor }}
      source={
        showPicture && {
          uri:
            avatarUrl ||
            'https://static.ambi.school/images/ambi/default-profile-pic.png',
          priority: FastImage.priority.normal
        }
      }
      resizeMode={FastImage.resizeMode.cover}
    />
  );

  if (showAmbiLogo) {
    icon = (
      <AmbiLogo width={size - 14} height={size - 14} style={{ margin: 7 }} />
    );
  }

  if (isLikesCounter) {
    icon = (
      <Icon name="heart" size={20} color="#ED1E7A" style={{ padding: 10 }} />
    );
  }

  if (isCommentsCounter) {
    icon = (
      <MessageIcon
        name="message-square"
        size={20}
        color={AmbiColors.ambiLightBlue}
        style={{ padding: 10 }}
      />
    );
  }

  return (
    <TouchableOpacity disabled={!onPress} onPress={onPress} style={style}>
      <StyledBorder size={size}>
        {icon}
        {onlineStatus && <OnlineStatus size={size} status={onlineStatus} />}
      </StyledBorder>
    </TouchableOpacity>
  );
}

Avatar.propTypes = {
  url: PropTypes.string,
  size: PropTypes.number.isRequired,
  rectangle: PropTypes.bool,
  onlineStatus: PropTypes.oneOf(['online', 'offline']),
  isOnboarding: PropTypes.bool
};

Avatar.defaultProps = {
  url: null,
  rectangle: false,
  onlineStatus: null,
  isOnboarding: false
};

const BaseAvatarCount = styled(View)`
  border-radius: ${({ size }) => Math.round(size / 2)}px;
  width: ${props => props.size - 2}px;
  height: ${props => props.size - 2}px;
  flex: 0 0 ${({ size }) => size - 2}px;
  overflow: hidden;
  background-color: #e6eaf2;
  align-items: center;
  justify-content: center;
`;

const StyledCountText = styled(Text)`
  color: #707689;
  font-family: Circular-Bold;
  font-size: 22px;
`;

const StyledCircleAvatarCount = styled(BaseAvatarCount)``;

const StyledRectangleAvatarCount = styled(BaseAvatarCount)`
  border-radius: 5px;
`;

function AvatarCount({ count, size, rectangle, style }) {
  const StyledAvatar = rectangle
    ? StyledRectangleAvatarCount
    : StyledCircleAvatarCount;
  return (
    <View style={style}>
      <StyledBorder size={size}>
        <StyledAvatar size={size}>
          <StyledCountText>+{count}</StyledCountText>
        </StyledAvatar>
      </StyledBorder>
    </View>
  );
}

const StyledAvatarGroup = styled(View)`
  height: ${props => props.height}px;
  width: ${props => props.width}px;
  justify-content: center;
  align-items: center;
  margin: 1px;
`;

const OffsetAvatar = styled(Avatar)`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
`;

const OffsetAvatarCount = styled(AvatarCount)`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
`;

const getDimensions = (urlCount, size) => {
  switch (urlCount) {
    case 1:
    default:
      return [{}];
    case 2:
      return [
        { top: 0.5, left: 0 },
        { top: 0.5, right: 0 }
      ];
    case 3:
      return [
        { top: 0, left: size * 0.5 },
        { bottom: 0, left: 0 },
        { bottom: 0, right: 0 }
      ];
    case 4:
      return [
        { bottom: 0, left: 0 },
        { top: 0, left: 0 },
        { top: 0, right: 0 },
        { bottom: 0, right: 0 }
      ];
  }
};

export function AvatarGroup({
  rectangle,
  urls,
  size: groupSize,
  overlapPercent = 0.1
}) {
  const urlCount = Math.min(urls.length, 4);
  const size = urlCount < 2 ? groupSize : groupSize * (0.5 + overlapPercent);
  const dimensions = getDimensions(urlCount, groupSize / 2);
  return (
    <StyledAvatarGroup
      width={groupSize}
      height={urls.length === 2 ? size : groupSize}
    >
      {urls.slice(0, 4).map((url, index) => {
        return index === 3 && urls.length > 4 ? (
          <OffsetAvatarCount
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            size={size}
            style={dimensions[index]}
            rectangle={rectangle}
            count={urls.length - 4}
          />
        ) : (
          <OffsetAvatar
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            url={url.url}
            size={size}
            style={dimensions[index]}
            rectangle={rectangle}
            onlineStatus={
              urlCount > 1 || url.hideOnline || !url.isOnline
                ? null
                : url.isOnline
                ? 'online'
                : 'offline'
            }
          />
        );
      })}
    </StyledAvatarGroup>
  );
}

AvatarGroup.propTypes = {
  rectangle: PropTypes.bool,
  urls: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string,
      isOnline: PropTypes.bool,
      hideOnline: PropTypes.bool
    })
  ).isRequired,
  size: PropTypes.number
};

AvatarGroup.defaultProps = {
  rectangle: false,
  size: 36
};
