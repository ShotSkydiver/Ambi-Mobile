import React, { memo } from 'react';
import { View, Text } from 'react-native';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import i18n from 'format-message';
import { useTheme } from '@react-navigation/native';
import { AmbiColors } from '../../shared/contexts/themeContext';

const SinglePostTabList = styled(View)`
  flex-direction: row;
  margin-horizontal: 4px;
`;

const PostTabContainer = styled(View)`
  padding: 5px 16px;
  overflow: hidden;
  margin-right: 8px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`;
const PostTabText = styled(Text)`
  color: white;
  font-size: 14px;
  line-height: 18px;
  font-family: Circular-Bold;
`;

const PostPin = ({ color, label, theme }) => (
  <PostTabContainer
    style={{
      backgroundColor:
        color ||
        (label === i18n('Pinned') ? theme.slateGray : AmbiColors.razzmatazz)
    }}
  >
    <PostTabText>{label}</PostTabText>
  </PostTabContainer>
);

const SinglePostPins = ({ postPins, announcementEnabled }) => {
  const theme = useTheme();
  const { legacy: themeColors } = theme;

  return (
    <SinglePostTabList>
      {announcementEnabled && (
        <PostPin key="pin_announcement" label={i18n('Announcement')} />
      )}
      {postPins &&
        postPins.map(pin => (
          <PostPin
            key={pin.uniqueIdentifier}
            color={pin.color}
            label={pin.label}
            theme={themeColors}
          />
        ))}
    </SinglePostTabList>
  );
};

SinglePostPins.propTypes = {
  postPins: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      color: PropTypes.string
    })
  ).isRequired,
  announcementEnabled: PropTypes.bool.isRequired
};

const areEqual = (prevProps, nextProps) => {
  return (
    prevProps.postPins.length === nextProps.postPins.length &&
    prevProps.announcementEnabled === nextProps.announcementEnabled
  );
};

export default memo(SinglePostPins, areEqual);
