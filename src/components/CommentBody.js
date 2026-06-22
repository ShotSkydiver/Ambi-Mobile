/**
 * CommentBody
 */
import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useTheme } from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';

// components
import CommentUserHead from './CommentUserHead';

const Container = styled(View)`
  flex: 1;
  display: flex;
  flex-direction: row;
`;

const IconMenu = styled(View)`
  width: 20px;
  height: 20px;
  margin-top: 5px;
  margin-left: 2px;
`;

const CommentBody = ({
  user,
  children,
  showIconMenu,

  // actions
  onNavigate,
  onPressMenu
}) => {
  const theme = useTheme();
  const {
    legacy: { slateGray: colorSlateGray }
  } = theme;

  return (
    <Container>
      <CommentUserHead user={user} onNavigate={onNavigate}>
        {children}
      </CommentUserHead>
      {showIconMenu && (
        <IconMenu>
          <FeatherIcon
            name="more-vertical"
            size={22}
            style={{ color: colorSlateGray }}
            onPress={onPressMenu}
          />
        </IconMenu>
      )}
    </Container>
  );
};

CommentBody.propTypes = {
  user: PropTypes.shape(),
  children: PropTypes.node,
  showIconMenu: PropTypes.bool,

  // actions
  onNavigate: PropTypes.func,
  onPressMenu: PropTypes.func
};

CommentBody.defaultProps = {
  user: null,
  children: null,
  showIconMenu: false,

  // actions
  onNavigate: () => {},
  onPressMenu: () => {}
};

export default CommentBody;
