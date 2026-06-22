/**
 * PostActivityResult
 */
/* eslint-disable no-underscore-dangle */
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useTheme } from '@react-navigation/native';

// components
import ReactionsCounter from './ReactionsCounter';

const Container = styled(View)`
  flex: 1;
  margin-bottom: 18px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ContainerLeft = styled(View)`
  flex: 1;
  align-items: center;
  flex-direction: row;
`;

const ContainerRight = styled(TouchableOpacity)`
  margin-right: 3px;
`;

const ContainerTextComment = styled(Text)`
  color: ${({ color }) => color};
  font-family: Circular Medium;
`;

const PostActivityResult = ({
  post: { comments = [], latestLikes = [], commentsCount } = {},
  onPress,
  disabled = true,
  typeCounterComments,
  navigation
}) => {
  const theme = useTheme();
  const {
    legacy: { slateGray: colorSlateGray }
  } = theme;

  const firstLike = latestLikes[0] || {};
  const userCreated = firstLike.createdBy?.user;
  const showLikes = !!userCreated;
  const counterComments =
    typeCounterComments === 'inScreen' ? comments.length : commentsCount || 0;

  const _onPressInCommentText = () => {
    if (disabled || !onPress) {
      return;
    } // eslint-disable-line
    onPress();
  };

  return (
    <Container>
      <ContainerLeft>
        {showLikes && (
          <ReactionsCounter navigation={navigation} reactions={latestLikes} />
        )}
      </ContainerLeft>
      {counterComments > 0 && (
        <ContainerRight
          onPress={_onPressInCommentText}
          disabled={disabled || !onPress}
        >
          <ContainerTextComment color={colorSlateGray}>
            {`${counterComments} comment${counterComments > 1 ? 's' : ''}`}
          </ContainerTextComment>
        </ContainerRight>
      )}
    </Container>
  );
};

PostActivityResult.propTypes = {
  post: PropTypes.shape({}).isRequired,
  onPress: PropTypes.func,
  disabled: PropTypes.bool,
  typeCounterComments: PropTypes.oneOf(['total', 'inScreen'])
};

PostActivityResult.defaultProps = {
  onPress: null,
  disabled: true,
  typeCounterComments: 'inScreen'
};

export default PostActivityResult;
