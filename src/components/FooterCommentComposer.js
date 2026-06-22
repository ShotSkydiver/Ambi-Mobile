/**
 * FooterCommentComposer
 */
import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components';
import { useTheme } from '@react-navigation/native';

// containers
import CommentComposer from '../containers/CommentComposer';

const Container = styled(View)`
  width: 100%;
  bottom: 0;
  margin: 0;
  position: absolute;
  background-color: ${({ bgColor }) => bgColor};
`;

const FooterCommentComposer = props => {
  const theme = useTheme();
  const { legacy: themeColors } = theme;

  return (
    <Container bgColor={themeColors.body}>
      <CommentComposer {...props} />
    </Container>
  );
};

FooterCommentComposer.propTypes = {};
FooterCommentComposer.defaultProps = {};

export default FooterCommentComposer;
