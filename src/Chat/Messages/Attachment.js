import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View, ActivityIndicator } from 'react-native';
import styled from 'styled-components';
import i18n from 'format-message';
import StyledText from '../../shared/StyledText';
import { formatDate, getFilenameColor } from '../../shared/utils/helpers';

import useFileDownload from '../../shared/hooks/useFileDownload';

const Container = styled(TouchableOpacity)`
  margin-top: 0px;
  margin-left: ${({ fromSelf }) => (fromSelf ? 'auto' : '0')};
  margin-right: ${({ fromSelf }) => (fromSelf ? '0' : 'auto')};
  height: 72px;
  width: 250px;
  padding: 15px 15px 0 !important;
  font-family: 'Circular';
  position: relative;
  border: 1px solid #f1f1f1;
  border-radius: 10px;
  background-color: #ffffff;
  /* box-shadow: 0 10px 20px 0 rgba(50, 62, 99, 0.04); */
  box-shadow: 10px 5px 5px black;
  overflow: hidden;
`;

const Content = styled(View)``;

const Header = styled(View)`
  flex-direction: row;
  justify-content: space-between;
`;

const Title = styled(StyledText)`
  font-family: Circular;
  font-weight: bold;
  font-size: 15px;
  color: #1d2128;
`;

const Date = styled(StyledText)`
  font-family: Circular;
  font-weight: 300;
  font-size: 12px;
  color: #8a90a2;
`;

const BottomColorLine = styled(View)`
  height: 4px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${({ color }) => color};
`;

const BottomExtension = styled(View)`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 36px;
  height: 27px;
  border-top-left-radius: 10px;
  background-color: ${({ color }) => color};
`;

const ExtensionTextContainer = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Extension = styled(StyledText)`
  font-size: 10px;
  color: white;
  font-weight: 500;
  text-transform: uppercase;
`;

function ChatMessageAttachment({ message, fromSelf }) {
  const {
    dateCreated,
    attributes: { media }
  } = message;
  const [isOpening, setIsOpening] = useState(false);
  const { filename, contentType, uniqueIdentifier } = media;
  const splitFilename = filename ? filename.split('.') : contentType.split('/');
  const fileIdentifier = filename || `${uniqueIdentifier}.${splitFilename}`;
  const color = getFilenameColor(fileIdentifier);
  const { download } = useFileDownload({ file: media });
  const openFile = () => {
    if (!isOpening) {
      setIsOpening(true);
      download().then(() => setIsOpening(false));
    }
  };
  return (
    <Container fromSelf={fromSelf} onPress={openFile}>
      <Content>
        <Header>
          <Title>{fileIdentifier}</Title>
          {isOpening && <ActivityIndicator />}
        </Header>
        <Date>
          {i18n('Uploaded')} {formatDate(dateCreated)}
        </Date>
      </Content>
      <BottomColorLine color={color} />
      <BottomExtension color={color}>
        <ExtensionTextContainer>
          <Extension>{splitFilename[splitFilename.length - 1]}</Extension>
        </ExtensionTextContainer>
      </BottomExtension>
    </Container>
  );
}

ChatMessageAttachment.propTypes = {
  fromSelf: PropTypes.bool.isRequired,
  message: PropTypes.shape().isRequired
};

export { ChatMessageAttachment as default };
