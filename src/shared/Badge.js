import React from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import i18n from 'format-message';
import { useTheme } from '@react-navigation/native';

const BadgeContainer = styled(View)`
  background-color: ${({ bgColor }) => bgColor};
  margin-top: 4px;
  padding: 0 4px;
  border-radius: 8.5px;
  align-self: flex-start;
  justify-content: center;
`;

const BadgeTitle = styled(Text)`
  font-family: Circular;
  font-size: 12px;
  font-weight: 300;
  letter-spacing: 0;
  line-height: 16px;
  text-align: center;
`;

const Badge = ({ title, bgColor, style }) => {
  const theme = useTheme();
  const { legacy: themeColors } = theme;

  return (
    <BadgeContainer bgColor={bgColor} style={style}>
      <BadgeTitle style={{ color: themeColors.darkGreenColor }}>
        {title}
      </BadgeTitle>
    </BadgeContainer>
  );
};

Badge.defaultProps = {
  title: i18n('student'),
  bgColor: '#a8acb8'
};

Badge.propTypes = {
  title: PropTypes.string,
  bgColor: PropTypes.string
};

export default Badge;
