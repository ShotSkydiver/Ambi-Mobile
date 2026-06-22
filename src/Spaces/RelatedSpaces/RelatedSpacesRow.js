import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { RectButton, BorderlessButton } from 'react-native-gesture-handler';
import { useTheme } from '@react-navigation/native';
import styled from 'styled-components';
import Avatar from '../../shared/Avatars';
import { DEVICE_WIDTH } from '../../shared/constants';
import { AmbiColors } from '../../shared/contexts/themeContext';
import SpacesService from '../SpacesService';

const STATUS_JOINED = 'Joined';
const STATUS_REQUESTED = 'Request';
const STATUS_JOIN = 'Join';

const SectionHeader = styled(Text)`
  font-family: Circular-Bold;
  font-size: 18px;
  line-height: 23px;
`;

const RelatedSpaceRowContainer = styled(TouchableOpacity)`
  flex: 1;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  flex-direction: row;
`;

const RelatedSpaceInfo = styled(View)`
  margin-left: 16px;
  margin-right: auto;
  justify-content: center;
`;

const RelatedSpaceName = styled(Text)`
  font-family: Circular-Bold;
  font-size: 16px;
  line-height: 20px;
`;

const RelatedSpaceDetails = styled(Text)`
  font-family: Circular-Book;
  font-size: 14px;
  line-height: 18px;
  opacity: 0.6;
`;

const RelatedSpaceStatus = styled(Text)`
  font-family: Circular-Book;
  color: ${AmbiColors.ambiBlue};
  font-size: 16px;
  line-height: 20px;
`;

const getStatus = (attributes, isPrivate = false) => {
  let status = STATUS_JOIN;
  if (isPrivate || (attributes && attributes.is_pending)) {
    status = STATUS_REQUESTED;
  } else if (attributes && !attributes.is_pending) {
    status = STATUS_JOINED;
  }
  return status;
};

const RelatedSpacesRow = ({ item, onPress }) => {
  const type = item.isPrivate ? `Closed - ` : ``;
  const userAvatarUrl = item.coverBannerUrl;
  const [requestActive, setRequestActive] = useState(false);
  const [membersCount, setMembersCount] = useState(item.membersCount);
  const initialStatus = getStatus(item.myRequestToJoin.attributes);
  const [statusUpdate, setStatusUpdate] = useState(initialStatus);
  const isJoined = statusUpdate === STATUS_JOINED;

  const theme = useTheme();
  const { legacy: themeColors } = theme;

  const handlePress = async item => {
    setRequestActive(true);
    const response = await SpacesService.joinRelatedSpaces(
      item.uniqueIdentifier,
      item.isPrivate
    );

    if (item.isPrivate) {
      setStatusUpdate(getStatus(response.attributes, true));
    } else if (response) {
      setStatusUpdate(getStatus(response.attributes));
      const members = membersCount + 1;
      setMembersCount(members);
    }
  };

  return (
    <RectButton
      rippleColor={themeColors.disabled}
      underlayColor={themeColors.elementBGColor}
      activeOpacity={0.4}
      style={{ marginRight: 1 }}
      onPress={isJoined ? onPress : null}
    >
      <RelatedSpaceRowContainer style={{ height: 72 }}>
        <Avatar rectangle url={userAvatarUrl} size={40} />
        <RelatedSpaceInfo>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{ width: DEVICE_WIDTH - 180 }}
          >
            <RelatedSpaceName
              style={{ color: themeColors.textPrimary }}
            >{`${item.name}`}</RelatedSpaceName>
          </Text>
          <Text>
            <RelatedSpaceDetails style={{ color: themeColors.textPrimary }}>
              {`${type}${membersCount} ${
                membersCount > 1 ? 'members' : 'member'
              }`}
            </RelatedSpaceDetails>
          </Text>
        </RelatedSpaceInfo>
        {initialStatus !== STATUS_REQUESTED ||
        initialStatus !== STATUS_JOINED ? (
          <BorderlessButton onPress={() => !requestActive && handlePress(item)}>
            <RelatedSpaceStatus style={{ marginRight: 15 }}>
              {statusUpdate || initialStatus}
            </RelatedSpaceStatus>
          </BorderlessButton>
        ) : (
          <RelatedSpaceStatus style={{ marginRight: 15 }}>
            {initialStatus}
          </RelatedSpaceStatus>
        )}
      </RelatedSpaceRowContainer>
    </RectButton>
  );
};

RelatedSpacesRow.defaultProps = {
  onPress: null,
  item: []
};

RelatedSpacesRow.propTypes = {
  onPress: PropTypes.func,
  item: PropTypes.oneOfType([PropTypes.object])
};

export { SectionHeader };
export default RelatedSpacesRow;
