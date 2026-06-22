/**
 * CommentReplyLabel
 */
import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useTheme } from '@react-navigation/native';

const ViewContainer = styled(View)``;
const TouchContainer = styled(TouchableOpacity)``;

const TextContainer = styled(Text)`
  opacity: 0.7;
  font-size: 14px;
  font-family: Circular-Black;
  margin-top: 2px;
`;

const CommentReplyLabel = ({
  style,
  styleText,

  // action
  onPress
}) => {
  const text = 'reply';
  const theme = useTheme();
  const {
    legacy: { slateGray: color }
  } = theme;

  if (onPress) {
    return (
      <TouchContainer style={style} onPress={onPress}>
        <TextContainer style={{ color, ...styleText }}>reply</TextContainer>
      </TouchContainer>
    );
  }

  return (
    <ViewContainer style={style}>
      <TextContainer style={{ color, ...styleText }}>{text}</TextContainer>
    </ViewContainer>
  );
};

CommentReplyLabel.propTypes = {
  style: PropTypes.shape(),

  // action
  onPress: PropTypes.func
};

CommentReplyLabel.defaultProps = {
  style: {},

  // action
  onPress: null
};

export default CommentReplyLabel;
