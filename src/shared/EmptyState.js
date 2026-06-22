import React from 'react';
import { View, Image, Text } from 'react-native';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import i18n from 'format-message';
import { DEVICE_HEIGHT } from './constants';

const EmptyStateContainer = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  margin-top: ${DEVICE_HEIGHT / 4}px;
`;

const EmptyStateImage = styled(Image)`
  height: 78px;
  width: 217px;
`;
const EmptyStateTitle = styled(Text)`
  opacity: 0.5;
  font-family: Circular-Bold;
  font-size: 17px;
  line-height: 22px;
`;

const EmptyStateCaption = styled(EmptyStateTitle)`
  font-size: 14px;
  font-family: Circular-Book;
`;

const EmptyStateLink = styled(EmptyStateCaption)`
  color: #029ee2;
  opacity: 1;
`;

const EmptyState = ({
  imageUrl,
  title,
  caption,
  children,
  hasLink,
  linkText,
  onPress,
  style
}) => {
  return (
    <EmptyStateContainer style={style}>
      <EmptyStateImage source={{ uri: imageUrl }} />
      <EmptyStateTitle>{i18n('{title}', { title })}</EmptyStateTitle>
      {caption && (
        <EmptyStateCaption>{i18n('{caption}', { caption })}</EmptyStateCaption>
      )}
      {hasLink && <EmptyStateLink onPress={onPress}>{linkText}</EmptyStateLink>}
      {children}
    </EmptyStateContainer>
  );
};

EmptyState.defaultProps = {
  hasLink: false,
  imageUrl:
    'https://ambi-static.s3.amazonaws.com/mobile/empty+states/Class+Illustrations%402x.png',
  onPress: null
};

EmptyState.propTypes = {
  imageUrl: PropTypes.string,
  title: PropTypes.string.isRequired,
  hasLink: PropTypes.bool,
  onPress: PropTypes.func
};

export default EmptyState;
