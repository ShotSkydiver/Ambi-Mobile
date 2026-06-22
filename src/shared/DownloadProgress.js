import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { View } from 'react-native';
import i18n from 'format-message';
import StyledText from './StyledText';

const Container = styled(View)`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(11, 13, 16, 0.24);
`;

const Wrapper = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding-horizontal: 30px;
`;

const Content = styled(View)`
  background-color: white;
  border-radius: 12px;
  width: 100%;
  padding: 18px;
`;

const Text = styled(StyledText)`
  font-weight: 900;
  font-size: 16px;
  color: #1d2128;
`;

const Progress = styled(View)`
  height: 4px;
  border-radius: 2px;
  margin-vertical: 8px;
  background-color: #80cef0;
`;

const ProgressBar = styled(View)`
  flex: 1;
  width: ${({ progress }) => progress}%;
  background-color: #029ee2;
  border-radius: 2px;
`;

const ProgressText = styled(StyledText)`
  width: 100%;
  text-align: right;
`;

function DownloadingProgress({ progress }) {
  return (
    <Container>
      <Wrapper>
        <Content>
          <Text>{i18n('downloading')}</Text>
          <Progress>
            <ProgressBar progress={progress} />
          </Progress>
          <ProgressText>{progress}%</ProgressText>
        </Content>
      </Wrapper>
    </Container>
  );
}

DownloadingProgress.propTypes = {
  progress: PropTypes.number.isRequired
};

export { DownloadingProgress as default };
