/**
 * CardAttachmentFile
 */
/* eslint-disable no-underscore-dangle */
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native';
import i18n from 'format-message';
import moment from 'moment';
import styled from 'styled-components';
import { useTheme } from '@react-navigation/native';
import useFileDownload from '../shared/hooks/useFileDownload';
import { getFileExtension, getFilenameColor } from '../shared/utils/helpers';

// components
import CardAttachmentBody from './CardAttachmentBody';

const Container = styled(TouchableOpacity)`
  width: 100%;
  height: 70px;
  padding: 16px;
  border: 0.5px solid;
  border-radius: 8px;
  border-bottom-width: 4px;
  border-bottom-color: ${({ color }) => color};
`;

const Title = styled(Text)`
  font-size: 16px;
  font-weight: bold;
  line-height: 20px;
  margin-bottom: 4px;
`;

const Description = styled(Text)`
  font-family: Circular;
  font-size: 14px;
  font-weight: 300;
  line-height: 18px;
`;

const StyledTypeIndicatorContainer = styled(View)`
  right: -1;
  bottom: 0;
  padding: 9px 8px 7px 9px;
  position: absolute;
  margin-bottom: -4px;
  background-color: ${({ bgColor }) => bgColor};
  border-top-left-radius: 8px;
  border-bottom-right-radius: 8px;
`;

const StyledTypeIndicator = styled(Text)`
  font-size: 10px;
  text-align: center;
  font-family: Circular-Bold;
`;

const CardAttachmentFile = ({ style, iconRemoveStyle, file, onRemove }) => {
  const { dateCreated, filename = '', uniqueIdentifier: imageKey } = file;
  console.warn('wtf file: ', file, filename);
  const color = getFilenameColor(filename);
  const dateUploaded = moment(dateCreated);
  const theme = useTheme();
  const { legacy: themeColors } = theme;

  const { download, state } = useFileDownload({ file });

  const _onRemove = useCallback(() => onRemove(imageKey), [onRemove, imageKey]);

  if (!file) {
    return null;
  }
  return (
    <CardAttachmentBody
      style={{ ...style, maxWidth: 'auto' }}
      onRemove={onRemove ? _onRemove : null}
      iconRemoveStyle={iconRemoveStyle}
    >
      <Container
        status={state.status}
        onPress={download}
        disabled={state.status === 'downloading'}
        color={color}
        style={{
          borderColor: themeColors.systemBorderColor,
          backgroundColor: themeColors.backgroundColor
        }}
      >
        <Title style={{ color: themeColors.darkGreenColor }}>{filename}</Title>
        <Description style={{ color: themeColors.slateGray }}>
          {i18n('Uploaded {date} at {time}', {
            date: dateUploaded.format('MMM D'),
            time: dateUploaded.format('h:mma')
          })}
        </Description>
        <StyledTypeIndicatorContainer bgColor={color}>
          <StyledTypeIndicator>
            {getFileExtension(`${filename}`)}
          </StyledTypeIndicator>
        </StyledTypeIndicatorContainer>
      </Container>
    </CardAttachmentBody>
  );
};

CardAttachmentFile.propTypes = {
  file: PropTypes.shape({})
};

CardAttachmentFile.defaultProps = {
  file: null
};

export default CardAttachmentFile;
