import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import styled from 'styled-components';
import { useTheme } from '@react-navigation/native';

import { DEFAULT_COLORS } from '../shared/constants';

const ListItem = styled(View)`
  flex: 1;
  flex-shrink: 0;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 72px;
  max-width: 375px;
`;

const ListItemImage = styled(FastImage)`
  height: 40px;
  width: 40px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  ${props =>
    props.noBanner &&
    `background-color: ${DEFAULT_COLORS[props.id % DEFAULT_COLORS.length]};`}
`;

const ListItemTitleWrapper = styled(TouchableOpacity)`
  width: 200px;
  height: 40px;
  flex: 1;
  justify-content: center;
  margin-right: auto;
  margin-left: 12px;
`;

const ListItemTitle = styled(Text)`
  font-family: Circular-Bold;
  font-size: 16px;
  line-height: 20px;
`;

const SpacesListItem = ({ data, navigate }) => {
  const { coverBannerMedia, coverBannerUrl, avatarMedia, avatarUrl, name } =
    data;
  const logoUrl = avatarMedia
    ? avatarMedia.links.image_40_40 || avatarMedia.links.content
    : avatarUrl;
  const coverUrl = coverBannerMedia
    ? coverBannerMedia.links.image_32_32 || coverBannerMedia.links.content
    : coverBannerUrl;
  const bannerUrl = logoUrl || coverUrl;
  const theme = useTheme();
  const { legacy: themeColors } = theme;
  return (
    <ListItem>
      <ListItemImage
        source={{ uri: bannerUrl || '', priority: FastImage.priority.normal }}
        resizeMode={FastImage.resizeMode.cover}
        noBanner={!bannerUrl}
        id={data.id}
      />
      <ListItemTitleWrapper onPress={navigate}>
        <ListItemTitle style={{ color: themeColors.textPrimary }}>
          {name}
        </ListItemTitle>
      </ListItemTitleWrapper>
    </ListItem>
  );
};

SpacesListItem.defaultProps = {
  data: {
    name: ''
  },
  navigate: null
};

SpacesListItem.propTypes = {
  navigate: PropTypes.func,
  data: PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    coverBannerMedia: PropTypes.object,
    name: PropTypes.string.isRequired
  })
};

export default SpacesListItem;
