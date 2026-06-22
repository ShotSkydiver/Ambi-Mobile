/* ********************************************************************************

THIS FILE IS NEVER IMPORTED OR USED AT ALL

******************************************************************************** */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { View, Modal, TouchableOpacity, Alert } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import RNFetchBlob from 'rn-fetch-blob';
import i18n from 'format-message';
import StyledText from '../../shared/StyledText';
import DownloadProgress from '../../shared/DownloadProgress';

import { getFilenameColor, formatBytes } from '../../shared/utils/helpers';

const Container = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Title = styled(StyledText)`
  margin-top: 8px;
  margin-bottom: 2px;
  font-size: 18px;
  font-weight: bold;
  color: #1d2128;
`;

const Size = styled(StyledText)`
  font-size: 16px;
  font-weight: 300;
  color: #1d2128;
  margin-bottom: 24px;
`;

const ButtonContainer = styled(TouchableOpacity)`
  width: 160px;
  height: 44px;
  border-radius: 8px;
  background-color: #019ee1;
`;

const ButtonWrapper = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ButtonText = styled(StyledText)`
  font-size: 16px;
  font-weight: 500;
  color: white;
`;

function OpenButton({ label, onPress }) {
  return (
    <ButtonContainer onPress={onPress}>
      <ButtonWrapper>
        <ButtonText>{label}</ButtonText>
      </ButtonWrapper>
    </ButtonContainer>
  );
}

OpenButton.propTypes = {
  label: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired
};

function ModalAttachmentDownload({ media }) {
  const [progress, setProgress] = useState(null);
  const {
    filename,
    sizeBytes,
    links: { download: downloadLink }
  } = media;
  const splitFilename = filename.split('.');
  async function openAttachment() {
    let downloadResult;
    try {
      downloadResult = await RNFetchBlob.config({
        // add this option that makes response data to be stored as a file,
        // this is much more performant.
        fileCache: true,
        // by adding this option, the temp files will have a file extension
        appendExt: splitFilename[splitFilename.length - 1]
      })
        .fetch('GET', downloadLink, {})
        .progress((received, total) => {
          setProgress(Math.round((100 * received) / total));
        });
    } catch (exception) {
      console.warn('Unable to download file: ', exception);
      Alert.alert(`${i18n('Unable to download file')}: ${exception}`);
      return;
    }
    setProgress(null);
    const { status } = downloadResult.info();
    if (status === 200) {
      let previewResult;
      try {
        previewResult = await RNFetchBlob.ios.previewDocument(
          downloadResult.path()
        );
      } catch (exception) {
        console.warn('Unable to preview: ', exception);
        Alert.alert(`${i18n('Unable to preview file')}: ${exception}`);
        return;
      }
      console.warn('preview: ', previewResult);
    } else {
      // handle other status codes
    }
  }
  return (
    <Modal animationType="slide" transparent={false} visible>
      <Container>
        <FeatherIcon name="file" size={80} color={getFilenameColor(filename)} />
        <Title>{filename}</Title>
        <Size>{formatBytes(sizeBytes)}</Size>
        <OpenButton label={i18n('Open')} onPress={openAttachment} />
      </Container>
      {progress && <DownloadProgress progress={progress} />}
    </Modal>
  );
}

ModalAttachmentDownload.propTypes = {
  media: PropTypes.shape({
    filename: PropTypes.string,
    sizeBytes: PropTypes.number,
    links: PropTypes.shape({
      download: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

export { ModalAttachmentDownload as default };
