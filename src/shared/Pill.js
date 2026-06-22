import React from 'react';
import { Text } from 'react-native';
import styled from 'styled-components';
import { useTheme } from '@react-navigation/native';

const PillContainer = styled(Text)`
  padding-right: 12px;
  padding-left: 12px;
  height: 18px;
  border-radius: 8.5px;
  overflow: hidden;
  background-color: ${({ color }) => color};
  font-family: Circular-Book;
  font-size: 12px;
  line-height: 16px;
  text-align: center;
`;

const colorForRole = role => {
  switch (role) {
    case 'Entity':
      return 'rgba(2, 158, 226, 0.2)';
    default:
      return 'rgba(2, 158, 226, 0.2)';
  }
};

const Pill = ({ role, roleColor }) => {
  const theme = useTheme();
  const { legacy: themeColors } = theme;
  const colorRole =
    roleColor && roleColor !== '' ? roleColor : colorForRole(role);
  return (
    <PillContainer
      style={{ color: themeColors.darkGreenColor }}
      color={colorRole}
    >
      {role}
    </PillContainer>
  );
};

export default Pill;
