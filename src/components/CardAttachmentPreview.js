/**
 * CardAttachmentPreview
 */
import React from 'react';
import PropTypes from 'prop-types';

// components
import CardAttachmentFile from './CardAttachmentFile';
import CardAttachmentImage from './CardAttachmentImage';
import CardAttachmentVideo from './CardAttachmentVideo';

// helpers
import { getFileType } from '../shared/utils/helpers';

const CardAttachmentPreview = ({
  attachment,
  cardFileProps,
  cardImageProps,
  cardVideoProps,

  // action
  onRemove
}) => {
  const type = getFileType(attachment.type);
  if (type === 'image') {
    return (
      <CardAttachmentImage
        image={attachment}
        onRemove={onRemove}
        {...cardImageProps}
      />
    );
  }
  if (type === 'video') {
    return (
      <CardAttachmentVideo
        video={attachment}
        onRemove={onRemove}
        {...cardVideoProps}
      />
    );
  }

  return (
    <CardAttachmentFile
      file={attachment}
      onRemove={onRemove}
      {...cardFileProps}
    />
  );
};

CardAttachmentPreview.propTypes = {
  attachment: PropTypes.shape({
    type: PropTypes.string
  }),
  cardFileProps: PropTypes.shape(),
  cardImageProps: PropTypes.shape(),
  cardVideoProps: PropTypes.shape(),

  // action
  onRemove: PropTypes.func
};

CardAttachmentPreview.defaultProps = {
  attachment: {},
  cardFileProps: {},
  cardImageProps: {},
  cardVideoProps: {},

  // action
  onRemove: null
};

export default CardAttachmentPreview;
