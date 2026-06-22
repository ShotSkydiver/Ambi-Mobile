/**
 * CommentText
 */
/* eslint-disable no-underscore-dangle */
import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useTheme } from '@react-navigation/native';
import Hyperlink from 'react-native-hyperlink';
import InAppBrowser from 'react-native-inappbrowser-reborn';

// const
const LINE_HEIGHT = 20;

const Container = styled(View)`
  flex: 1;
`;

const ContainerSeeMore = styled(Text)`
  font-size: 13px;
  line-height: 18px;
  font-family: Circular Black;
`;

const ContentText = styled(Text)`
  font-size: 15px;
  min-height: 26px;
  line-height: ${LINE_HEIGHT}px;
  font-family: Circular-Book;
`;

const CommentText = ({ text, styleText }) => {
  const [seeMore, setSeeMore] = useState('initial');

  const theme = useTheme();
  const {
    legacy: { slateGray: colorSlateGray }
  } = theme;

  const _onLayout = useCallback(
    e => {
      const { height } = e.nativeEvent.layout;
      const countLines = Math.floor(height / LINE_HEIGHT);

      if (seeMore === 'initial' && countLines > 4) {
        setSeeMore('visible');
      }
    },
    [seeMore]
  );
  const _onSeeMore = () => setSeeMore('hide');

  if (!text) { return null; } // eslint-disable-line

  return (
    <Container>
      <Hyperlink linkStyle={{ color: '#337ab7' }} onPress={InAppBrowser.open}>
        <ContentText
          style={styleText}
          onLayout={_onLayout}
          numberOfLines={seeMore === 'visible' ? 4 : 0}
        >
          {text}
        </ContentText>
      </Hyperlink>
      {seeMore === 'visible' && (
        <TouchableOpacity onPress={_onSeeMore}>
          <ContainerSeeMore style={{ color: colorSlateGray }}>
            see more
          </ContainerSeeMore>
        </TouchableOpacity>
      )}
    </Container>
  );
};

CommentText.propTypes = {
  text: PropTypes.string,
  styleText: PropTypes.shape({})
};

CommentText.defaultProps = {
  text: null,
  styleText: {}
};

export default CommentText;
