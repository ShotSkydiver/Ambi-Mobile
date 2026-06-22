import React, { useState, useEffect } from 'react';
import { Animated, View, Text, useColorScheme } from 'react-native';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Spacer } from '../Auth/shared';
import { AmbiColors, ThemeConstants } from './contexts/themeContext';

const BOUNCE_DURATION_MS = 1000;

const Container = styled(View)`
  height: 30px;
  padding-top: 7.5px;
`;

const Content = styled(View)``;

const LoaderContainer = styled(View)`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
`;

const FullScreenLoaderContainer = styled(View)`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  align-items: center;
  justify-content: center;
  opacity: 1;
  z-index: 10;
  elevation: 10;
`;

const SpinnerItem = styled(Animated.View)`
  width: 15px;
  height: 15px;
  background-color: ${({ color }) => color};
  margin-horizontal: 12px;
  border-radius: 7.5px;
`;

const LoaderText = styled(Text)`
  font-family: Circular-Bold;
  font-size: 16px;
  line-height: 20px;
  text-align: center;
`;

function Spinner({ color, delayMs }) {
  const [animationProperties, setAnimationProperties] = useState({
    values: { from: 1, to: 1.75 },
    counter: 0
  });
  const [scaleAnimation] = useState(
    new Animated.Value(animationProperties.values.from)
  );
  useEffect(() => {
    const delay = animationProperties.counter === 0 ? delayMs : 0;
    Animated.timing(scaleAnimation, {
      toValue: animationProperties.values.to,
      delay,
      duration: BOUNCE_DURATION_MS,
      useNativeDriver: true
    }).start(() => {
      setAnimationProperties({
        values:
          animationProperties.values.from === 1.75
            ? { from: 1, to: 1.75 }
            : { from: 1.75, to: 1 },
        counter: animationProperties.counter + 1
      });
    });
  }, [animationProperties, scaleAnimation]);
  return (
    <SpinnerItem
      color={color}
      style={{ transform: [{ scale: scaleAnimation }] }}
    />
  );
}

function Loader({ text }) {
  const theme = useColorScheme();
  const themeColors = ThemeConstants[theme];
  return (
    <Container>
      <Content>
        <LoaderContainer>
          <Spinner color={AmbiColors.razzmatazz} delayMs={0} />
          <Spinner
            color={AmbiColors.ambiLightBlue}
            delayMs={BOUNCE_DURATION_MS / 2}
          />
          <Spinner color={AmbiColors.positive} delayMs={BOUNCE_DURATION_MS} />
          <Spinner
            color={AmbiColors.warning}
            delayMs={(3 * BOUNCE_DURATION_MS) / 2}
          />
        </LoaderContainer>
        {text && (
          <>
            <Spacer height="36px" />
            <LoaderText style={{ color: themeColors.textPrimary }}>
              {text}
            </LoaderText>
          </>
        )}
      </Content>
    </Container>
  );
}

Loader.defaultProps = {
  text: null
};

Loader.propTypes = {
  text: PropTypes.string
};

export function FullScreenLoader({ text, bgColor }) {
  const theme = useColorScheme();
  const themeColors = ThemeConstants[theme];
  return (
    <FullScreenLoaderContainer
      style={{ backgroundColor: bgColor || themeColors.bodyTransparent }}
    >
      <Loader text={text} />
    </FullScreenLoaderContainer>
  );
}

export { Loader as default };
