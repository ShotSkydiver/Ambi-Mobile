/**
 * CardAttachmentImage
 */
/* eslint-disable no-underscore-dangle */
import React, { useCallback } from 'react';
import { Image } from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// components
import CardAttachmentBody from './CardAttachmentBody';

const MediaImage = styled(Image)`
  width: 140px;
  height: 90px;
  border-radius: 6px;
`;

const CardAttachmentImage = ({
  image,
  style,
  imageStyle,
  iconRemoveStyle,

  // action
  onRemove
}) => {
  const { uniqueIdentifier: imageKey } = image || {};
  const _onRemove = useCallback(() => onRemove(imageKey), [onRemove, imageKey]);

  if (image === null) {
    return null;
  }
  return (
    <CardAttachmentBody
      style={style}
      onRemove={onRemove ? _onRemove : null}
      iconRemoveStyle={iconRemoveStyle}
    >
      <MediaImage
        source={{ uri: image.path }}
        style={imageStyle}
        resizeMode="cover"
      />
    </CardAttachmentBody>
  );
};

CardAttachmentImage.propTypes = {
  style: PropTypes.shape(),
  image: PropTypes.shape(),
  onRemove: PropTypes.func,
  imageStyle: PropTypes.shape(),
  iconRemoveStyle: PropTypes.shape()
};

CardAttachmentImage.defaultProps = {
  style: {},
  image: null,
  onRemove: null,
  imageStyle: {},
  iconRemoveStyle: {}
};

export default CardAttachmentImage;
