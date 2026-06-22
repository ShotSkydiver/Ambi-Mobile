import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native';
import moment from 'moment';
import styled from 'styled-components';
import i18n from 'format-message';
import { useTheme } from '@react-navigation/native';
import useFileDownload from '../../shared/hooks/useFileDownload';
import { getFileExtension, getFilenameColor } from '../../shared/utils/helpers';

const StyledFileAttachment = styled(TouchableOpacity)`
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e6eaf2;
  border-bottom-width: 4px;
  border-bottom-color: ${({ color }) => color};
  margin-top: 16px;
`;

const StyledFileTitle = styled(Text)`
  font-size: 16px;
  font-weight: bold;
  line-height: 20px;
  margin-bottom: 4px;
`;

const StyledFileDescription = styled(Text)`
  font-family: Circular;
  font-size: 14px;
  font-weight: 300;
  line-height: 18px;
`;

const StyledTypeIndicatorContainer = styled(View)`
  position: absolute;
  right: -1;
  bottom: 0;
  border-top-left-radius: 8px;
  border-bottom-right-radius: 8px;
  background-color: ${({ bgColor }) => bgColor};
  padding: 9px 8px 7px 9px;
  margin-bottom: -4px;
`;

const StyledTypeIndicator = styled(Text)`
  font-size: 10px;
  text-align: center;
  font-family: Circular-Bold;
`;

const FileAttachment = ({ file }) => {
  const { dateCreated, filename } = file;
  const color = getFilenameColor(filename);
  const dateUploaded = moment(dateCreated);
  const theme = useTheme();
  const { legacy: themeColors } = theme;

  const { download, state } = useFileDownload({ file });
  return (
    <StyledFileAttachment
      status={state.status}
      onPress={download}
      disabled={state.status === 'downloading'}
      color={color}
    >
      <StyledFileTitle style={{ color: themeColors.darkGreenColor }}>
        {filename}
      </StyledFileTitle>
      <StyledFileDescription style={{ color: themeColors.slateGray }}>
        {i18n('Uploaded {date} at {time}', {
          date: dateUploaded.format('MMM D'),
          time: dateUploaded.format('h:mma')
        })}
      </StyledFileDescription>
      <StyledTypeIndicatorContainer bgColor={color}>
        <StyledTypeIndicator>{getFileExtension(filename)}</StyledTypeIndicator>
      </StyledTypeIndicatorContainer>
    </StyledFileAttachment>
  );
};

const FileAttachments = ({ fileAttachments }) => {
  return (
    <View>
      {fileAttachments.map(file => (
        <FileAttachment key={file.id} file={file} />
      ))}
    </View>
  );
};

FileAttachments.propTypes = {
  fileAttachments: PropTypes.arrayOf(PropTypes.shape({})).isRequired
};

export default memo(FileAttachments, () => true);
