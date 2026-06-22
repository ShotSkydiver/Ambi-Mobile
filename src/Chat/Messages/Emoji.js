import React from 'react';
import styled from 'styled-components';
import { Text } from 'react-native';

const StyledMessageEmoji = styled(Text)`
  margin-left: ${({ fromSelf }) => (fromSelf ? 'auto' : '0')};
  margin-right: ${({ fromSelf }) => (fromSelf ? '0' : 'auto')};
  padding: 12px;
  font-size: 48px;
`;

export default function MessageEmoji({ message, ...textProps }) {
  return (
    <StyledMessageEmoji fromSelf={message.fromSelf} {...textProps}>
      {message.body}
    </StyledMessageEmoji>
  );
}
