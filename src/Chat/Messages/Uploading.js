import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { View, Animated } from 'react-native';
import styled from 'styled-components';
import { useTheme } from '@react-navigation/native';

import Loader from '../../shared/Loader';

const Container = styled(View)`
  margin-top: 8px;
  margin-left: auto;
  height: 72px;
  width: 250px;
  padding: 15px 15px 0 !important;
  font-family: 'Circular';
  position: relative;
  border: 1px solid #f1f1f1;
  border-radius: 10px;
  box-shadow: 10px 5px 5px black;
  overflow: hidden;
`;

const ProgressContainer = styled(View)`
  height: 8px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #80cef0;
`;

const DotsContainer = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

const Progress = styled(Animated.View)`
  flex: 1;
  width: ${({ progress }) => progress}%;
  background-color: #029ee2;
  border-radius: 4px;
`;

function ChatMessageUploading({ item: { progress } }) {
  const [animationProperties, setAnimationProperties] = useState({
    from: 1,
    to: 0
  });
  const [fadeAnimation] = useState(
    new Animated.Value(animationProperties.from)
  );
  useEffect(() => {
    if (progress >= 100) {
      Animated.timing(fadeAnimation, {
        toValue: animationProperties.to,
        duration: 1000,
        useNativeDriver: true
      }).start(() => {
        setAnimationProperties(
          animationProperties.from === 0
            ? { from: 1, to: 0 }
            : { from: 0, to: 1 }
        );
      });
    }
  }, [animationProperties, fadeAnimation, progress]);
  const theme = useTheme();
  const { legacy: themeColors } = theme;
  return (
    <Container
      style={{
        backgroundColor: themeColors.body,
        borderColor: themeColors.elementBGColor
      }}
    >
      <DotsContainer>
        <Loader />
      </DotsContainer>
      <ProgressContainer>
        <Progress progress={progress} style={{ opacity: fadeAnimation }} />
      </ProgressContainer>
    </Container>
  );
}

ChatMessageUploading.propTypes = {
  item: PropTypes.shape({
    progress: PropTypes.number.isRequired
  }).isRequired
};

export { ChatMessageUploading as default };
