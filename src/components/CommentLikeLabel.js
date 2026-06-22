/**
 * CommentLikeLabel
 */
/* eslint-disable no-underscore-dangle */
import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useTheme } from '@react-navigation/native';

// hooks
import { AmbiColors } from '../shared/contexts/themeContext';

const { razzmatazz: COLOR_RAZZMATAZZ } = AmbiColors;

const ViewContainer = styled(View)``;
const TouchContainer = styled(TouchableOpacity)``;

const TextContainer = styled(Text)`
  opacity: 0.7;
  font-size: 14px;
  font-family: Circular-Black;
  margin-left: 32px;
  margin-top: 2px;
`;

const CommentLikeLabel = ({
  style,
  counter,
  styleText,
  likedByUser,

  // action
  onPress
}) => {
  const theme = useTheme();
  const {
    legacy: { slateGray: colorSlateGray }
  } = theme;
  let color = colorSlateGray;

  if (likedByUser) {
    color = COLOR_RAZZMATAZZ;
  }

  let text = 'like';
  if (counter > 0) {
    text = `${counter} like${counter > 1 ? 's' : ''}`;
  }

  if (onPress) {
    return (
      <TouchContainer style={style} onPress={onPress}>
        <TextContainer style={{ color, ...styleText }}>{text}</TextContainer>
      </TouchContainer>
    );
  }

  return (
    <ViewContainer style={style}>
      <TextContainer style={{ color, ...styleText }}>{text}</TextContainer>
    </ViewContainer>
  );
};

CommentLikeLabel.propTypes = {
  style: PropTypes.shape(),
  counter: PropTypes.number,
  likedByUser: PropTypes.bool,

  // action
  onPress: PropTypes.func
};

CommentLikeLabel.defaultProps = {
  style: {},
  counter: 0,
  likedByUser: false,

  // action
  onPress: null
};

export default CommentLikeLabel;
