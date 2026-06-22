/**
 * ManageKeyboard
 */
import React from 'react';
import propTypes from 'prop-types';
import { Platform, KeyboardAvoidingView } from 'react-native';
import styled from 'styled-components';

const Container = styled(KeyboardAvoidingView)`
  flex: 1;
`;

const ManageKeyboard = ({ children }) => {
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 60 : 70;

  return (
    <Container
      enabled
      behavior="padding"
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      {children}
    </Container>
  );
};

ManageKeyboard.propTypes = {
  children: propTypes.element
};

ManageKeyboard.defaultProps = {
  children: null
};

export default ManageKeyboard;
